// In-memory rate limiter: max requests per IP within a time window
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // max 5 emails per window per IP

function isRateLimited(ip) {
	const now = Date.now();
	const entry = rateLimitMap.get(ip);

	if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
		rateLimitMap.set(ip, { windowStart: now, count: 1 });
		return false;
	}

	entry.count++;

	if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
		return true;
	}

	return false;
}

// Clean up stale entries every 30 minutes
setInterval(() => {
	const now = Date.now();
	for (const [ip, entry] of rateLimitMap) {
		if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
			rateLimitMap.delete(ip);
		}
	}
}, 30 * 60 * 1000);

async function verifyRecaptcha(token, secretKey, logger) {
	try {
		const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
		});

		const data = await response.json();

		if (!data.success) {
			logger.warn(`reCAPTCHA verification failed: ${JSON.stringify(data['error-codes'])}`);
			return { success: false, score: 0 };
		}

		return { success: true, score: data.score };
	} catch (error) {
		logger.error(`reCAPTCHA verification error: ${error.message}`);
		return { success: false, score: 0 };
	}
}

export default {
	id: 'sendgrid',
	handler: (router, { env, logger }) => {
		router.post('/send', async (req, res) => {
			// --- Rate limiting ---
			const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

			if (isRateLimited(clientIp)) {
				logger.warn(`Rate limit exceeded for IP: ${clientIp}`);
				return res.status(429).json({ error: 'Too many requests. Please try again later.' });
			}

			// --- Environment validation ---
			const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
			const SENDGRID_FROM_EMAIL = env.SENDGRID_FROM_EMAIL;
			const SENDGRID_TO_EMAIL = env.SENDGRID_TO_EMAIL;
			const RECAPTCHA_SECRET_KEY = env.RECAPTCHA_SECRET_KEY;
			const RECAPTCHA_SCORE_THRESHOLD = parseFloat(env.RECAPTCHA_SCORE_THRESHOLD || '0.5');

			if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL || !SENDGRID_TO_EMAIL) {
				logger.error('SendGrid environment variables are not configured.');
				return res.status(500).json({ error: 'Email service is not configured.' });
			}

			const { subject, fields, recaptchaToken } = req.body;

			// --- reCAPTCHA v3 verification ---
			if (RECAPTCHA_SECRET_KEY) {
				if (!recaptchaToken) {
					return res.status(400).json({ error: 'reCAPTCHA token is required.' });
				}

				const captchaResult = await verifyRecaptcha(recaptchaToken, RECAPTCHA_SECRET_KEY, logger);

				if (!captchaResult.success) {
					return res.status(403).json({ error: 'reCAPTCHA verification failed.' });
				}

				if (captchaResult.score < RECAPTCHA_SCORE_THRESHOLD) {
					logger.warn(`reCAPTCHA score too low: ${captchaResult.score} (threshold: ${RECAPTCHA_SCORE_THRESHOLD})`);
					return res.status(403).json({ error: 'Request blocked by spam protection.' });
				}

				logger.info(`reCAPTCHA score: ${captchaResult.score}`);
			}

			// --- Validate fields ---
			if (!fields || !Array.isArray(fields) || fields.length === 0) {
				return res.status(400).json({ error: 'Missing required field: fields' });
			}

			// Sanitize field values to prevent HTML injection in emails
			const sanitize = (str) => String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

			// Build HTML email body from form fields
			const rows = fields
				.map(
					(f) =>
						`<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #eee;">${sanitize(f.label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${sanitize(f.value)}</td></tr>`
				)
				.join('');

			const html = `
				<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
					<h2 style="color:#15181a;">${sanitize(subject || 'New Contact Form Submission')}</h2>
					<table style="width:100%;border-collapse:collapse;">
						${rows}
					</table>
				</div>
			`;

			try {
				const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${SENDGRID_API_KEY}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						personalizations: [{ to: [{ email: SENDGRID_TO_EMAIL }] }],
						from: { email: SENDGRID_FROM_EMAIL },
						subject: sanitize(subject || 'New Contact Form Submission'),
						content: [{ type: 'text/html', value: html }],
					}),
				});

				if (response.ok || response.status === 202) {
					logger.info('Email sent successfully via SendGrid.');
					return res.json({ success: true });
				}

				const errorBody = await response.text();
				logger.error(`SendGrid API error: ${response.status} - ${errorBody}`);
				return res.status(response.status).json({ error: 'Failed to send email.' });
			} catch (error) {
				logger.error(`SendGrid request failed: ${error.message}`);
				return res.status(500).json({ error: 'Failed to send email.' });
			}
		});
	},
};
