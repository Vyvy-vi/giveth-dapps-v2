import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
	Button,
	GLink,
	IconMenu24,
	IconSearch24,
} from '@giveth/ui-design-system';

import { useIntl } from 'react-intl';
import { Flex, FlexSpacer } from '@/components/styled-components/Flex';
import {
	ConnectButton,
	HeaderLinks,
	StyledHeader,
	SmallCreateProject,
	Logo,
	SmallCreateProjectParent,
	LargeCreateProject,
	HeaderLink,
	HomeButton,
	SearchButton,
} from './Header.sc';
import { isUserRegistered } from '@/lib/helpers';
import Routes from '@/lib/constants/Routes';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import {
	setShowWalletModal,
	setShowWelcomeModal,
	setShowCompleteProfile,
	setShowSearchModal,
} from '@/features/modal/modal.slice';
import { slugToProjectView } from '@/lib/routeCreators';

import { useModalCallback } from '@/hooks/useModalCallback';
import { LinkWithMenu } from '../menu/LinkWithMenu';
import { ProjectsMenu } from '../menu/ProjectsMenu';
import { GIVeconomyMenu } from '../menu/GIVeconomyMenu';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { ESideBarDirection, SideBar } from '../sidebar/SideBar';
import { useDelayedState } from '@/hooks/useDelayedState';
import { RewardButtonWithMenu } from '../menu/RewardButtonWithMenu';
import { UserButtonWithMenu } from '../menu/UserButtonWithMenu';
import { NotificationButtonWithMenu } from '../menu/NotificationButtonWithMenu';
import { HomeSidebar } from '../sidebar/HomeSidebar';
import { fetchMainCategories } from '@/features/general/general.thunk';
import { ItemsProvider } from '@/context/Items.context';

export interface IHeader {
	theme?: ETheme;
	show?: boolean;
}

const Header: FC<IHeader> = () => {
	const [showHeader, setShowHeader] = useState(true);
	const [isGIVeconomyRoute, setIsGIVeconomyRoute] = useState(false);
	const [showBackBtn, setShowBackBtn] = useState(false);

	const [showSidebar, sidebarCondition, openSidebar, closeSidebar] =
		useDelayedState();

	const { chainId, active, account } = useWeb3React();

	const dispatch = useAppDispatch();
	const { isEnabled, isSignedIn, userData } = useAppSelector(
		state => state.user,
	);
	const theme = useAppSelector(state => state.general.theme);

	const router = useRouter();
	const { formatMessage } = useIntl();
	const isDesktop = useMediaQuery(device.laptopL);
	const isMobile = useMediaQuery(device.mobileL);

	const handleBack = () => {
		const calculateSlug = () => {
			if (typeof router.query?.slug === 'string') {
				return router.query?.slug;
			}
			return '';
		};
		if (
			router.route.startsWith(Routes.Verification) &&
			router?.query?.slug &&
			!router?.query?.token
		) {
			router.push(slugToProjectView(calculateSlug()));
		} else if (
			router.route.startsWith(Routes.Verification) &&
			router?.query?.token
		) {
			router.push(`${Routes.Verification}/${calculateSlug()}`);
		} else if (router.route.startsWith(Routes.NFTMint)) {
			router.push(Routes.NFT);
		} else {
			router.back();
		}
	};

	useEffect(() => {
		dispatch(fetchMainCategories());
	}, []);

	useEffect(() => {
		setIsGIVeconomyRoute(router.route.startsWith('/giv'));
		setShowBackBtn(
			router.route.startsWith(Routes.CreateProject) ||
				router.route.startsWith(Routes.Verification) ||
				router.route.startsWith(Routes.NFTMint),
		);
	}, [router.route]);

	useEffect(() => {
		const threshold = 0;
		let lastScrollY = window.pageYOffset;
		let ticking = false;

		const updateScrollDir = () => {
			const scrollY = window.pageYOffset;

			if (Math.abs(scrollY - lastScrollY) < threshold) {
				ticking = false;
				return;
			}
			const show = scrollY <= lastScrollY;
			setShowHeader(show);
			lastScrollY = scrollY > 0 ? scrollY : 0;
			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(updateScrollDir);
				ticking = true;
			}
		};

		window.addEventListener('scroll', onScroll);

		return () => window.removeEventListener('scroll', onScroll);
	}, [showHeader]);

	const handleModals = () => {
		if (isGIVeconomyRoute) {
			dispatch(setShowWalletModal(true));
		} else {
			dispatch(setShowWelcomeModal(true));
		}
	};

	const { modalCallback: signInThenCreate } = useModalCallback(() =>
		router.push(Routes.CreateProject),
	);

	const handleCreateButton = () => {
		if (!isEnabled) {
			dispatch(setShowWelcomeModal(true));
		} else if (!isSignedIn) {
			signInThenCreate();
		} else if (isUserRegistered(userData)) {
			router.push(Routes.CreateProject);
		} else {
			dispatch(setShowCompleteProfile(true));
		}
	};

	return (
		<StyledHeader alignItems='center' theme={theme} show={showHeader}>
			<Flex>
				{showBackBtn ? (
					<Logo onClick={handleBack}>
						<Image
							width='26'
							height='26'
							alt='Giveth logo'
							src={`/images/back-2.svg`}
						/>
					</Logo>
				) : (
					<Flex gap='24px' alignItems='center'>
						{isMobile && (
							<Link href={Routes.Home}>
								<Logo>
									<Image
										width='50'
										height='50'
										alt='Giveth logo'
										src='/images/logo/logo1.png'
									/>
								</Logo>
							</Link>
						)}
						{!isDesktop && (
							<HomeButton gap='4px' onClick={openSidebar}>
								<IconMenu24 />
								<GLink size='Big'>Home</GLink>
							</HomeButton>
						)}
					</Flex>
				)}
			</Flex>
			{isDesktop && !showBackBtn && (
				<HeaderLinks theme={theme}>
					<LinkWithMenu title='Projects' isHeaderShowing={showHeader}>
						<ProjectsMenu />
					</LinkWithMenu>
					<LinkWithMenu
						title='GIVeconomy'
						isHeaderShowing={showHeader}
					>
						<GIVeconomyMenu />
					</LinkWithMenu>
					<HeaderLink theme={theme}>
						<Link href={Routes.Join}>
							<GLink size='Big'>Community</GLink>
						</Link>
					</HeaderLink>
					<SearchButton
						theme={theme}
						onClick={() => dispatch(setShowSearchModal(true))}
					>
						<Flex alignItems='center' gap='16px'>
							<GLink size='Big'>Search projects</GLink>
							<IconSearch24 />
						</Flex>
					</SearchButton>
				</HeaderLinks>
			)}
			<FlexSpacer />
			<Flex gap='8px'>
				<LargeCreateProject>
					<Button
						label={formatMessage({
							id: 'component.button.create_project',
						})}
						size='small'
						buttonType='primary'
						onClick={handleCreateButton}
					/>
				</LargeCreateProject>
				<SmallCreateProjectParent>
					<SmallCreateProject
						onClick={handleCreateButton}
						buttonType='primary'
						label='+'
					/>
				</SmallCreateProjectParent>
				{active && account && chainId ? (
					<>
						<NotificationButtonWithMenu
							isHeaderShowing={showHeader}
							theme={theme}
						/>
						<RewardButtonWithMenu
							isHeaderShowing={showHeader}
							theme={theme}
						/>
						<UserButtonWithMenu
							isHeaderShowing={showHeader}
							theme={theme}
						/>
					</>
				) : (
					<ConnectButton
						buttonType='primary'
						size='small'
						label={formatMessage({
							id: isGIVeconomyRoute
								? 'component.button.connect_wallet'
								: 'component.button.sign_in',
						})}
						onClick={handleModals}
					/>
				)}
			</Flex>
			{sidebarCondition && (
				<SideBar
					close={closeSidebar}
					isAnimating={showSidebar}
					direction={ESideBarDirection.Left}
				>
					<ItemsProvider close={closeSidebar}>
						<HomeSidebar />
					</ItemsProvider>
				</SideBar>
			)}
		</StyledHeader>
	);
};

export default Header;
