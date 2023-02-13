import React, { ComponentType, ReactElement, useEffect, useState } from 'react';
import {
	IconCaretUp,
	IconCaretDown,
	brandColors,
	IconArrowTop,
	IconArrowBottom,
	IconHeartOutline16,
	IconDonation16,
	neutralColors,
	P,
	IconRocketInSpace16,
} from '@giveth/ui-design-system';
import Select, {
	components,
	OptionProps,
	DropdownIndicatorProps,
	StylesConfig,
} from 'react-select';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import { ESortbyAllProjects } from '@/apollo/types/gqlEnums';
import selectCustomStyles from '@/lib/constants/selectCustomStyles';
import { useProjectsContext } from '@/context/projects.context';
import { Flex } from '@/components/styled-components/Flex';
import useDetectDevice from '@/hooks/useDetectDevice';

export interface ISelectedSort {
	icon: ReactElement;
	label: string;
	value: ESortbyAllProjects;
}

const DropdownIndicator: ComponentType<DropdownIndicatorProps> = props => {
	return props.selectProps.menuIsOpen ? <IconCaretUp /> : <IconCaretDown />;
};

const sortByOptions = [
	{
		label: 'Rank',
		value: ESortbyAllProjects.GIVPOWER,
		icon: <IconRocketInSpace16 color={brandColors.deep[900]} />,
	},
	{
		label: 'Newest',
		value: ESortbyAllProjects.NEWEST,
		icon: <IconArrowTop size={16} color={brandColors.deep[900]} />,
	},
	{
		label: 'Oldest',
		value: ESortbyAllProjects.OLDEST,
		icon: <IconArrowBottom size={16} color={brandColors.deep[900]} />,
	},
	{
		label: 'Most liked',
		value: ESortbyAllProjects.MOSTLIKED,
		icon: <IconHeartOutline16 color={brandColors.deep[900]} />,
	},
	{
		label: 'Most funded',
		value: ESortbyAllProjects.MOSTFUNDED,
		icon: <IconDonation16 color={brandColors.deep[900]} />,
	},
];

const ProjectsSortSelect = () => {
	const [value, setValue] = useState(sortByOptions[0]);
	const { variables, setVariables } = useProjectsContext();
	const { isMobile } = useDetectDevice();
	const router = useRouter();

	useEffect(() => {
		if (router.query.sort) {
			const _value = sortByOptions.find(
				option =>
					option.value.toLowerCase() ===
					(router.query.sort as string).toLowerCase(),
			);
			if (_value) setValue(_value);
		}
	}, [router.query.sort]);

	return (
		<Flex
			gap='8px'
			alignItems={isMobile ? 'stretch' : 'center'}
			flexDirection={isMobile ? 'column' : 'row'}
		>
			<SortingLabel htmlFor='sorting'>Sort by</SortingLabel>
			<Select
				components={{
					DropdownIndicator,
					Option: (props: any) => <Option {...props} />,
				}}
				onChange={(e: any) => {
					setVariables({
						...variables,
						sortingBy: e.value,
					});
					setValue(e);
				}}
				value={value}
				options={sortByOptions}
				styles={selectStyles}
				id='sorting'
				name='sorting'
			/>
		</Flex>
	);
};

const Option: ComponentType<OptionProps<ISelectedSort>> = props => {
	const { data } = props;
	const { label } = data;
	const Icon = data.icon;

	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer>
					{Icon}
					<P>{label}</P>
				</RowContainer>
			</OptionContainer>
		</components.Option>
	);
};

const selectStyles: StylesConfig = {
	...selectCustomStyles,
	container: styles => ({
		...styles,
		zIndex: 3,
		border: 'none',
		borderRadius: '8px',
		minWidth: '200px',
		'&:hover': {
			borderColor: 'transparent',
		},
	}),
	control: styles => ({
		...styles,
		padding: '6px 8px',
		border: 'none',
		boxShadow: 'none',
	}),
	indicatorSeparator: styles => ({
		...styles,
		display: 'none',
	}),
};

const RowContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	> :first-child {
		flex-shrink: 0;
	}
	> :last-child {
		width: 100%;
		color: ${neutralColors.gray[900]};
	}
`;

const OptionContainer = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const SortingLabel = styled.label`
	color: ${neutralColors.gray[600]};
`;

export default ProjectsSortSelect;
