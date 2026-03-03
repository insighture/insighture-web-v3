import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
	card: {
		id: string;
		title?: string | null;
		description?: string | null;
		accent_color?: string | null;
		link_label?: string | null;
		url?: string | null;
	};
}

const ServiceCard = ({ card }: ServiceCardProps) => {
	const { title, description, accent_color, link_label, url } = card;
	const color = accent_color ?? '#94a3b8';

	return (
		<div
			className="bg-[#fcfcfd] rounded-lg shadow-[1px_1px_8px_0px_rgba(0,0,0,0.12)] flex flex-col border-l-8"
			style={{ borderLeftColor: color }}
		>
			<div className="flex flex-col flex-1 items-start justify-between p-6">
				<div className="flex flex-col gap-4 w-full">
					{title && (
						<p className="font-heading font-bold text-3xl leading-snug text-[#1d2939]">
							{title}
						</p>
					)}
					{description && (
						<p className="text-lg leading-normal text-[#1d2939] font-medium">
							{description}
						</p>
					)}
				</div>

				{url && (
					<Link
						href={url}
						className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold text-[#344054] transition-colors hover:[color:var(--card-accent)]"
						style={{ '--card-accent': color, borderColor: color, backgroundColor: `${color}08` } as React.CSSProperties}
					>
						{link_label ?? 'Learn more'}
						<ArrowRight className="size-4" style={{ color }} />
					</Link>
				)}
			</div>
		</div>
	);
};

export default ServiceCard;
