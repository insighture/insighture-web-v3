import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					'flex min-h-[100px] w-full rounded-[8px] border border-[#94a7ad] bg-[rgba(247,247,247,0.88)] text-[#15181a] px-[12px] py-[10px] text-[14px] font-medium placeholder:text-[#94a7ad] placeholder:font-medium outline-none shadow-none ring-0 focus:outline-none focus:ring-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-50',
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Textarea.displayName = 'Textarea';

export { Textarea };
