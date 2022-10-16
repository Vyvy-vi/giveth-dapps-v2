import React, { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Caption, semanticColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';

import ProjectHeader from './ProjectHeader';
import ProjectTabs from './ProjectTabs';
import ProjectDonateCard from './projectDonateCard/ProjectDonateCard';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import { IDonation, IProject } from '@/apollo/types/types';
import {
	EDirection,
	EDonationStatus,
	EProjectStatus,
	ESortby,
} from '@/apollo/types/gqlEnums';
import InfoBadge from '@/components/badges/InfoBadge';
import {
	IDonationsByProjectIdGQL,
	IProjectBySlug,
} from '@/apollo/types/gqlTypes';
import SuccessfulCreation from '@/components/views/create/SuccessfulCreation';
import { mediaQueries } from '@/lib/constants/constants';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import SimilarProjects from '@/components/views/project/SimilarProjects';
import { compareAddresses, showToastError } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import { ProjectMeta } from '@/components/Metatag';
import { Col, Row } from '@/components/Grid';
import ProjectGIVPowerIndex from '@/components/views/project/projectGIVPower';

const ProjectDonations = dynamic(
	() => import('./projectDonations/ProjectDonations.index'),
);
const ProjectUpdates = dynamic(() => import('./ProjectUpdates'));
const NotAvailableProject = dynamic(() => import('../../NotAvailableProject'), {
	ssr: false,
});
const RichTextViewer = dynamic(() => import('@/components/RichTextViewer'), {
	ssr: false,
});

const donationsPerPage = 10;

const ProjectIndex: FC<IProjectBySlug> = props => {
	const [activeTab, setActiveTab] = useState(0);
	const [isActive, setIsActive] = useState<boolean>(true);
	const [isDraft, setIsDraft] = useState<boolean>(false);
	const [draftProject, setDraftProject] = useState<IProject>();
	const [donations, setDonations] = useState<IDonation[]>([]);
	const [totalDonations, setTotalDonations] = useState(0);
	const [creationSuccessful, setCreationSuccessful] = useState(false);

	const user = useAppSelector(state => state.user.userData);

	const project = draftProject || props.project;

	const {
		adminUser,
		description = '',
		title,
		status,
		id = '',
		projectPower,
	} = project || {};
	const router = useRouter();
	const slug = router.query.projectIdSlug as string;
	const isAdmin = compareAddresses(
		adminUser?.walletAddress,
		user?.walletAddress,
	);

	const fetchProject = async () => {
		client
			.query({
				query: FETCH_PROJECT_BY_SLUG,
				variables: { slug, connectedWalletUserId: Number(user?.id) },
				fetchPolicy: 'network-only',
			})
			.then((res: { data: { projectBySlug: IProject } }) => {
				const _project = res.data.projectBySlug;
				if (_project.status.name !== EProjectStatus.CANCEL) {
					setDraftProject(_project);
				} else {
					draftProject && setDraftProject(undefined);
				}
			})
			.catch((error: unknown) => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'fetchProject',
					},
				});
			});
	};

	useEffect(() => {
		if (status) {
			setIsActive(status.name === EProjectStatus.ACTIVE);
			setIsDraft(status.name === EProjectStatus.DRAFT);
		}
	}, [status]);

	useEffect(() => {
		if (!id) return;
		client
			.query({
				query: FETCH_PROJECT_DONATIONS,
				variables: {
					projectId: parseInt(id),
					skip: 0,
					take: donationsPerPage,
					status: isAdmin ? null : EDonationStatus.VERIFIED,
					orderBy: {
						field: ESortby.CREATIONDATE,
						direction: EDirection.DESC,
					},
				},
			})
			.then((res: IDonationsByProjectIdGQL) => {
				const donationsByProjectId = res.data.donationsByProjectId;
				setDonations(donationsByProjectId.donations);
				setTotalDonations(donationsByProjectId.totalCount);
			})
			.catch((error: unknown) => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'fetchProjectDonation',
					},
				});
			});
	}, [id]);

	useEffect(() => {
		draftProject && setDraftProject(undefined);
		// Re-fetch project if project is draft and user is signed in
		if (!props.project && user?.isSignedIn) {
			fetchProject().then();
		}
	}, [props.project, user]);

	if (creationSuccessful) {
		return (
			<SuccessfulCreation
				showSuccess={setCreationSuccessful}
				project={project as IProject}
			/>
		);
	}

	if (!project) {
		return <NotAvailableProject />;
	}

	return (
		<>
			<Wrapper>
				<Head>
					<title>{title && `${title} |`} Giveth</title>
					<ProjectMeta project={project} preTitle='Check out' />
				</Head>

				<ProjectHeader project={project} />
				{isDraft && (
					<DraftIndicator>
						<InfoBadge />
						<Caption medium>
							This is a preview of your project.
						</Caption>
					</DraftIndicator>
				)}
				<BodyWrapper>
					<Col sm={8}>
						{project && !isDraft && (
							<ProjectTabs
								activeTab={activeTab}
								setActiveTab={setActiveTab}
								project={project}
								totalDonations={totalDonations}
							/>
						)}
						{!isActive && !isDraft && (
							<InlineToast
								type={EToastType.Warning}
								message='This project is not active.'
							/>
						)}
						{activeTab === 0 && (
							<RichTextViewer content={description} />
						)}
						{activeTab === 1 && (
							<ProjectUpdates
								project={project}
								fetchProject={fetchProject}
							/>
						)}
						{activeTab === 2 && (
							<ProjectDonations
								donationsByProjectId={{
									donations,
									totalCount: totalDonations,
								}}
								project={project}
								isActive={isActive}
								isDraft={isDraft}
							/>
						)}
						{activeTab === 3 && (
							<ProjectGIVPowerIndex
								projectId={id}
								projectPower={projectPower}
							/>
						)}
					</Col>
					{project && (
						<Col sm={4}>
							<ProjectDonateCard
								isDraft={isDraft}
								project={project!}
								isActive={isActive}
								setIsActive={setIsActive}
								setIsDraft={setIsDraft}
								setCreationSuccessful={setCreationSuccessful}
							/>
						</Col>
					)}
				</BodyWrapper>
			</Wrapper>
			<SimilarProjects slug={slug} />
		</>
	);
};

const DraftIndicator = styled.div`
	color: ${semanticColors.blueSky[600]};
	background: ${semanticColors.blueSky[100]};
	display: flex;
	gap: 18px;
	padding: 25px 150px;
	margin-bottom: 30px;
`;

const Wrapper = styled.div`
	position: relative;
`;

const BodyWrapper = styled(Row)`
	margin: 0 auto;
	min-height: calc(100vh - 312px);
	max-width: 1280px;
	padding: 0 16px;

	${mediaQueries.mobileL} {
		padding: 0 22px;
	}

	${mediaQueries.laptopS} {
		padding: 0 40px;
	}
`;

export default ProjectIndex;
