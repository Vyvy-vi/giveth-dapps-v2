import { useEffect, useState } from 'react';

import HomeIndex from '@/components/views/homepage/HomeIndex';
import { client } from '@/apollo/apolloClient';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { ESortbyAllProjects } from '@/apollo/types/gqlEnums';
import { IProject, IRecentDonation } from '@/apollo/types/types';
import { useAppSelector } from '@/features/hooks';
import { homeMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { HOMEPAGE_DATA } from '@/apollo/gql/gqlHomePage';

export interface IHomeRoute {
	projects: IProject[];
	totalCount: number;
	recentDonations: IRecentDonation[];
	projectsPerDate: { total: number };
	totalDonorsCountPerDate: { total: number };
	donationsTotalUsdPerDate: { total: number };
}

const fetchProjects = async (userId: string | undefined = undefined) => {
	const variables: any = {
		limit: 12,
		sortingBy: ESortbyAllProjects.GIVPOWER,
	};

	if (userId) {
		variables.connectedWalletUserId = Number(userId);
	}
	const { data } = await client.query({
		query: FETCH_ALL_PROJECTS,
		variables,
		fetchPolicy: 'network-only',
	});

	return data.allProjects;
};

const dateFormat = (d: Date) => {
	// return date with day precision for caching efficiency
	// Add year by one to ensure fetching new data
	const ISODate = d.toISOString();
	const nextYear = d.getUTCFullYear() + 1;
	const year = d.getUTCFullYear();
	const date = ISODate.replace(year.toString(), nextYear.toString());
	return date.split('T')[0];
};

const HomeRoute = (props: IHomeRoute) => {
	const { projects: _projects, totalCount: _totalCount, ...rest } = props;
	const user = useAppSelector(state => state.user.userData);
	const [projects, setProjects] = useState(props.projects);
	const [totalCount, setTotalCount] = useState(props.totalCount);

	useEffect(() => {
		if (!user) return;
		fetchProjects(user?.id).then(({ projects, totalCount }) => {
			setProjects(projects);
			setTotalCount(totalCount);
		});
	}, [user]);

	return (
		<>
			<GeneralMetatags info={homeMetatags} />
			<HomeIndex projects={projects} totalCount={totalCount} {...rest} />
		</>
	);
};

export async function getServerSideProps({ res }: any) {
	res.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=59',
	);
	try {
		const { data } = await client.query({
			query: HOMEPAGE_DATA,
			variables: {
				take: 50,
				fromDate: '2021-01-01',
				toDate: dateFormat(new Date()),
				limit: 12,
				sortingBy: ESortbyAllProjects.GIVPOWER,
			},
			fetchPolicy: 'no-cache',
		});
		return {
			props: {
				projects: data.allProjects.projects,
				totalCount: data.allProjects.totalCount,
				recentDonations: data.recentDonations,
				projectsPerDate: data.projectsPerDate,
				totalDonorsCountPerDate: data.totalDonorsCountPerDate,
				donationsTotalUsdPerDate: data.donationsTotalUsdPerDate,
			},
		};
	} catch (error: any) {
		const statusCode = transformGraphQLErrorsToStatusCode(
			error?.graphQLErrors,
		);
		return {
			props: {
				errorStatus: statusCode,
			},
		};
	}
}

export default HomeRoute;
