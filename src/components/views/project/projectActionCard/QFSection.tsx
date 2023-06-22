import {
	Subline,
	H3,
	H4,
	neutralColors,
	Caption,
	brandColors,
	mediaQueries,
	semanticColors,
	IconArrowRight16,
	IconChevronRight16,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useProjectContext } from '@/context/project.context';
import { Flex } from '@/components/styled-components/Flex';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import {
	calculateEstimatedMatchingWithDonationAmount,
	calculateTotalEstimatedMatching,
} from '@/helpers/qf';

const QFSection = () => {
	const { formatMessage, locale } = useIntl();
	const { projectData } = useProjectContext();
	const { estimatedMatching, sumDonationValueUsdForActiveQfRound } =
		projectData || {};
	const isMobile = !useMediaQuery(device.tablet);
	const { projectDonationsSqrtRootSum, matchingPool, allProjectsSum } =
		estimatedMatching ?? {};

	return (
		<DonationSectionWrapper gap='24px'>
			{sumDonationValueUsdForActiveQfRound &&
			sumDonationValueUsdForActiveQfRound !== 0 ? (
				<DonateInfo>
					{isMobile && <br />}
					<Title>Amount raised in this round</Title>
					<Amount weight={700}>
						$
						{(
							sumDonationValueUsdForActiveQfRound || 0
						).toLocaleString(locale)}
					</Amount>
					<Description>
						{formatMessage({
							id: 'label.raised_from',
						})}
						<Caption medium>
							{projectData?.countUniqueDonorsForActiveQfRound}
						</Caption>
						{formatMessage(
							{
								id: 'label.contributors',
							},
							{
								count: projectData?.countUniqueDonorsForActiveQfRound,
							},
						)}
					</Description>
				</DonateInfo>
			) : (
				<DonateInfo>
					<NoFund weight={700}>
						{formatMessage({
							id: 'label.donate_first_lead_the_way',
						})}
					</NoFund>
				</DonateInfo>
			)}
			<Flex flexDirection='column' gap='4px'>
				<EstimatedMatchingPrice>
					+{' '}
					{calculateTotalEstimatedMatching(
						projectDonationsSqrtRootSum,
						allProjectsSum,
						matchingPool,
					).toFixed(2)}
				</EstimatedMatchingPrice>
				<LightCaption> Estimated matching</LightCaption>
			</Flex>
			<div>
				<Flex justifyContent='space-between'>
					<LightSubline>Contribution</LightSubline>
					<GreenSubline>Matching</GreenSubline>
				</Flex>
				<ContributionsContainer>
					<Flex flexDirection='column' gap='4px'>
						<FlexSameSize justifyContent='space-between'>
							<Subline>1 DAI</Subline>
							<IconArrowRight16 color={brandColors.cyan[500]} />
							<EndAlignedSubline>
								+{' '}
								{calculateEstimatedMatchingWithDonationAmount(
									1,
									projectDonationsSqrtRootSum,
									allProjectsSum,
									matchingPool,
								).toFixed(2)}
								&nbsp; DAI
							</EndAlignedSubline>
						</FlexSameSize>
						<FlexSameSize justifyContent='space-between'>
							<Subline>10 DAI</Subline>
							<IconArrowRight16 color={brandColors.cyan[500]} />
							<EndAlignedSubline>
								+{' '}
								{calculateEstimatedMatchingWithDonationAmount(
									10,
									projectDonationsSqrtRootSum,
									allProjectsSum,
									matchingPool,
								).toFixed(2)}
								&nbsp; DAI
							</EndAlignedSubline>
						</FlexSameSize>
						<FlexSameSize justifyContent='space-between'>
							<Subline>100 DAI</Subline>
							<IconArrowRight16 color={brandColors.cyan[500]} />
							<EndAlignedSubline>
								+{' '}
								{calculateEstimatedMatchingWithDonationAmount(
									100,
									projectDonationsSqrtRootSum,
									allProjectsSum,
									matchingPool,
								).toFixed(2)}
								&nbsp; DAI
							</EndAlignedSubline>
						</FlexSameSize>
						<Flex justifyContent='space-between'>
							<LightSubline>Last updated: 3h ago</LightSubline>
							<LightSubline>|</LightSubline>
							<LightSubline>Next update in: 3 min</LightSubline>
						</Flex>
						<a
							href='/'
							target='_blank'
							referrerPolicy='no-referrer'
						>
							<LearnLink alignItems='center' gap='2px'>
								<Subline>How it works?</Subline>
								<IconChevronRight16 />
							</LearnLink>
						</a>
					</Flex>
				</ContributionsContainer>
			</div>
		</DonationSectionWrapper>
	);
};

export default QFSection;

const Title = styled(Subline)`
	display: inline-block;
	margin-bottom: 8px;
	color: ${neutralColors.gray[700]};
	background-color: ${neutralColors.gray[200]};
	border-radius: 4px;
	padding: 2px 4px;
`;

const Amount = styled(H3)`
	margin-bottom: 4px;
`;

const Description = styled(Caption)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 24px;
	& > div {
		color: ${neutralColors.gray[900]};
		display: inline;
	}
`;

const DonationSectionWrapper = styled(Flex)`
	justify-content: space-between;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
	${mediaQueries.laptopS} {
		flex-direction: column;
	}
`;

const DonateInfo = styled.div`
	height: 90px;
`;

const NoFund = styled(H4)`
	color: ${neutralColors.gray[800]};
	margin-top: 16px;
`;

const EstimatedMatchingPrice = styled(H4)`
	color: ${semanticColors.jade[500]};
`;

const LightCaption = styled(Caption)`
	display: inline;
	color: ${neutralColors.gray[700]};
`;

const LightSubline = styled(Subline)`
	color: ${neutralColors.gray[700]};
`;

const GreenSubline = styled(Subline)`
	color: ${semanticColors.jade[500]};
`;

const EndAlignedSubline = styled(Subline)`
	text-align: end;
	color: ${semanticColors.jade[500]};
`;

const ContributionsContainer = styled.div`
	padding: 4px 0;
	border-top: 1px solid ${neutralColors.gray[300]};
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const FlexSameSize = styled(Flex)`
	> * {
		flex: 1 1 0px;
	}
`;

const LearnLink = styled(Flex)`
	color: ${brandColors.pinky[500]};
	&:hover {
		color: ${brandColors.pinky[700]};
	}
`;
