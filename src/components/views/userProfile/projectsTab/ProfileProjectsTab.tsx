import { neutralColors } from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { IUserProfileView, EOrderBy, IOrder } from '../UserProfile.view';
import ProjectsTable from './ProjectsTable';
import { Col, Row } from '@/components/Grid';
import { EDirection } from '@/apollo/types/gqlEnums';
import NothingToSee from '@/components/views/userProfile/NothingToSee';
import { client } from '@/apollo/apolloClient';
import { FETCH_USER_PROJECTS } from '@/apollo/gql/gqlUser';
import { IUserProjects } from '@/apollo/types/gqlTypes';
import { IProject } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import ProjectCard from '@/components/project-card/ProjectCard';
import { Flex } from '@/components/styled-components/Flex';
import { UserProfileTab } from '../common.sc';
import ContributeCard, {
	UserContributeTitle,
} from '@/components/views/userProfile/ProfileContributeCard';

const itemPerPage = 10;

const ProfileProjectsTab: FC<IUserProfileView> = ({ user, myAccount }) => {
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<IProject[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [page, setPage] = useState(0);

	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});
	const userName = user?.name || 'Unknown';

	const changeOrder = (orderBy: EOrderBy) => {
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
		const fetchUserProjects = async () => {
			setLoading(true);
			const { data: userProjects } = await client.query({
				query: FETCH_USER_PROJECTS,
				variables: {
					userId: parseFloat(user.id || '') || -1,
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: order.by,
					direction: order.direction,
				},
			});
			setLoading(false);
			if (userProjects?.projectsByUserId) {
				const projectsByUserId: IUserProjects =
					userProjects.projectsByUserId;
				setProjects(projectsByUserId.projects);
				setTotalCount(projectsByUserId.totalCount);
			}
		};
		fetchUserProjects().then();
	}, [user, page, order.by, order.direction]);

	return (
		<UserProfileTab>
			{!myAccount && <ContributeCard user={user} />}
			{!myAccount && (
				<UserContributeTitle
					weight={700}
				>{`${userName}’s donations & projects`}</UserContributeTitle>
			)}
			<ProjectsContainer>
				{!loading && totalCount === 0 ? (
					<NothingWrapper>
						<NothingToSee
							title={`${
								myAccount ? "You haven't" : "This user hasn't"
							} created any projects yet!`}
						/>
					</NothingWrapper>
				) : myAccount ? (
					<ProjectsTableWrapper>
						<ProjectsTable
							projects={projects}
							changeOrder={changeOrder}
							order={order}
						/>
					</ProjectsTableWrapper>
				) : (
					<Row>
						{projects.map(project => (
							<Col key={project.id} md={6} lg={4}>
								<ProjectCard project={project} />
							</Col>
						))}
					</Row>
				)}
				{loading && <Loading />}
			</ProjectsContainer>
			<Pagination
				currentPage={page}
				totalCount={totalCount}
				setPage={setPage}
				itemPerPage={itemPerPage}
			/>
		</UserProfileTab>
	);
};

export const ProjectsContainer = styled.div`
	margin-bottom: 40px;
`;

const ProjectsTableWrapper = styled.div`
	overflow: auto;
`;

export const Loading = styled(Flex)`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: ${neutralColors.gray[200]}aa;
`;

const NothingWrapper = styled.div`
	position: relative;
	padding: 100px 0;
`;

export default ProfileProjectsTab;
