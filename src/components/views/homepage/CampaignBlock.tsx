import {
	ButtonText,
	H1,
	H4,
	H5,
	IconPointerLeft,
	IconPointerRight,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper/types';
import { IProject } from '@/apollo/types/types';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import ProjectCard from '@/components/project-card/ProjectCard';
import useDetectDevice from '@/hooks/useDetectDevice';
import { Shadow } from '@/components/styled-components/Shadow';
import 'swiper/css';

const CampaignBlock = (props: { projects: IProject[] }) => {
	const { isMobile, isTablet, isLaptopS, isLaptopL, isDesktop } =
		useDetectDevice();
	const [swiperInstance, setSwiperInstance] = useState<SwiperClass>();
	const [currentSlide, setCurrentSlide] = useState(1);
	const { projects } = props;

	const slidesPerView = isMobile
		? 1.1
		: isTablet
		? 1.3
		: isLaptopS
		? 2.1
		: isLaptopL
		? 2.3
		: 3;
	// const _projects = projects.slice(0, 5);
	const _projects = projects;
	let paginationCount = Math.floor(_projects.length - slidesPerView + 1);
	if (!isDesktop) paginationCount += 1;
	const pages = Array.from(Array(paginationCount).keys());

	useEffect(() => {
		if (swiperInstance)
			swiperInstance?.on('slideChange', () =>
				setCurrentSlide(swiperInstance?.realIndex + 1),
			);
	}, [swiperInstance]);

	return (
		<Wrapper>
			<Link
				target='_blank'
				href='https://medium.com/giveth/ways-to-help-earthquake-victims-in-turkey-and-syria-on-giveth-155d7855164'
			>
				<ReliefBanner />
			</Link>
			<UpperSection>
				<Title weight={700}>Earthquake Response</Title>
				<Pagination>
					<PointerWrapper id='homeCampaignPrev'>
						<IconPointerLeft size={24} />
					</PointerWrapper>
					{pages.map(index => (
						<PaginationItem
							key={index}
							onClick={() => swiperInstance?.slideTo(index)}
							isActive={currentSlide === index + 1}
						>
							{index + 1}
						</PaginationItem>
					))}
					<PointerWrapper id='homeCampaignNext'>
						<IconPointerRight size={24} />
					</PointerWrapper>
				</Pagination>
			</UpperSection>
			<BottomSection>
				<SavePlanet>
					<H1 weight={700}>Help Turkey & Syria</H1>
					{/* <InternalLink href={''} color={brandColors.giv[500]}>
						<ExploreText>
							EXPLORE <IconChevronRight32 />
						</ExploreText>
					</InternalLink> */}
				</SavePlanet>
				<SwiperWrapper>
					<Swiper
						onSwiper={setSwiperInstance}
						slidesPerView={slidesPerView}
						modules={[Navigation]}
						navigation={{
							nextEl: '#homeCampaignNext',
							prevEl: '#homeCampaignPrev',
						}}
						spaceBetween={24}
					>
						{_projects.map(project => (
							<SwiperSlide key={project.id}>
								<ProjectCard project={project} />
							</SwiperSlide>
						))}
					</Swiper>
				</SwiperWrapper>
			</BottomSection>
		</Wrapper>
	);
};

const PaginationItem = styled(H5)<{ isActive: boolean }>`
	border-radius: 50%;
	cursor: pointer;
	user-select: none;
	color: ${({ isActive }) =>
		isActive ? neutralColors.gray[900] : neutralColors.gray[700]};
	font-weight: ${({ isActive }) => (isActive ? 700 : 500)};
`;

const UpperSection = styled(Flex)`
	flex-direction: column;
	margin-bottom: 50px;
	${mediaQueries.tablet} {
		margin-bottom: 32px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
`;

const PointerWrapper = styled(FlexCenter)`
	cursor: pointer;
	border-radius: 48px;
	box-shadow: ${Shadow.Giv[400]};
	padding: 8px 13px;
	&.swiper-button-disabled {
		opacity: 0.4;
		cursor: default;
	}
`;

const Pagination = styled(Flex)`
	gap: 24px;
	align-items: center;
	margin: 0 auto;
	${mediaQueries.tablet} {
		margin-left: 0;
		margin-right: 32px;
	}
	${mediaQueries.laptopL} {
		margin-right: 40px;
	}
	${mediaQueries.desktop} {
		margin-right: 120px;
	}
`;

const SwiperWrapper = styled.div`
	padding: 24px 32px 20px;
	width: 100%;
	overflow: hidden;
	.swiper {
		overflow: unset;
	}
	${mediaQueries.tablet} {
		padding: 20px 24px 20px;
	}
	${mediaQueries.desktop} {
		padding-right: 10px;
	}
`;

const BottomSection = styled(Flex)`
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const Title = styled(H4)`
	color: ${neutralColors.gray[600]};
	padding-left: 58px;
	margin-bottom: 40px;
	${mediaQueries.tablet} {
		margin-bottom: 0;
		padding-left: 32px;
	}
	${mediaQueries.laptopL} {
		padding-left: 40px;
	}
	${mediaQueries.desktop} {
		padding-left: 120px;
	}
`;

const ExploreText = styled(ButtonText)`
	margin-top: 44px;
	display: flex;
	align-items: center;
	gap: 10px;
`;

const SavePlanet = styled.div`
	z-index: 2;
	background: white;
	border-radius: 12px;
	box-shadow: 12px 0 20px rgba(212, 218, 238, 0.4);
	padding: 16px 24px 20px 16px;
	margin: 0 32px;
	max-width: 311px;
	user-select: none;
	${mediaQueries.tablet} {
		margin: 0;
		max-width: 263px;
		padding: 73px 24px 70px 34px;
	}
	${mediaQueries.desktop} {
		max-width: 391px;
		padding: 73px 24px 77px 144px;
	}
`;

const Wrapper = styled.div`
	padding: 40px 0 80px;
	max-width: 1440px;
	margin: 0 auto;
	${mediaQueries.tablet} {
		padding: 42px 0;
	}
`;

const ReliefBanner = styled.div`
	display: none;
	min-height: 600px;
	position: relative;
	margin: 0;
	z-index: 2;
	overflow: hidden;
	background: transparent;
	background-image: url('/images/banners/relief-banner.png');
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	box-shadow: none;
	${mediaQueries.tablet} {
		display: flex;
		margin: 20px 10px 40px 10px;
	}
`;

export default CampaignBlock;
