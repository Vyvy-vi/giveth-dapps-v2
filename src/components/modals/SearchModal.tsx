import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { brandColors, H6, Lead, neutralColors } from '@giveth/ui-design-system';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Col, Container, Row } from '../Grid';
import { Flex } from '../styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';
import { ETheme } from '@/features/general/general.slice';
import { useAppSelector } from '@/features/hooks';
import { SearchInput } from '../SearchInput';

const quickLinks = [
	{ title: 'Top ranking projects', query: '' },
	{ title: 'Most funded projects', query: '' },
	{ title: 'New projects', query: '' },
	{ title: 'Most liked projects', query: '' },
];

export const SearchModal: FC<IModal> = ({ setShowModal }) => {
	const [term, setTerm] = useState<string>('');
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const theme = useAppSelector(state => state.general.theme);

	useEffect(() => {}, [term]);

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
					<Col xs={12} sm={1.5}></Col>
					<Col xs={12} sm={3}>
						<Flex
							gap='24px'
							flexDirection='column'
							alignItems='flex-start'
						>
							<Title size='large' theme={theme}>
								Quick links
							</Title>
							{quickLinks.map((item, idx) => (
								<Item key={idx} theme={theme}>
									{item.title}
								</Item>
							))}
						</Flex>
					</Col>
					<Col xs={12} sm={3}>
						<Flex
							gap='24px'
							flexDirection='column'
							alignItems='flex-start'
						>
							<Title size='large' theme={theme}>
								Featuerd projects
							</Title>
							{quickLinks.map((item, idx) => (
								<Item key={idx} theme={theme}>
									{item.title}
								</Item>
							))}
						</Flex>
					</Col>
					<Col xs={12} sm={3}>
						<Flex
							gap='24px'
							flexDirection='column'
							alignItems='flex-start'
						>
							<Title size='large' theme={theme}>
								Popular categories
							</Title>
							{quickLinks.map((item, idx) => (
								<Item key={idx} theme={theme}>
									{item.title}
								</Item>
							))}
						</Flex>
					</Col>
					<Col xs={12} sm={1.5}></Col>
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
