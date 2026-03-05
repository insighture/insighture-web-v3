'use client';

import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

export interface ServiceCredentialsBadge {
	id: string;
	sort?: number | null;
	image?: string | null;
	alt?: string | null;
}

export interface ServiceCredentialsStat {
	id: string;
	sort?: number | null;
	icon?: string | null;
	value?: string | null;
	label?: string | null;
}

export interface ServiceCredentialsCTAData {
	id: string;
	headline?: string | null;
	headline_emphasis?: string | null;
	badges?: ServiceCredentialsBadge[] | null;
	stats?: ServiceCredentialsStat[] | null;
}

interface ServiceCredentialsCTAProps {
	data: ServiceCredentialsCTAData;
	accentColor?: string | null;
	/** When true, renders without outer <section> wrapper (used inside ServiceItems gray card) */
	contained?: boolean;
}

export default function ServiceCredentialsCTA({ data, accentColor, contained }: ServiceCredentialsCTAProps) {
	const { id, headline, badges, stats } = data;
	const accent = accentColor || '#0fa2bf';

	const sortedBadges = [...(badges || [])].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
	const sortedStats = [...(stats || [])].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

	const directusAttr = setAttr({
		collection: 'block_service_credentials_cta',
		item: id,
		fields: ['headline'],
		mode: 'popover',
	});

	const innerContent = (
		<div className="flex flex-col lg:flex-row items-start justify-between lg:items-center gap-[40px] lg:gap-[130px]">

			{/* ── Left column: headline + badges ─────────────────────── */}
			<div className="flex flex-col gap-[41px] flex-1 min-w-0">
				{headline && (
					<p
						className="font-sans font-medium text-[40px] leading-[48px] text-[#fcfcfd]"
						dangerouslySetInnerHTML={{ __html: headline }}
					/>
				)}

				{/* Badge row — 6px gap between certification images */}
				{sortedBadges.length > 0 && (
					<div className="flex items-center gap-[6px] flex-wrap">
						{sortedBadges.map((badge) => (
							<div
								key={badge.id}
								className="relative shrink-0"
								style={{ width: '64px', height: '72px' }}
								data-directus={setAttr({
									collection: 'block_service_credentials_cta_badge',
									item: badge.id,
									fields: ['image', 'alt'],
									mode: 'popover',
								})}
							>
								{badge.image && (
									<DirectusImage
										uuid={badge.image}
										alt={badge.alt || ''}
										fill
										sizes="75px"
										className="object-contain"
									/>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* ── Right column: stat cards ────────────────────────────── */}
			{sortedStats.length > 0 && (
				<div className="flex flex-col gap-[16px] w-full lg:w-[423px] shrink-0">
					{sortedStats.map((stat) => (
						<div
							key={stat.id}
							className="flex items-center gap-[32px] p-[16px] rounded-[8px] w-full"
							style={{ backgroundColor: '#11262b' }}
							data-directus={setAttr({
								collection: 'block_service_credentials_cta_stat',
								item: stat.id,
								fields: ['icon', 'value', 'label'],
								mode: 'popover',
							})}
						>
							{/* Icon + Value group — fixed combined width so labels align across all rows */}
							<div className="flex items-center gap-[32px] shrink-0 w-[160px]">
								{stat.icon && (
									<div className="relative shrink-0 size-[48px]">
										<DirectusImage
											uuid={stat.icon}
											alt=""
											fill
											sizes="48px"
											className="object-contain"
										/>
									</div>
								)}
								{stat.value && (
									<p
										className="font-sans font-bold text-[32px] leading-[50px] whitespace-nowrap"
										style={{ color: accent }}
									>
										{stat.value}
									</p>
								)}
							</div>

							{/* Label — always starts at the same x position */}
							{stat.label && (
								<p className="font-sans font-semibold text-[18px] leading-[25px] text-white">
									{stat.label}
								</p>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);

	if (contained) {
		return (
			<div
				className="w-full rounded-[8px] overflow-hidden"
				style={{ backgroundColor: '#071d22' }}
				data-directus={directusAttr}
			>
				<div className="py-[64px] px-4 lg:px-[64px]">
					{innerContent}
				</div>
			</div>
		);
	}

	return (
		<section
			className="w-full"
			style={{ backgroundColor: '#071d22' }}
			data-directus={directusAttr}
		>
			<div className="mx-auto max-w-[1200px] px-4 lg:px-8 py-[64px]">
				{innerContent}
			</div>
		</section>
	);
}
