import { FC } from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import HomeFromBlog from './HomeFromBlog';
import HomeGetUpdates from './HomeGetUpdates';
import { IProject } from '@/apollo/types/types';
import WhyGiveth from '@/components/views/homepage/whyGiveth';
import CampaignBlock from '@/components/views/homepage/campaignBlock';

interface IHomeView {
	projects: IProject[];
	totalCount: number;
}

const HomeIndex: FC<IHomeView> = ({ projects }) => {
	return (
		<Wrapper>
			<Separator />
			<CampaignBlock projects={projects} />
			<Separator />
			<WhyGiveth />
			<Separator />
			<HomeFromBlog />
			<HomeGetUpdates />
		</Wrapper>
	);
};

const Separator = styled.div`
	width: 100%;
	height: 40px;
	background: ${neutralColors.gray[200]};
`;

const Wrapper = styled.div`
	background: white;
`;

export default HomeIndex;
