import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { brandColors, H6, Lead, neutralColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Col, Container, Row } from '../Grid';
import { Flex } from '../styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';
import { ETheme } from '@/features/general/general.slice';
import { useAppSelector } from '@/features/hooks';
import { SearchInput } from '../SearchInput';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import Routes from '@/lib/constants/Routes';

const quickLinks = [
	{
		title: 'Top ranking projects',
		query: '?sort=' + EProjectsSortBy.GIVPOWER,
	},
	{
		title: 'Most funded projects',
		query: '?sort=' + EProjectsSortBy.MOST_FUNDED,
	},
	{ title: 'New projects', query: '?sort=' + EProjectsSortBy.NEWEST },
	{
		title: 'Most liked projects',
		query: '?sort=' + EProjectsSortBy.MOST_LIKED,
	},
];

//We should update it manually
const popular_categories = [
	{
		title: 'Community',
		slug: 'community',
	},
	{
		title: 'NGO',
		slug: 'ngo',
	},
	{
		title: 'Technology',
		slug: 'technology',
	},
	{
		title: 'Equality',
		slug: 'equality',
	},
	// {
	// 	title: 'Health & Wellness',
	// 	slug: 'health-and-wellness',
	// },
	// {
	// 	title: 'Finance',
	// 	slug: 'finance',
	// },
	// {
	// 	title: 'Art & Culture',
	// 	slug: 'art-and-culture',
	// },
	// {
	// 	title: 'Economic & Infrastructure',
	// 	slug: 'economic-and-infrastructure',
	// },
	// {
	// 	title: 'Education',
	// 	slug: 'education',
	// },
	// {
	// 	title: 'Environment & Energy',
	// 	slug: 'environment-and-energy',
	// },
	// {
	// 	title: 'Nature',
	// 	slug: 'nature',
	// },
	// {
	// 	title: 'Other',
	// 	slug: 'other',
	// },
];

export const SearchModal: FC<IModal> = ({ setShowModal }) => {
	const [term, setTerm] = useState<string>('');
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { theme } = useAppSelector(state => state.general);
	const router = useRouter();

	useEffect(() => {
		if (term) {
			router.push(`${Routes.Projects}?term=${term}`);
			closeModal();
		}
	}, [closeModal, router, term]);

	return (
		<StyledModal
			closeModal={closeModal}
			isAnimating={isAnimating}
			theme={theme}
			fullScreen
		>
			<SearchModalContainer>
				<SearchBox>
					<H6 weight={700}>Find awesome projects on Giveth</H6>
					<SearchInput setTerm={setTerm} />
				</SearchBox>
				<Row>
					<Col xs={12} md={1.5}></Col>
					<Col xs={12} sm={4} md={3}>
						<Flex
							gap='24px'
							flexDirection='column'
							alignItems='flex-start'
						>
							<Title size='large' theme={theme}>
								Quick links
							</Title>
							{quickLinks.map((item, idx) => (
								<Link
									key={idx}
									href={Routes.Projects + item.query}
								>
									<Item theme={theme} onClick={closeModal}>
										{item.title}
									</Item>
								</Link>
							))}
						</Flex>
					</Col>
					<Col xs={12} sm={4} md={3}>
						<Flex
							gap='24px'
							flexDirection='column'
							alignItems='flex-start'
						>
							<Title size='large' theme={theme}>
								Featured projects
							</Title>
							{quickLinks.map((item, idx) => (
								<Link key={idx} href={Routes.Project}>
									<Item theme={theme} onClick={closeModal}>
										{item.title}
									</Item>
								</Link>
							))}
						</Flex>
					</Col>
					<Col xs={12} sm={4} md={3}>
						<Flex
							gap='24px'
							flexDirection='column'
							alignItems='flex-start'
						>
							<Title size='large' theme={theme}>
								Popular categories
							</Title>
							{popular_categories.map((item, idx) => (
								<Link
									key={idx}
									href={Routes.Projects + item.slug}
								>
									<Item theme={theme} onClick={closeModal}>
										{item.title}
									</Item>
								</Link>
							))}
						</Flex>
					</Col>
					<Col xs={12} md={1.5}></Col>
				</Row>
			</SearchModalContainer>
		</StyledModal>
	);
};

const StyledModal = styled(Modal)`
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[800]
			: neutralColors.gray[200]};
`;

const SearchModalContainer = styled(Container)`
	padding-top: 36px;
	${mediaQueries.tablet} {
		padding-top: 132px;
	}
`;

const SearchBox = styled(Flex)`
	flex-direction: column;
	gap: 16px;
	${mediaQueries.tablet} {
		width: 600px;
	}
	margin: 0 auto 80px;
`;

const Title = styled(Lead)`
	margin-bottom: 16px;
	color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[200]
			: neutralColors.gray[700]};
`;

const Item = styled(Lead)`
	color: ${props =>
		props.theme === ETheme.Dark
			? neutralColors.gray[100]
			: neutralColors.gray[900]};
`;
