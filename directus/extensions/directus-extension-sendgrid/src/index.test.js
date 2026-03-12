import { describe, it, expect, vi, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import extension from './index.js';

// ── helpers ───────────────────────────────────────────────────────────────────

// Each test uses a unique IP so the module-level rate limiter never interferes
let ipCounter = 0;
function uniqueIp() {
	ipCounter++;
	return `10.0.${Math.floor(ipCounter / 255)}.${ipCounter % 255 || 1}`;
}

function makeApp(envOverrides = {}) {
	const app = express();
	app.set('trust proxy', true); // so req.ip reads from X-Forwarded-For
	app.use(express.json());
	const router = express.Router();
	extension.handler(router, {
		env: {
			SENDGRID_API_KEY: 'SG.test-key',
			SENDGRID_FROM_EMAIL: 'from@test.com',
			SENDGRID_TO_EMAIL: 'to@test.com',
			RECAPTCHA_SECRET_KEY: '',
			RECAPTCHA_SCORE_THRESHOLD: '0.5',
			...envOverrides,
		},
		logger: {
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		},
	});
	app.use('/', router);
	return app;
}

// Wrap supertest requests to always use a unique IP
function post(app, ip) {
	return request(app).post('/send').set('X-Forwarded-For', ip || uniqueIp());
}

function mockSendGridSuccess() {
	vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
		ok: false,
		status: 202,
		text: async () => '',
	}));
}

// ── input validation ──────────────────────────────────────────────────────────

describe('POST /send — input validation', () => {
	afterEach(() => vi.restoreAllMocks());

	it('returns 400 when fields is missing', async () => {
		mockSendGridSuccess();
		const res = await post(makeApp()).send({ subject: 'Hi' });
		expect(res.status).toBe(400);
		expect(res.body.error).toMatch(/fields/i);
	});

	it('returns 400 when fields is an empty array', async () => {
		mockSendGridSuccess();
		const res = await post(makeApp()).send({ fields: [] });
		expect(res.status).toBe(400);
		expect(res.body.error).toMatch(/fields/i);
	});

	it('returns 400 when fields is not an array', async () => {
		mockSendGridSuccess();
		const res = await post(makeApp()).send({ fields: 'bad' });
		expect(res.status).toBe(400);
	});
});

// ── missing env config ────────────────────────────────────────────────────────

describe('POST /send — missing env config', () => {
	afterEach(() => vi.restoreAllMocks());

	it('returns 500 when SENDGRID_API_KEY is missing', async () => {
		const res = await post(makeApp({ SENDGRID_API_KEY: '' }))
			.send({ fields: [{ label: 'Name', value: 'John' }] });
		expect(res.status).toBe(500);
		expect(res.body.error).toMatch(/not configured/i);
	});

	it('returns 500 when SENDGRID_FROM_EMAIL is missing', async () => {
		const res = await post(makeApp({ SENDGRID_FROM_EMAIL: '' }))
			.send({ fields: [{ label: 'Name', value: 'John' }] });
		expect(res.status).toBe(500);
	});

	it('returns 500 when SENDGRID_TO_EMAIL is missing', async () => {
		const res = await post(makeApp({ SENDGRID_TO_EMAIL: '' }))
			.send({ fields: [{ label: 'Name', value: 'John' }] });
		expect(res.status).toBe(500);
	});
});

// ── reCAPTCHA ─────────────────────────────────────────────────────────────────

describe('POST /send — reCAPTCHA enabled', () => {
	afterEach(() => vi.restoreAllMocks());

	it('returns 400 when recaptchaToken is missing', async () => {
		const res = await post(makeApp({ RECAPTCHA_SECRET_KEY: 'secret' }))
			.send({ fields: [{ label: 'Name', value: 'John' }] });
		expect(res.status).toBe(400);
		expect(res.body.error).toMatch(/recaptcha/i);
	});

	it('returns 403 when reCAPTCHA verification fails', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
			json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
		}));
		const res = await post(makeApp({ RECAPTCHA_SECRET_KEY: 'secret' }))
			.send({ fields: [{ label: 'Name', value: 'John' }], recaptchaToken: 'bad-token' });
		expect(res.status).toBe(403);
		expect(res.body.error).toMatch(/recaptcha/i);
	});

	it('returns 403 when reCAPTCHA score is below threshold', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
			json: async () => ({ success: true, score: 0.1 }),
		}));
		const res = await post(makeApp({ RECAPTCHA_SECRET_KEY: 'secret', RECAPTCHA_SCORE_THRESHOLD: '0.5' }))
			.send({ fields: [{ label: 'Name', value: 'John' }], recaptchaToken: 'low-score-token' });
		expect(res.status).toBe(403);
		expect(res.body.error).toMatch(/spam/i);
	});

	it('passes when reCAPTCHA score meets threshold', async () => {
		vi.stubGlobal('fetch', vi.fn()
			.mockResolvedValueOnce({ json: async () => ({ success: true, score: 0.9 }) })
			.mockResolvedValueOnce({ ok: false, status: 202, text: async () => '' }),
		);
		const res = await post(makeApp({ RECAPTCHA_SECRET_KEY: 'secret' }))
			.send({ fields: [{ label: 'Name', value: 'John' }], recaptchaToken: 'good-token' });
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
	});
});

// ── SendGrid send ─────────────────────────────────────────────────────────────

describe('POST /send — SendGrid integration', () => {
	afterEach(() => vi.restoreAllMocks());

	it('returns 200 on successful send (202 from SendGrid)', async () => {
		mockSendGridSuccess();
		const res = await post(makeApp())
			.send({ subject: 'Hello', fields: [{ label: 'Name', value: 'Jane' }] });
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
	});

	it('returns 200 on successful send (200 from SendGrid)', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			text: async () => '',
		}));
		const res = await post(makeApp())
			.send({ fields: [{ label: 'Name', value: 'Jane' }] });
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
	});

	it('uses default subject when not provided', async () => {
		let sentBody;
		vi.stubGlobal('fetch', vi.fn().mockImplementation(async (_url, opts) => {
			sentBody = JSON.parse(opts.body);
			return { ok: true, status: 200, text: async () => '' };
		}));
		await post(makeApp()).send({ fields: [{ label: 'Name', value: 'Jane' }] });
		expect(sentBody.subject).toBe('New Contact Form Submission');
	});

	it('forwards the correct to/from emails to SendGrid', async () => {
		let sentBody;
		vi.stubGlobal('fetch', vi.fn().mockImplementation(async (_url, opts) => {
			sentBody = JSON.parse(opts.body);
			return { ok: true, status: 200, text: async () => '' };
		}));
		await post(makeApp())
			.send({ subject: 'Hi', fields: [{ label: 'Name', value: 'Jane' }] });
		expect(sentBody.from.email).toBe('from@test.com');
		expect(sentBody.personalizations[0].to[0].email).toBe('to@test.com');
	});

	it('returns error status when SendGrid returns 4xx', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: false,
			status: 400,
			text: async () => 'Bad Request',
		}));
		const res = await post(makeApp())
			.send({ fields: [{ label: 'Name', value: 'Jane' }] });
		expect(res.status).toBe(400);
		expect(res.body.error).toMatch(/failed to send/i);
	});

	it('returns 500 when fetch throws', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
		const res = await post(makeApp())
			.send({ fields: [{ label: 'Name', value: 'Jane' }] });
		expect(res.status).toBe(500);
		expect(res.body.error).toMatch(/failed to send/i);
	});
});

// ── sanitization ──────────────────────────────────────────────────────────────

describe('POST /send — HTML sanitization', () => {
	afterEach(() => vi.restoreAllMocks());

	it('escapes HTML special chars in field label and value', async () => {
		let sentBody;
		vi.stubGlobal('fetch', vi.fn().mockImplementation(async (_url, opts) => {
			sentBody = JSON.parse(opts.body);
			return { ok: true, status: 200, text: async () => '' };
		}));
		await post(makeApp())
			.send({ fields: [{ label: '<script>alert(1)</script>', value: '<b>xss</b>' }] });
		const html = sentBody.content[0].value;
		expect(html).not.toContain('<script>');
		expect(html).not.toContain('<b>');
		expect(html).toContain('&lt;script&gt;');
		expect(html).toContain('&lt;b&gt;');
	});

	it('escapes HTML in subject', async () => {
		let sentBody;
		vi.stubGlobal('fetch', vi.fn().mockImplementation(async (_url, opts) => {
			sentBody = JSON.parse(opts.body);
			return { ok: true, status: 200, text: async () => '' };
		}));
		await post(makeApp())
			.send({ subject: '<evil>', fields: [{ label: 'x', value: 'y' }] });
		expect(sentBody.subject).toBe('&lt;evil&gt;');
	});
});

// ── rate limiting ─────────────────────────────────────────────────────────────

describe('POST /send — rate limiting', () => {
	afterEach(() => vi.restoreAllMocks());

	it('blocks after exceeding 5 requests from the same IP', async () => {
		mockSendGridSuccess();
		const app = makeApp();
		const ip = uniqueIp(); // dedicated IP so only this test uses it
		const payload = { fields: [{ label: 'Name', value: 'Test' }] };

		const responses = await Promise.all(
			Array.from({ length: 6 }, () =>
				request(app).post('/send').set('X-Forwarded-For', ip).send(payload),
			),
		);

		const statuses = responses.map((r) => r.status);
		expect(statuses).toContain(429);
	});

	it('allows requests under the limit', async () => {
		mockSendGridSuccess();
		const app = makeApp();
		const ip = uniqueIp();
		const payload = { fields: [{ label: 'Name', value: 'Test' }] };

		const responses = await Promise.all(
			Array.from({ length: 3 }, () =>
				request(app).post('/send').set('X-Forwarded-For', ip).send(payload),
			),
		);

		expect(responses.every((r) => r.status !== 429)).toBe(true);
	});
});
