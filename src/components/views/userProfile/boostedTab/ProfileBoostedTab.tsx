import { H5, mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useEffect, useState } from 'react';
import {
	ContributeCard,
	ContributeCardTitles,
	UserProfileTab,
} from '../common.sc';
import { IUserProfileView } from '../UserProfile.view';
import { formatWeiHelper } from '@/helpers/number';
import { EDirection } from '@/apollo/types/gqlEnums';
import BoostsTable from './BoostsTable';
import { IPowerBoosting } from '@/apollo/types/types';
import { client } from '@/apollo/apolloClient';
import { FETCH_POWER_BOOSTING_INFO } from '@/apollo/gql/gqlPowerBoosting';

export enum EPowerBoostingOrder {
	CreationAt = 'createdAt',
	UpdatedAt = 'updatedAt',
	Percentage = 'Percentage',
}

export interface IBoostedOrder {
	by: EPowerBoostingOrder;
	direction: EDirection;
}

export const ProfileBoostedTab: FC<IUserProfileView> = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [boosts, setBoosts] = useState<IPowerBoosting[]>([]);
	const [order, setOrder] = useState<IBoostedOrder>({
		by: EPowerBoostingOrder.Percentage,
		direction: EDirection.DESC,
	});

	const totalAmountOfGIVpower = '7989240000000000000000';

	const changeOrder = (orderBy: EPowerBoostingOrder) => {
		if (orderBy === order.by) {
			setOrder({
				by: orderBy,
				direction:
					order.direction === EDirection.ASC
						? EDirection.DESC
						: EDirection.ASC,
			});
		} else {
			setOrder({
				by: orderBy,
				direction: EDirection.DESC,
			});
		}
	};

	useEffect(() => {
		if (!user) return;

		const fetchUserBoosts = async () => {
			setLoading(true);
			const { data } = await client.query({
				query: FETCH_POWER_BOOSTING_INFO,
				variables: {
					take: 50,
					skip: 0,
					orderBy: { field: order.by, direction: order.direction },
					userId: parseFloat(user.id || '') || -1,
				},
			});
			setLoading(false);
			if (data?.getPowerBoosting) {
				const powerBoostings: IPowerBoosting[] =
					data.getPowerBoosting.powerBoostings;
				setBoosts(powerBoostings);
			}
		};
		fetchUserBoosts().then();
	}, [user, order.by, order.direction]);

	return (
		<UserProfileTab>
			<CustomContributeCard>
				<ContributeCardTitles>
					~total Amount of GIVpower
				</ContributeCardTitles>
				<ContributeCardTitles>Project boosted</ContributeCardTitles>
				<H5>{formatWeiHelper(totalAmountOfGIVpower)}</H5>
				<H5>8</H5>
			</CustomContributeCard>
			<BoostsTable
				boosts={boosts}
				totalAmountOfGIVpower={totalAmountOfGIVpower}
				order={order}
				changeOrder={changeOrder}
			/>
		</UserProfileTab>
	);
};

const CustomContributeCard = styled(ContributeCard)`
	width: 100%;
	${mediaQueries.tablet} {
		width: 614px;
	}
`;
