import { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Col, Row } from '@giveth/ui-design-system';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';
import { IPowerBoosting, IProjectPower } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import { Flex } from '@/components/styled-components/Flex';
import LoadingAnimation from '@/animations/loading_giv.json';
import LottieControl from '@/components/LottieControl';
import { useProjectContext } from '@/context/project.context';
import { GIVpowerCard } from './GIVpowerCard';

export interface IPowerBoostingWithUserGIVpower
	extends Omit<IPowerBoosting, 'user'> {
	user: {
		name: string;
		walletAddress: string;
		allocated: BigNumber;
		givpowerBalance: string;
	};
}
interface ProjectGIVPowerIndexProps {
	projectPower?: IProjectPower;
	projectFuturePower?: IProjectPower;
	isAdmin: boolean;
}

const itemPerPage = 10;

const ProjectGIVPowerIndex = ({
	projectPower,
	projectFuturePower,
	isAdmin,
}: ProjectGIVPowerIndexProps) => {
	const [page, setPage] = useState(0);

	const { isBoostingsLoading, boostersData } = useProjectContext();

	const hasGivPower = boostersData ? boostersData.totalCount > 0 : false;
	const totalCount = boostersData?.totalCount ?? 0;

	if (isBoostingsLoading)
		return <LottieControl animationData={LoadingAnimation} size={250} />;

	return hasGivPower ? (
		<>
			<Row>
				<Col lg={8}>
					<GIVPowerTable
						powerBoostings={
							boostersData?.powerBoostings.slice(
								page * itemPerPage,
								(page + 1) * itemPerPage,
							) || []
						}
						totalPowerBoosting={
							boostersData?.totalPowerBoosting || '0'
						}
					/>
					<Flex justifyContent='flex-end'>
						<Pagination
							totalCount={totalCount}
							currentPage={page}
							setPage={setPage}
							itemPerPage={itemPerPage}
						/>
					</Flex>
				</Col>
				<Col lg={4}>
					<GIVpowerCard />
				</Col>
			</Row>
		</>
	) : (
		<NoBoost isAdmin={isAdmin} />
	);
};

export default ProjectGIVPowerIndex;
