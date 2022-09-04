import {
	B,
	brandColors,
	ButtonText,
	GLink,
	IconArrowBottom,
	IconArrowTop,
	IconDonation16,
	IconHeartOutline16,
	IconX,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { forwardRef } from 'react';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex, FlexCenter } from '../styled-components/Flex';
import { ESortbyAllProjects } from '@/apollo/types/gqlEnums';
import CheckBox from '../Checkbox';
import { useProjectsContext } from '@/context/projects.context';
import { zIndex } from '@/lib/constants/constants';

interface IFilterMenuProps {
	handleClose: (e?: any) => void;
	isOpen?: boolean;
}

export const FilterMenu = forwardRef<HTMLDivElement, IFilterMenuProps>(
	({ handleClose, isOpen }, ref) => {
		const { setVariables, variables } = useProjectsContext();
		const filtersCount = variables?.filters?.length ?? 0;
		const handleSelectFilter = (e: boolean, filter: string) => {
			if (e === true) {
				setVariables({
					...variables,
					filters: !variables.filters?.includes(filter)
						? [...(variables.filters || []), filter]
						: variables.filters,
				});
			}
			if (e === false) {
				setVariables({
					...variables,
					filters: variables.filters?.filter(
						(f: string) => f !== filter,
					),
				});
			}
		};
		return (
			<MenuContainer className={isOpen ? 'fadeIn' : 'fadeOut'} ref={ref}>
				<Header>
					<CloseContainer onClick={handleClose}>
						<IconX size={24} />
					</CloseContainer>
					<FlexCenter gap='8px'>
						<Title size='medium'>Filters</Title>
						{filtersCount !== 0 && (
							<PinkyColoredNumber size='medium'>
								{filtersCount}
							</PinkyColoredNumber>
						)}
					</FlexCenter>
				</Header>
				<Section>
					<B>Sort by</B>
					{sortByOptions.map((sortByOption, idx) => (
						<SortItem
							isSortSelected={
								variables.sortingBy === sortByOption.value
							}
							key={idx}
							onClick={e => {
								setVariables({
									...variables,
									sortingBy: sortByOption.value,
								});
							}}
						>
							<GLink>{sortByOption.label}</GLink>
							<IconContainer>{sortByOption.icon}</IconContainer>
						</SortItem>
					))}
				</Section>
				<Section>
					<B>Project features</B>
					{projectFeatures.map((projectFeature, idx) => (
						<FeatureItem key={idx}>
							<CheckBox
								label={projectFeature.label}
								onChange={e => {
									handleSelectFilter(e, projectFeature.value);
								}}
								checked={
									variables?.filters?.includes(
										projectFeature.value,
									) ?? false
								}
								size={16}
							/>
						</FeatureItem>
					))}
				</Section>
			</MenuContainer>
		);
	},
);

FilterMenu.displayName = 'FilterMenu';

// should merge with sortByOptions in projectsIndex at the end
const sortByOptions = [
	{
		label: 'Newest',
		value: ESortbyAllProjects.NEWEST,
		icon: <IconArrowTop size={16} />,
	},
	{
		label: 'Oldest',
		value: ESortbyAllProjects.OLDEST,
		icon: <IconArrowBottom size={16} />,
	},
	{
		label: 'Most liked',
		value: ESortbyAllProjects.MOSTLIKED,
		icon: <IconHeartOutline16 />,
	},
	{
		label: 'Most funded',
		value: ESortbyAllProjects.MOSTFUNDED,
		icon: <IconDonation16 />,
	},
];

const projectFeatures = [
	{ label: 'Accept GIV token', value: 'AcceptGiv' },
	{ label: 'Verified', value: 'Verified' },
	{ label: 'From GivingBlock', value: 'GivingBlock' },
	{ label: 'From Trace', value: 'Traceable' },
];

const MenuContainer = styled.div`
	top: 0;
	right: 0;
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
	box-shadow: 0 3px 20px rgba(212, 218, 238, 0.7);
	width: 100%;
	height: 100%;
	z-index: ${zIndex.FIXED};
	overflow-y: scroll;
	position: fixed;
	${mediaQueries.tablet} {
		overflow-y: auto;
		height: auto;
		top: -10px;
		border-radius: 16px;
		position: absolute;
		width: 375px;
		z-index: 3;
	}
`;

const Header = styled.div`
	position: relative;
	height: 24px;
	text-align: center;
`;

const CloseContainer = styled.div`
	width: 24px;
	height: 24px;
	position: absolute;
	left: 0;
	top: 0;
	cursor: pointer;
`;

const Title = styled(ButtonText)``;

const Section = styled.section`
	margin: 24px 0;
`;

const SortItem = styled(Flex)<{ isSortSelected?: boolean }>`
	margin: 16px 0;

	background-color: ${props =>
		props.isSortSelected
			? neutralColors.gray[900]
			: neutralColors.gray[300]};
	color: ${props => props.isSortSelected && neutralColors.gray[100]};
	border-radius: 50px;
	padding: 10px 16px;
	gap: 10px;
	width: fit-content;
	cursor: pointer;
`;

const IconContainer = styled.div`
	width: 16px;
	height: 22px;
	padding: 2px 0;
`;

const FeatureItem = styled.div`
	margin: 16px 0;
	padding: 8px 10px;
	border-radius: 8px;
	transition: background-color 0.3s ease;
	&:hover {
		background-color: ${neutralColors.gray[200]};
	}
`;

export const PinkyColoredNumber = styled(Title)`
	background-color: ${brandColors.pinky[500]};
	width: 18px;
	height: 18px;
	border-radius: 50%;
	color: ${neutralColors.gray[100]};
`;
