'use client';

import { useState } from 'react';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface OpenRolesJob {
	id: number | string;
	sort?: number | null;
	type?: 'open_roles' | 'internship' | null;
	title?: string | null;
	department?: string | null;
	location?: string | null;
	location_flag?: string | null;
	apply_url?: string | null;
}

interface OpenRolesData {
	id: number | string;
	heading?: string | null;
	description?: string | null;
	jobs?: OpenRolesJob[];
}

const TABS = [
	{ key: 'open_roles', label: 'Open Roles' },
	{ key: 'internship', label: 'Internship opportunities' },
] as const;

export default function OpenRoles({ data }: { data: OpenRolesData }) {
	const { id, heading, description, jobs } = data;
	const [activeTab, setActiveTab] = useState<'open_roles' | 'internship'>('open_roles');

	const sorted = jobs ? [...jobs].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];
	const filtered = sorted.filter((j) => !j.type || j.type === activeTab);

	// Group by department
	const grouped: Record<string, OpenRolesJob[]> = {};
	for (const job of filtered) {
		const dept = job.department || 'Other';
		if (!grouped[dept]) grouped[dept] = [];
		grouped[dept].push(job);
	}

	return (
		<div className="w-full py-[96px] px-8 lg:px-[160px] flex flex-col gap-16">
			{/* Header */}
			<div className="flex flex-col gap-10 items-center text-center">
				{heading && (
					<div
						className="font-heading font-medium text-[40px] lg:text-[48px] leading-[48px] text-[#2d3236] [&_em]:not-italic [&_em]:text-[#ee4065] [&_em]:font-semibold"
						data-directus={setAttr({ collection: 'block_open_roles', item: id, fields: 'heading', mode: 'popover' })}
						dangerouslySetInnerHTML={{ __html: heading }}
					/>
				)}
				{description && (
					<p
						className="font-sans font-normal text-[24px] leading-[40px] text-[#2d3236] max-w-[837px]"
						data-directus={setAttr({ collection: 'block_open_roles', item: id, fields: 'description', mode: 'popover' })}
					>
						{description}
					</p>
				)}

				{/* Tab buttons */}
				<div
					className="flex gap-6 w-full max-w-[1120px]"
					data-directus={setAttr({ collection: 'block_open_roles', item: id, fields: 'jobs', mode: 'popover' })}
				>
					{TABS.map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`flex-1 h-12 rounded-lg text-[16px] font-heading font-semibold leading-[26px] border-[1.2px] transition-colors ${
								activeTab === tab.key
									? 'bg-[#ee4065] border-[#ee4065] text-white'
									: 'bg-transparent border-[#98a2b3] text-[#94a7ad]'
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/* Job groups */}
			{Object.keys(grouped).length > 0 && (
				<div className="bg-[#ebf0f2] rounded-2xl px-8 py-6 flex flex-col gap-16">
					{Object.entries(grouped).map(([dept, deptJobs]) => (
						<div key={dept} className="flex flex-col gap-10">
							{/* Department header */}
							<div className="flex flex-col gap-4">
								<p className="font-heading font-semibold text-[20px] leading-[32px] text-black">
									{dept}
								</p>
								<hr className="border-[#b0bfc4]" />
							</div>

							{/* Job cards */}
							<div className="flex flex-col gap-8">
								{deptJobs.map((job) => (
									<JobCard key={job.id} job={job} />
								))}
							</div>
						</div>
					))}
				</div>
			)}

			{Object.keys(grouped).length === 0 && (
				<div className="bg-[#ebf0f2] rounded-2xl px-8 py-12 text-center text-[#60696e] font-sans text-[18px]">
					No positions available at this time.
				</div>
			)}
		</div>
	);
}

function JobCard({ job }: { job: OpenRolesJob }) {
	return (
		<div className="bg-[#fcfcfd] border border-[#b0bfc4] rounded-xl flex items-center justify-between px-8 py-6 gap-6">
			{/* Left: title + badges */}
			<div className="flex flex-col gap-5 flex-1 min-w-0">
				{job.title && (
					<p className="font-heading font-semibold text-[26px] leading-[32px] text-[#15181a]">
						{job.title}
					</p>
				)}
				<div className="flex gap-6 flex-wrap items-center">
					{job.department && (
						<span className="flex gap-2 items-center bg-[#fcfcfd] border border-[#b0bfc4] rounded px-2 py-1 shadow-[2px_1px_8px_0px_rgba(45,50,54,0.08)]">
							<BriefcaseIcon />
							<span className="font-sans font-normal text-[14px] leading-[26px] text-[#60696e] whitespace-nowrap">
								{job.department}
							</span>
						</span>
					)}
					{job.location && (
						<span className="flex gap-2 items-center bg-[#fcfcfd] border border-[#b0bfc4] rounded px-2 py-1 shadow-[2px_1px_8px_0px_rgba(45,50,54,0.08)]">
							{job.location_flag && (
								<span className="relative shrink-0 w-[30px] h-[20px] overflow-hidden">
									<DirectusImage
										uuid={job.location_flag}
										alt=""
										fill
										sizes="30px"
										className="object-cover"
									/>
								</span>
							)}
							<span className="font-sans font-normal text-[14px] leading-[26px] text-[#60696e] whitespace-nowrap">
								{job.location}
							</span>
						</span>
					)}
				</div>
			</div>

			{/* Right: apply button */}
			{job.apply_url && (
				<a
					href={job.apply_url}
					target="_blank"
					rel="noopener noreferrer"
					className="shrink-0 flex items-center gap-6 h-12 px-3 py-[10px] bg-[#ee4065] border-[1.2px] border-[#ee4065] rounded-lg text-white font-heading font-semibold text-[16px] leading-[26px] hover:opacity-90 transition-opacity"
				>
					Apply here
					<ChevronIcon />
				</a>
			)}
		</div>
	);
}

function BriefcaseIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-[#60696e]">
			<rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
			<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.5" />
			<line x1="12" y1="12" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M2 12h20" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	);
}

function ChevronIcon() {
	return (
		<svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true" className="shrink-0">
			<path d="M1 1L6 6L1 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}
