import React from 'react';
import styled from 'styled-components';
import { Container } from '@/components/Grid';
import { BlockTitle } from '../common';
import { LatestUpdateCard } from './LatestUpdateCard';
import { Flex } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

export const LatestUpdatesBlock = () => {
	return (
		<LatestUpdatesBlockWrapper>
			<Container>
				<BlockTitle>Latest updates</BlockTitle>
			</Container>
			<LatestUpdatesCardsWrapper>
				<LatestUpdatesCardsContainer>
					{mockData.map((data, idx) => (
						<LatestUpdateCard
							key={idx}
							project={data.project}
							projectUpdate={data.projectUpdate}
						/>
					))}
				</LatestUpdatesCardsContainer>
			</LatestUpdatesCardsWrapper>
		</LatestUpdatesBlockWrapper>
	);
};

const mockData = [
	{
		projectUpdate: {
			content:
				'<p>We released EVMcrispr v0.10.0, "collective wisdom," with the following changes ...</p>',
			createdAt: '1674476181589',
			id: '1',
			projectId: '1',
			title: '1',
			userId: '1',
		},
		project: {
			slug: 'how-many-photos-is-too-many-photos',
			image: 'https://giveth.mypinata.cloud/ipfs/QmcQFkNQ3o6f555whoRtFqJgPz6k9nb8WfNEBHk3j2i3CW',
		},
	},
	{
		projectUpdate: {
			content:
				'<p>We released EVMcrispr v0.10.0, "collective wisdom," with the following changes ...</p>',
			createdAt: '1674476282589',
			id: '2',
			projectId: '2',
			title: '2',
			userId: '2',
		},
		project: {
			slug: 'how-many-photos-is-too-many-photos',
			image: 'https://static.tgbwidget.com/organization_logo%2F095875ef-b026-4c2f-b89f-08a9b1b0a336.jpg',
		},
	},
	{
		projectUpdate: {
			content:
				'<p>We released EVMcrispr v0.10.0, "collective wisdom," with the following changes ...</p>',
			createdAt: '1674476383589',
			id: '3',
			projectId: '3',
			title: '3',
			userId: '3',
		},
		project: {
			slug: 'how-many-photos-is-too-many-photos',
			image: 'https://static.tgbwidget.com/organization_logo%2F1988fd88-042c-4c4b-aaad-82e0939a4d88.jpg',
		},
	},
	{
		projectUpdate: {
			content:
				'<p>We released EVMcrispr v0.10.0, "collective wisdom," with the following changes ...</p>',
			createdAt: '1674476484589',
			id: '4',
			projectId: '4',
			title: '4',
			userId: '4',
		},
		project: {
			slug: 'how-many-photos-is-too-many-photos',
			image: 'https://giveth.mypinata.cloud/ipfs/QmSgVyzhFWyrYSgo6fEmSCa7pBAE5sESZLDM7h6XNeEeZU',
		},
	},
	{
		projectUpdate: {
			content:
				'<p>We released EVMcrispr v0.10.0, "collective wisdom," with the following changes ...</p>',
			createdAt: '1674476585589',
			id: '5',
			projectId: '5',
			title: '5',
			userId: '5',
		},
		project: {
			slug: 'how-many-photos-is-too-many-photos',
			image: 'https://i.imgur.com/uPFEgJu.png',
		},
	},
];

const LatestUpdatesBlockWrapper = styled.div`
	padding: 80px 0;
`;

const LatestUpdatesCardsWrapper = styled.div`
	overflow: hidden;
	padding-top: 40px;
`;

const LatestUpdatesCardsContainer = styled(Flex)`
	transform: translate3d(0, 0, 0);
	animation: marquee 10s linear infinite;
	${mediaQueries.tablet} {
		animation-duration: 20s;
	}
	${mediaQueries.laptopL} {
		animation-duration: 30s;
	}
	:hover {
		animation-play-state: paused;
	}
	@keyframes marquee {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(-100%);
		}
	}
`;
