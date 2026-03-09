import { fetchJobBySlug } from '@/lib/directus/fetchers';
import { notFound } from 'next/navigation';
import DirectusImage from '@/components/shared/DirectusImage';
import FormBuilder from '@/components/forms/FormBuilder';
import { Form, FormField } from '@/types/directus-schema';

export default async function CareerDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const job = await fetchJobBySlug(slug);

	if (!job) return notFound();

	const form = job.form && typeof job.form !== 'string' ? (job.form as Form & { fields: FormField[] }) : null;

	return (
		<main className="w-full bg-[#fff]">
			{/* Header */}
			<div className="w-full py-[80px] px-8 lg:px-[160px] flex flex-col items-center text-center gap-6">
				<h1 className="font-heading font-semibold text-[36px] lg:text-[48px] leading-[1.15] text-[#15181a]">
					{job.title}
				</h1>
				<div className="flex flex-wrap justify-center gap-4">
					{job.department && (
						<span className="flex items-center gap-2 border border-[#15181a] rounded px-3 py-1.5">
							<BriefcaseIcon />
							<span className="font-sans text-[14px] text-[#15181a]">{job.department}</span>
						</span>
					)}
					{job.location && (
						<span className="flex items-center gap-2 border border-[#15181a] rounded px-3 py-1.5">
							{job.location_flag && (
								<span className="relative shrink-0 w-[24px] h-[16px] overflow-hidden rounded-sm">
									<DirectusImage uuid={job.location_flag} alt="" fill sizes="24px" className="object-cover" />
								</span>
							)}
							<span className="font-sans text-[14px] text-[#15181a]">{job.location}</span>
						</span>
					)}
				</div>
			</div>

			{/* Body */}
			<div className="w-full pb-[80px] px-8 lg:px-[160px] flex flex-col gap-12  mx-auto">
				{job.overview && (
					<div
						className="prose prose-lg max-w-none font-sans text-[#2d3236] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_li]:text-[16px] [&_p]:text-[16px] [&_p]:leading-[28px]"
						dangerouslySetInnerHTML={{ __html: job.overview }}
					/>
				)}
				{job.responsibilities && (
					<div
						className="prose prose-lg max-w-none font-sans text-[#2d3236] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_li]:text-[16px] [&_p]:text-[16px] [&_p]:leading-[28px]"
						dangerouslySetInnerHTML={{ __html: job.responsibilities }}
					/>
				)}
				{job.requirements && (
					<div
						className="prose prose-lg max-w-none font-sans text-[#2d3236] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_li]:text-[16px] [&_p]:text-[16px] [&_p]:leading-[28px]"
						dangerouslySetInnerHTML={{ __html: job.requirements }}
					/>
				)}

				{!job.overview && !job.responsibilities && !job.requirements && (
					<p className="text-[#60696e] font-sans text-[16px]">
						Job details coming soon. Please check back later.
					</p>
				)}

				{form && (
					<div className="p-8">
						<p className="text-center font-heading font-semibold text-[30px] text-[#15181a] mb-6">
							Apply for this job
						</p>
						<FormBuilder form={form as any} />
					</div>
				)}
			</div>
		</main>
	);
}

function BriefcaseIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-[#15181a]">
			<rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
			<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.5" />
			<path d="M2 12h20" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	);
}
