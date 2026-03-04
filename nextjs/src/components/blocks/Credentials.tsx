'use client';

import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface CredentialsBadge {
	id: string;
	sort?: number | null;
	image?: string | null;
	alt?: string | null;
	url?: string | null;
}

interface CredentialsProps {
	data: {
		id: string;
		headline?: string | null;
		headline_emphasis?: string | null;
		description?: string | null;
		background_color?: string | null;
		badges?: CredentialsBadge[];
	};
}

export default function Credentials({ data }: CredentialsProps) {
	const { id, headline, headline_emphasis, description, background_color, badges } = data;

	const sortedBadges = badges ? [...badges].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];
	const bgColor = background_color ?? '#0b2e36';

	// Split into two rows: first 3 on top, rest offset below
	const topRow = sortedBadges.slice(0, 3);
	const bottomRow = sortedBadges.slice(3, 6);

	return (
		<div
			className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 px-6 md:px-12 lg:px-[120px] py-[60px] lg:py-[80px]"
			style={{ background: bgColor }}
			data-directus={setAttr({ collection: 'block_credentials', item: id, fields: ['headline', 'headline_emphasis', 'description', 'badges', 'background_color'], mode: 'popover' })}
		>
			{/* Left — text content */}
			<div
				className="flex flex-col gap-6 max-w-full lg:max-w-[644px] shrink-0"
				data-directus={setAttr({ collection: 'block_credentials', item: id, fields: ['headline', 'headline_emphasis', 'description'], mode: 'popover' })}
			>
				{(headline || headline_emphasis) && (
					<h2 className="font-heading font-normal text-[32px] leading-[40px] md:text-[40px] md:leading-[56px] text-white">
						<span dangerouslySetInnerHTML={{ __html: headline }} />
						{headline_emphasis && (
							<span className="font-bold italic text-[#ee4065]" dangerouslySetInnerHTML={{ __html: headline_emphasis }} />
						)}
					</h2>
				)}
				{description && (
					<div className="font-sans font-normal text-[16px] md:text-[18px] leading-[26px] text-white/90" dangerouslySetInnerHTML={{ __html: description }} />
				)}
			</div>

			{/* Right — badges grid */}
			{sortedBadges.length > 0 && (
				<div
					className="flex flex-col gap-0 shrink-0"
					data-directus={setAttr({ collection: 'block_credentials', item: id, fields: 'badges', mode: 'modal' })}
				>
					{/* Top row */}
					{topRow.length > 0 && (
						<div className="flex flex-wrap gap-2 items-center justify-center lg:justify-start">
							{topRow.map((badge) => (
								<BadgeItem key={badge.id} badge={badge} />
							))}
						</div>
					)}
					{/* Bottom row — offset down to match design stagger */}
					{bottomRow.length > 0 && (
						<div className="flex flex-wrap gap-2 items-center justify-center lg:justify-start mt-4 lg:mt-6">
							{bottomRow.map((badge) => (
								<BadgeItem key={badge.id} badge={badge} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function BadgeItem({ badge }: { badge: CredentialsBadge }) {
	const inner = badge.image ? (
		<div className="relative h-[90px] w-[110px] md:h-[114px] md:w-[130px]">
			<DirectusImage
				uuid={badge.image}
				alt={badge.alt ?? ''}
				fill
				sizes="(max-width: 768px) 110px, 130px"
				className="object-contain object-center"
			/>
		</div>
	) : null;

	if (!inner) return null;

	if (badge.url) {
		return (
			<a
				href={badge.url}
				target="_blank"
				rel="noopener noreferrer"
				className="block opacity-90 hover:opacity-100 transition-opacity"
				aria-label={badge.alt ?? 'Credential badge'}
			>
				{inner}
			</a>
		);
	}

	return <div className="block opacity-90">{inner}</div>;
}
