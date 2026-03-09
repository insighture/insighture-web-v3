import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					'flex h-[40px] w-full rounded-[8px] border border-[#94a7ad] bg-[rgba(247,247,247,0.88)] text-[#15181a] px-[12px] py-[10px] text-[14px] font-medium file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#94a7ad] placeholder:font-medium outline-none shadow-none ring-0 focus:outline-none focus:ring-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-50',
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = 'Input';

export { Input };
