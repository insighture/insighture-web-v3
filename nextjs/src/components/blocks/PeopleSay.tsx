'use client';

import { useState, useRef } from 'react';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface PeopleSaySlide {
	id: number | string;
	sort?: number | null;
	image?: string | null;
	quote?: string | null;
	name?: string | null;
	role?: string | null;
}

interface PeopleSayData {
	id: number | string;
	heading?: string | null;
	slides?: PeopleSaySlide[];
}

export default function PeopleSay({ data }: { data: PeopleSayData }) {
	const { id, heading, slides } = data;
	const sorted = slides ? [...slides].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];
	const [current, setCurrent] = useState(0);
	const touchStartX = useRef<number | null>(null);

	const prev = () => setCurrent((c) => Math.max(0, c - 1));
	const next = () => setCurrent((c) => Math.min(sorted.length - 1, c + 1));

	const onTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};
	const onTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX.current === null) return;
		const diff = touchStartX.current - e.changedTouches[0].clientX;
		if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
		touchStartX.current = null;
	};

	return (
		<div className="w-full py-[96px] px-8 lg:px-[135px] flex flex-col gap-8">
			{/* Heading */}
			{heading && (
				<div
					className="font-heading text-[40px] leading-[48px] text-[#2d3236] [&_em]:not-italic [&_em]:text-[#ee4065] [&_em]:font-semibold"
					data-directus={setAttr({ collection: 'block_people_say', item: id, fields: 'heading', mode: 'popover' })}
					dangerouslySetInnerHTML={{ __html: heading }}
				/>
			)}

			{sorted.length > 0 && (
				<div className="flex flex-col gap-6">
					{/* Carousel */}
					<div
						className="overflow-hidden"
						onTouchStart={onTouchStart}
						onTouchEnd={onTouchEnd}
					>
						<div
							className="flex transition-transform duration-500 ease-in-out gap-6"
							style={{ transform: `translateX(calc(-${current} * (100% + 24px)))` }}
							data-directus={setAttr({ collection: 'block_people_say', item: id, fields: 'slides', mode: 'popover' })}
						>
							{sorted.map((slide) => (
								<SlideCard key={slide.id} slide={slide} />
							))}
						</div>
					</div>

					{/* Dots */}
					{sorted.length > 1 && (
						<div className="flex items-center justify-center gap-[5px]">
							{sorted.map((_, i) => (
								<button
									key={i}
									onClick={() => setCurrent(i)}
									aria-label={`Go to slide ${i + 1}`}
									className={`h-[8px] rounded-[20px] transition-all duration-300 ${
										i === current
											? 'w-[68px] bg-[#ee4065]'
											: 'w-[8px] bg-[#d0d5dd]'
									}`}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function SlideCard({ slide }: { slide: PeopleSaySlide }) {
	return (
		<div className="bg-[#e3eaed] border border-[#ced7db] rounded-xl shadow-[4px_4px_14px_0px_rgba(3,9,12,0.16)] flex gap-6 p-4 shrink-0 w-full">
			{/* Image */}
			<div className="relative hidden md:block shrink-0 w-[55%] h-[420px] rounded-lg overflow-hidden">
				{slide.image ? (
					<DirectusImage
						uuid={slide.image}
						alt={slide.name ?? ''}
						fill
						sizes="640px"
						className="object-cover"
					/>
				) : (
					<div className="w-full h-full bg-[#ced7db]" />
				)}
			</div>

			{/* Content */}
			<div className="flex flex-col justify-between flex-1 p-4">
				<div className="flex flex-col gap-6">
					{/* Quote icon */}
					<svg width="120" height="100" viewBox="0 0 48 35" fill="none" aria-hidden="true">
						<text x="0" y="50" fontSize="52" fontFamily="Georgia, serif" fill="#ee4065">&ldquo;</text>
					</svg>
					{slide.quote && (
						<p className="font-heading font-medium text-[22px] leading-[28px] text-[#2d3236]">
							{slide.quote}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-1 mt-6">
					{slide.name && (
						<p className="font-heading font-bold text-[24px] leading-[28px] text-[#ee4065]">
							{slide.name}
						</p>
					)}
					{slide.role && (
						<p className="font-sans font-light text-[18px] leading-[28px] text-[#15181a]">
							{slide.role}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
