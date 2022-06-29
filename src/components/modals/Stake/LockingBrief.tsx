import { brandColors, H5 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { formatWeiHelper } from '@/helpers/number';
import { useAppSelector } from '@/features/hooks';
import { getUnlockDate } from '@/helpers/givpower';
import { smallFormatDate } from '@/lib/helpers';
import type { FC } from 'react';

interface ILockingBrief {
	round: number;
	amount: string;
}
const LockingBrief: FC<ILockingBrief> = ({ round, amount }) => {
	const givpowerInfo = useAppSelector(
		state => state.subgraph.xDaiValues.GIVPowerPositions?.givPowers,
	);
	const unlockDate = new Date(getUnlockDate(givpowerInfo, round));
	return (
		<StakingBriefContainer>
			<H5>You are locking </H5>
			<H5White weight={700}>{formatWeiHelper(amount, 2)} GIV</H5White>
			<H5White>until {smallFormatDate(unlockDate)}</H5White>
		</StakingBriefContainer>
	);
};

const StakingBriefContainer = styled(Flex)`
	color: ${brandColors.giv[300]};
	flex-direction: column;
	gap: 8px;
`;
const H5White = styled(H5)`
	color: ${brandColors.giv['000']};
`;

export default LockingBrief;
