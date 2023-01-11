import {
	brandColors,
	Container,
	H3,
	mediaQueries,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import StatsCard from '@/components/views/homepage/whyGiveth/StatsCard';
import { Flex } from '@/components/styled-components/Flex';
import DonationCard from '@/components/views/homepage/whyGiveth/DonationCard';

export default function WhyGivethIndex() {
	return (
		<>
			<GivethStats>
				<WhyGiveth weight={700}>Why Giveth?</WhyGiveth>
				<Stats>
					{statsArray.map(i => (
						<StatsCard
							key={i.title}
							title={i.title}
							value={i.value}
						/>
					))}
				</Stats>
			</GivethStats>
			<RecentDonations>
				<Subline>RECENT DONATIONS</Subline>
				<Line />
				<Donations>
					{donationsArray.map((i, index) => (
						<DonationCard
							key={index}
							address={i.address}
							amount={i.amount}
							projectTitle={i.projectTitle}
						/>
					))}
				</Donations>
			</RecentDonations>
		</>
	);
}

const donationsArray = [
	{
		address: '0x49a38e2E232F64a07273256B31449688Fa85D151',
		amount: '25.657742344523',
		projectTitle: 'Women of Crypto Art (WOCA)',
	},
	{
		address: '0x4f59bF2F819cc2E62B9eC9709Abf3c0dEae503d6',
		amount: '1492.657742344523',
		projectTitle: 'Herbs and Drugs and Tools to Combat Sleepiness',
	},
	{
		address: '0x6B806496B55908851c498122212dba88d0e4231A',
		amount: '0.657742344523',
		projectTitle: 'The Teen Project, Inc.',
	},
];

const statsArray = [
	{
		title: 'Projects on Giveth',
		value: '1,726',
	},
	{
		title: 'Donated to projects',
		value: '~$190,854',
	},
	{
		title: '# of givers',
		value: '19,702',
	},
];

const Donations = styled(Flex)`
	gap: 16px;
	${mediaQueries.tablet} {
		gap: 8px;
	}
`;

const Line = styled.div`
	width: 1px;
	background: ${neutralColors.gray[300]};
	height: 40px;
	display: none;
	${mediaQueries.tablet} {
		display: block;
	}
`;

const RecentDonations = styled(Flex)`
	margin-top: 60px;
	overflow: hidden;
	gap: 40px;
	flex-direction: column;
	margin-left: 24px;
	> * {
		flex-shrink: 0;
	}
	${mediaQueries.tablet} {
		align-items: center;
		flex-direction: row;
		margin-left: 40px;
	}
`;

const Stats = styled(Flex)`
	gap: 40px 112px;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const WhyGiveth = styled(H3)`
	color: ${brandColors.giv[600]};
`;

const GivethStats = styled(Container)`
	position: relative;
	padding-top: 58px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 40px;
	flex-direction: column;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
	${mediaQueries.laptopL} {
		gap: 40px 104px;
	}
`;
