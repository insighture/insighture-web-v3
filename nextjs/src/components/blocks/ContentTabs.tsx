'use client';

import { useState } from 'react';
import DirectusImage from '@/components/shared/DirectusImage';
import { cn } from '@/lib/utils';
import { setAttr } from '@directus/visual-editing';

interface ContentTabsSpeaker {
	id: string;
	sort?: number | null;
	name?: string | null;
	role?: string | null;
	image?: string | null;
}

interface ContentTabsTab {
	id: string;
	sort?: number | null;
	label?: string | null;
	content?: string | null;
	speakers?: ContentTabsSpeaker[];
}

interface ContentTabsProps {
	data: {
		id: string;
		tabs?: ContentTabsTab[];
	};
}

export default function ContentTabs({ data }: ContentTabsProps) {
	const { id, tabs } = data;
	const sortedTabs = tabs ? [...tabs].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];
	const [activeIndex, setActiveIndex] = useState(0);

	if (sortedTabs.length === 0) return null;

	const activeTab = sortedTabs[activeIndex];
	const sortedSpeakers = activeTab?.speakers
		? [...activeTab.speakers].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
		: [];

	return (
		<section className="w-full py-12 max-w-[894px] mx-auto">
			{/* Tab bar */}
			<div
				className="flex"
				role="tablist"
				data-directus={setAttr({
					collection: 'block_content_tabs',
					item: id,
					fields: 'tabs',
					mode: 'modal',
				})}
			>
				{sortedTabs.map((tab, i) => {
					const isActive = i === activeIndex;

					return (
						<button
							key={tab.id}
							role="tab"
							aria-selected={isActive}
							aria-controls={`tabpanel-${tab.id}`}
							onClick={() => setActiveIndex(i)}
							className={cn(
								'flex-1 py-4 text-center font-heading text-lg md:text-2xl leading-8 transition-colors',
								isActive
									? 'text-[#ee4065] border-b-2 border-[#ee4065] font-medium'
									: 'text-[#94a7ad] border-b border-[#94a7ad] font-normal hover:text-[#6b8189]',
							)}
						>
							{tab.label}
						</button>
					);
				})}
			</div>

			{/* Tab content */}
			<div
				id={`tabpanel-${activeTab?.id}`}
				role="tabpanel"
				className="flex flex-col gap-16 pt-12"
			>
				{/* Rich text body */}
				{activeTab?.content && (
					<div
						className="font-sans text-lg leading-8 text-black [&_p]:mb-5 last:[&_p]:mb-0 [&_strong]:font-medium [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
						dangerouslySetInnerHTML={{ __html: activeTab.content }}
					/>
				)}

				{/* Speakers */}
				{sortedSpeakers.length > 0 && (
					<div className="flex flex-col gap-6 max-w-xs">
						<p className="font-heading font-medium text-xl leading-8 text-black">
							Speakers
						</p>
						{sortedSpeakers.map((speaker) => (
							<div key={speaker.id} className="flex items-center gap-3">
								{speaker.image && (
									<div className="relative size-20 shrink-0 rounded-full overflow-hidden">
										<DirectusImage
											uuid={speaker.image}
											alt={speaker.name ?? ''}
											fill
											sizes="80px"
											className="object-cover"
										/>
									</div>
								)}
								<div className="flex flex-col gap-1.5 text-lg leading-[26px] text-black">
									{speaker.name && (
										<p className="font-heading font-semibold">{speaker.name}</p>
									)}
									{speaker.role && (
										<p className="font-heading font-light">{speaker.role}</p>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
