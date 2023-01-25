import {
	brandColors,
	ButtonText,
	IconSearch24,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { ETheme } from '@/features/general/general.slice';
import { Flex } from './styled-components/Flex';
import { useAppSelector } from '@/features/hooks';

interface ISearchInputProps {
	className?: string;
}

export const SearchInput: FC<ISearchInputProps> = ({ className }) => {
	const theme = useAppSelector(state => state.general.theme);

	return (
		<SearchInputContainer className={className} theme={theme}>
			<InputContainer theme={theme}>
				<StyledInput
					as='input'
					placeholder='Search for project...'
					theme={theme}
				/>
				<IconSearch24 />
			</InputContainer>
			<Flex>
				<Hint />
			</Flex>
		</SearchInputContainer>
	);
};

const SearchInputContainer = styled.div``;

const InputContainer = styled(Flex)`
	padding: 16px;
	border-radius: 30px;
	${props =>
		props.theme === ETheme.Dark
			? css`
					background-color: ${brandColors.giv[500]};
			  `
			: css`
					background-color: ${neutralColors.gray[100]};
			  `}
`;

const StyledInput = styled(ButtonText)`
	border: none;
	background-color: inherit;
	flex: 1;
	padding-left: 8px;
	${props =>
		props.theme === ETheme.Dark
			? css`
					color: ${neutralColors.gray[100]};
					::placeholder {
						color: ${brandColors.giv[300]};
					}
			  `
			: css`
					color: ${neutralColors.gray[900]};
					::placeholder {
						color: ${neutralColors.gray[700]};
					}
			  `}
`;

const Hint = styled(ButtonText)``;
