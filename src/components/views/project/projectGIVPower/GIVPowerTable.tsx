import { FC } from 'react';
import styled from 'styled-components';
import {
	B,
	IconRocketInSpace,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { RowWrapper } from '@/components/styled-components/Table';
import { formatWeiHelper } from '@/helpers/number';
import { IPowerBoostingWithUserGIVpower } from '.';

interface IGIVPowerTableProps {
	powerBoostings?: IPowerBoostingWithUserGIVpower[];
	totalPowerBoosting: string;
}

const GIVPowerTable: FC<IGIVPowerTableProps> = ({
	powerBoostings,
	totalPowerBoosting,
}) => {
	return (
		<Container>
			<TableHeader></TableHeader>
			<TableHeader>
				<IconRocketInSpace size={20} />
				Amount
			</TableHeader>
			{powerBoostings?.map(({ id, user }) => (
				<GIVpowerRowWrapper key={id}>
					<TableCell>{user.name || 'Anonymous'}</TableCell>
					<TableCell>{formatWeiHelper(user.allocated)}</TableCell>
				</GIVpowerRowWrapper>
			))}
			<TableHeader>TOTAL GIVPOWER</TableHeader>
			<TableHeader>{totalPowerBoosting || 0}</TableHeader>
		</Container>
	);
};

const TableCell = styled(P)`
	height: 60px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const TableHeader = styled(B)`
	border-bottom: 2px solid ${neutralColors.gray[400]};
	display: flex;
	gap: 8px;
	padding-top: 16px;
	padding-bottom: 8px;
`;

const GIVpowerRowWrapper = styled(RowWrapper)`
	&:hover > div {
		background-color: ${neutralColors.gray[300]};
	}
`;

const Container = styled.div`
	margin-top: 40px;
	margin-bottom: 10px;
	display: grid;
	grid-template-columns: 4fr 1fr;
`;

export default GIVPowerTable;
