import { FormField as ShadcnFormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import CheckboxField from './fields/CheckboxField';
import CheckboxGroupField from './fields/CheckboxGroupField';
import RadioGroupField from './fields/RadioGroupField';
import SelectField from './fields/SelectField';
import FileUploadField from './fields/FileUploadField';
import type { FormField as FormFieldType } from '@/types/directus-schema';
import { UseFormReturn } from 'react-hook-form';

interface FieldProps {
	field: FormFieldType;
	form: UseFormReturn;
}

const Field = ({ field, form }: FieldProps) => {
	if (field.type === 'hidden') return null;

	const requiredSuffix = field.required ? '*' : '';
	const placeholderText = `${field.placeholder || field.label || ''}${requiredSuffix}`;

	// Types that show the label inline as a placeholder (no separate label)
	const isInlineLabelType = ['text', 'textarea', 'select'].includes(field.type || '');

	const getFieldElement = () => {
		switch (field.type) {
			case 'text':
				return <Input placeholder={placeholderText} {...form.register(field.name!)} />;
			case 'textarea':
				return <Textarea placeholder={placeholderText} {...form.register(field.name!)} />;
			case 'checkbox':
				return <CheckboxField name={field.name!} label={field.label!} form={form} />;
			case 'checkbox_group':
				return <CheckboxGroupField name={field.name!} options={field.choices || []} form={form} />;
			case 'radio':
				return <RadioGroupField name={field.name!} options={field.choices || []} form={form} />;
			case 'select':
				return (
					<SelectField
						name={field.name!}
						placeholder={placeholderText}
						options={field.choices || []}
						form={form}
					/>
				);
			case 'file':
				return <FileUploadField name={field.name!} form={form} />;
			default:
				return null;
		}
	};

	const fieldElement = getFieldElement();
	if (!fieldElement) return null;

	const widthClass = field.width
		? {
				100: 'w-full',
				50: 'w-full sm:w-[calc(50%-8px)]',
				67: 'w-full sm:w-[calc(67%-8px)]',
				33: 'w-full sm:w-[calc(33%-8px)]',
			}[field.width] || 'w-full'
		: 'w-full';

	return (
		<div className={`shrink-0 ${widthClass}`}>
			<ShadcnFormField
				control={form.control}
				name={field.name!}
				render={() => (
					<FormItem>
						{!isInlineLabelType && (
							<FormLabel
								htmlFor={field.name!}
								className="text-sm font-medium flex items-center justify-between"
							>
								<div className="flex items-center space-x-1">
									{field.type !== 'checkbox' && (
										<span>
											{field.label}
											{requiredSuffix}
										</span>
									)}
									{field.help && (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className="size-4 text-gray-500 cursor-pointer" />
												</TooltipTrigger>
												<TooltipContent>{field.help}</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
								</div>
							</FormLabel>
						)}
						{isInlineLabelType && (
							<FormLabel htmlFor={field.name!} className="sr-only">
								{field.label}{requiredSuffix}
							</FormLabel>
						)}
						<FormControl>{fieldElement}</FormControl>
						<FormMessage className="text-red-500 italic text-sm" />
					</FormItem>
				)}
			/>
		</div>
	);
};

export default Field;
