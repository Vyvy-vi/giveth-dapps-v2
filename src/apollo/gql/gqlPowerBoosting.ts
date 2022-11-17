import { gql } from '@apollo/client';

export const SAVE_POWER_BOOSTING = gql`
	mutation setSinglePowerBoostingMutation(
		$projectId: Int!
		$percentage: Float!
	) {
		setSinglePowerBoosting(projectId: $projectId, percentage: $percentage) {
			id
			user {
				id
			}
			project {
				id
				title
				slug
				verified
			}
			percentage
		}
	}
`;

export const SAVE_MULTIPLE_POWER_BOOSTING = gql`
	mutation setMultiplePowerBoostingMutation(
		$projectIds: [Int!]!
		$percentages: [Float!]!
	) {
		setMultiplePowerBoosting(
			projectIds: $projectIds
			percentages: $percentages
		) {
			id
			user {
				id
			}
			project {
				id
				title
				slug
				verified
			}
			percentage
		}
	}
`;

export const FETCH_POWER_BOOSTING_INFO = gql`
	query getPowerBoostingsQuery(
		$take: Int
		$skip: Int
		$orderBy: PowerBoostingOrderBy
		$projectId: Int
		$userId: Int
	) {
		getPowerBoosting(
			take: $take
			skip: $skip
			orderBy: $orderBy
			projectId: $projectId
			userId: $userId
		) {
			powerBoostings {
				id
				user {
					id
					email
				}
				project {
					id
					title
					slug
					verified
				}
				percentage
			}
		}
	}
`;

export const FETCH_PROJECT_BOOSTERS = gql`
	query getPowerBoostingsQuery(
		$take: Int
		$skip: Int
		$orderBy: PowerBoostingOrderBy
		$projectId: Int
	) {
		getPowerBoosting(
			take: $take
			skip: $skip
			orderBy: $orderBy
			projectId: $projectId
		) {
			totalCount
			powerBoostings {
				id
				user {
					name
					walletAddress
				}
				percentage
			}
		}
	}
`;

export const FETCH_PROJECT_BOOSTINGS = gql`
	query userProjectPowers(
		$take: Int
		$skip: Int
		$orderBy: UserPowerOrderBy
		$projectId: Int
	) {
		userProjectPowers(
			take: $take
			skip: $skip
			orderBy: $orderBy
			projectId: $projectId
		) {
			totalCount
			userProjectPowers {
				id
				userId
				projectId
				boostedPower
				rank
				round
				user {
					id
					firstName
					lastName
					name
				}
			}
		}
	}
`;
