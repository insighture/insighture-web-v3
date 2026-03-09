import { Button as ShadcnButton, buttonVariants } from '@/components/ui/button';
import { LucideIcon, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface ButtonProps {
	id: string;
	label?: string | null;
	variant?: string | null;
	url?: string | null;
	type?: 'page' | 'post' | 'url' | 'submit' | null;
	page?: { permalink: string | null };
	post?: { slug: string | null };
	size?: 'default' | 'sm' | 'lg' | 'icon';
	icon?: 'arrow' | 'plus';
	customIcon?: LucideIcon;
	iconPosition?: 'left' | 'right';
	className?: string;
	onClick?: () => void;
	disabled?: boolean;
	block?: boolean;
	bgColor?: string | null;
	textColor?: string | null;
	borderColor?: string | null;
	hoverBgColor?: string | null;
	hoverTextColor?: string | null;
}

const Button = ({
	id,
	label,
	variant,
	url,
	type,
	page,
	post,
	size = 'default',
	icon,
	customIcon,
	iconPosition = 'left',
	className,
	onClick,
	disabled = false,
	block = false,
	bgColor,
	textColor,
	borderColor,
	hoverBgColor,
	hoverTextColor,
}: ButtonProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const icons: Record<string, LucideIcon> = {
		arrow: ArrowRight,
		plus: Plus,
	};

	const Icon = customIcon || (icon ? icons[icon] : null);

	const href = (() => {
		if (type === 'page' && page?.permalink) return page.permalink;
		if (type === 'post' && post?.slug) return `/blog/${post.slug}`;

		return url || undefined;
	})();

	const hoverHandlers = (hoverBgColor || hoverTextColor) ? {
		onMouseEnter: () => setIsHovered(true),
		onMouseLeave: () => setIsHovered(false),
	} : {};

	const customStyle: React.CSSProperties = {
		...(bgColor ? { backgroundColor: isHovered && hoverBgColor ? hoverBgColor : bgColor } : isHovered && hoverBgColor ? { backgroundColor: hoverBgColor } : {}),
		...(textColor ? { color: isHovered && hoverTextColor ? hoverTextColor : textColor } : isHovered && hoverTextColor ? { color: hoverTextColor } : {}),
		...(borderColor ? { borderColor: borderColor } : {}),
		transition: (hoverBgColor || hoverTextColor) ? 'background-color 0.2s ease, color 0.2s ease' : undefined,
	};

	const buttonClasses = cn(
		buttonVariants({ variant: variant as any, size }),
		className,
		disabled && 'opacity-50 cursor-not-allowed',
		block && 'w-full',
	);

	const content = (
		<span className="flex items-center space-x-2">
			{icon && iconPosition === 'left' && Icon && <Icon className="size-4 shrink-0" />}
			{label && <span>{label}</span>}
			{icon && iconPosition === 'right' && Icon && <Icon className="size-4 shrink-0" />}
		</span>
	);

	if (href) {
		const isExternal = href.startsWith('http://') || href.startsWith('https://');
		const hashIndex = href.indexOf('#');
		const hasHash = !isExternal && hashIndex !== -1;
		const targetPath = hasHash ? href.substring(0, hashIndex) : null;

		const handleHashClick = hasHash
			? (e: React.MouseEvent) => {
					const hash = href.substring(hashIndex);
					const currentPath = window.location.pathname;

					if (!targetPath || targetPath === currentPath) {
						e.preventDefault();
						history.pushState(null, '', href);
						window.dispatchEvent(new HashChangeEvent('hashchange'));
						const id = hash.substring(1);
						document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
					}
				}
			: undefined;

		return (
			<ShadcnButton asChild variant={variant as any} size={size} className={buttonClasses} disabled={disabled} style={customStyle} {...hoverHandlers}>
				{hasHash ? (
					<a href={href} onClick={handleHashClick}>
						{content}
					</a>
				) : href.startsWith('/') ? (
					<Link href={href}>{content}</Link>
				) : (
					<a href={href} target="_blank" rel="noopener noreferrer">
						{content}
					</a>
				)}
			</ShadcnButton>
		);
	}

	return (
		<ShadcnButton variant={variant as any} size={size} className={buttonClasses} onClick={onClick} disabled={disabled} style={customStyle} {...hoverHandlers}>
			{content}
		</ShadcnButton>
	);
};

export default Button;
