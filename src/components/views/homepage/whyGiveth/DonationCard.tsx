import { FC } from 'react';
import styled from 'styled-components';
import {
	B,
	IconArrowRight,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { shortenAddress } from '@/lib/helpers';
import { Shadow } from '@/components/styled-components/Shadow';

interface IDonationCard {
	address: string;
	amount: number;
	projectTitle: string;
}

const DonationCard: FC<IDonationCard> = props => {
	const { address, amount, projectTitle } = props;
	return (
		<CardWrapper>
			<CardContainer>
				<Section>
					<B>{'@' + shortenAddress(address)}</B>
					<div>donated</div>
					<Amount>{'~$' + amount.toFixed(1)}</Amount>
				</Section>
				<Section>
					<Arrow>
						<IconArrowRight />
					</Arrow>
					<Title>{projectTitle}</Title>
				</Section>
			</CardContainer>
		</CardWrapper>
	);
};

const Section = styled(Flex)`
	gap: 8px;
	align-items: center;
	width: max-content;
`;

const Arrow = styled(Flex)`
	margin: 0 3px;
	color: ${neutralColors.gray[900]};
`;

const Title = styled(B)`
	color: ${neutralColors.gray[900]};
`;

const Amount = styled(B)`
	padding: 0 8px;
	border-radius: 4px;
	background: ${neutralColors.gray[300]};
`;

const CardWrapper = styled.div`
	padding: 20px 4px;
`;

const CardContainer = styled(Flex)`
	color: ${neutralColors.gray[700]};
	padding: 8px 24px;
	border-radius: 12px;
	border: 1px solid ${neutralColors.gray[300]};
	flex-direction: column;
	width: 100%;
	background: white;
	cursor: pointer;
	:hover {
		box-shadow: ${Shadow.Ocean[400]};
	}
	${mediaQueries.tablet} {
		border-radius: 100px;
		flex-direction: row;
	}
`;

export default DonationCard;
