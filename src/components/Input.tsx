import {
	brandColors,
	neutralColors,
	GLink,
	semanticColors,
} from '@giveth/ui-design-system';
import { FC, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import type {
	FieldError,
	RegisterOptions,
	UseFormRegister,
} from 'react-hook-form';
import { IIconProps } from '@giveth/ui-design-system/lib/esm/components/icons/giv-economy/type';
import { Shadow } from '@/components/styled-components/Shadow';

export interface IFormValidations {
	[key: string]: InputValidationType;
}

export enum InputValidationType {
	NORMAL,
	WARNING,
	ERROR,
	SUCCESS,
}

export enum InputSize {
	SMALL,
	MEDIUM,
	LARGE,
}

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
	registerName: string;
	label?: string;
	caption?: string;
	size?: InputSize;
	register: UseFormRegister<any>;
	error?: FieldError;
	registerOptions?: RegisterOptions;
	disabled?: boolean;
	LeftIcon?: ReactElement<IIconProps>;
}

const InputSizeToLinkSize = (size: InputSize) => {
	switch (size) {
		case InputSize.SMALL:
			return 'Tiny';
		case InputSize.MEDIUM:
			return 'Small';
		case InputSize.LARGE:
			return 'Medium';
		default:
			return 'Small';
	}
};

const Input: FC<IInput> = ({
	registerName,
	label,
	caption,
	size = InputSize.MEDIUM,
	register,
	registerOptions = { required: false },
	error,
	LeftIcon,
	...rest
}) => {
	const validationStatus = error
		? InputValidationType.ERROR
		: InputValidationType.NORMAL;

	return (
		<InputContainer>
			{label && (
				<InputLabel
					disabled={disabled}
					size={InputSizeToLinkSize(size)}
					required={Boolean(registerOptions.required)}
				>
					{label}
				</InputLabel>
			)}
			<InputWrapper>
				{LeftIcon && LeftIcon}
			<InputField
				validation={validationStatus}
				inputSize={size}
				hasLeftIcon={!!LeftIcon}
				{...register(registerName, registerOptions)}
				{...rest}
			/>
			</InputWrapper>
			{error?.message ? (
				<InputValidation
					validation={validationStatus}
					size={InputSizeToLinkSize(size)}
				>
					{error?.message}
				</InputValidation>
			) : (
				<InputDesc size={InputSizeToLinkSize(size)}>
					{caption || '\u200C'}
				</InputDesc> //hidden char
			)}
		</InputContainer>
	);
};

const InputContainer = styled.div`
	flex: 1;
`;

const InputLabel = styled(GLink)<{ required?: boolean; disabled?: boolean }>`
	padding-bottom: 4px;
	color: ${props =>
		props.disabled ? neutralColors.gray[600] : brandColors.deep[500]};
	::after {
		content: '*';
		display: ${props => (props.required ? 'inline-block' : 'none')};
		padding: 0 4px;
		color: ${semanticColors.punch[500]};
	}
`;

interface IValidation {
	validation: InputValidationType;
}

interface IInputField extends IValidation {
	inputSize: InputSize;
	hasLeftIcon?: boolean;
}

const InputField = styled.input<IInputField>`
	width: 100%;
	height: ${props => {
		switch (props.inputSize) {
			case InputSize.SMALL:
				return '32px';
			case InputSize.MEDIUM:
				return '54px';
			case InputSize.LARGE:
				return '56px';
			default:
				break;
		}
	}};
	border: 2px solid
		${props => {
			switch (props.validation) {
				case InputValidationType.NORMAL:
					return neutralColors.gray[300];
				case InputValidationType.WARNING:
					return semanticColors.golden[600];
				case InputValidationType.ERROR:
					return semanticColors.punch[500];
				case InputValidationType.SUCCESS:
					return semanticColors.jade[500];
				default:
					return neutralColors.gray[300];
			}
		}};
	border-radius: 8px;
	padding: ${props => {
		switch (props.inputSize) {
			case InputSize.SMALL:
				return '8px';
			case InputSize.MEDIUM:
				return '15px 16px';
			case InputSize.LARGE:
				return '18px 16px';
			default:
				break;
		}
	}};
	padding-left: ${props => props.hasLeftIcon && '60px'};
	font-size: ${props => {
		switch (props.inputSize) {
			case InputSize.SMALL:
				return '12px';
			case InputSize.MEDIUM:
				return '16px';
			case InputSize.LARGE:
				return '16px';
			default:
				break;
		}
	}};
	line-height: 150%;
	/* font-weight: 500; */
	font-family: 'Red Hat Text', sans-serif;
	caret-color: ${brandColors.giv[300]};
	box-shadow: none;
	:focus {
		border: 2px solid
			${props => {
				switch (props.validation) {
					case InputValidationType.NORMAL:
						return brandColors.giv[600];
					case InputValidationType.WARNING:
						return semanticColors.golden[700];
					case InputValidationType.ERROR:
						return semanticColors.punch[700];
					case InputValidationType.SUCCESS:
						return semanticColors.jade[700];
					default:
						return brandColors.giv[600];
				}
			}};
	}
	:hover {
		box-shadow: ${Shadow.Neutral[400]};
	}
	:disabled {
		background: ${neutralColors.gray[300]};
	}
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
`;

const InputDesc = styled(GLink)`
	padding-top: 4px;
	color: ${brandColors.deep[500]};
	display: block;
`;

const InputValidation = styled(GLink)<IValidation>`
	padding-top: 4px;
	display: block;
	color: ${props => {
		switch (props.validation) {
			case InputValidationType.NORMAL:
				return neutralColors.gray[900];
			case InputValidationType.WARNING:
				return semanticColors.golden[600];
			case InputValidationType.ERROR:
				return semanticColors.punch[500];
			case InputValidationType.SUCCESS:
				return semanticColors.jade[500];
			default:
				return neutralColors.gray[300];
		}
	}}; ;
`;

const InputWrapper = styled.div`
	position: relative;
	display: flex;
	> svg {
		position: absolute;
		transform: translateY(-50%);
		padding-left: 20px;
		padding-right: 8px;
		border-right: 1px solid ${neutralColors.gray[400]};
		width: 52px;
		height: 23px;
		top: 50%;
		left: 0;
		overflow: hidden;
	}
`;

export default Input;
