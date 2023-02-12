import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
	brandColors,
	Button,
	GLink,
	IconNotificationFilled16,
	neutralColors,
	Overline,
} from '@giveth/ui-design-system';

import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import { formatWeiHelper } from '@/helpers/number';
import { networksParams } from '@/helpers/blockchain';
import {
	ConnectButton,
	HBContainer,
	HBContent,
	HBPic,
	BalanceButton,
	HeaderLinks,
	HeaderLink,
	StyledHeader,
	WalletButton,
	WBInfo,
	WBNetwork,
	SmallCreateProject,
	Logo,
	MenuAndButtonContainer,
	CoverLine,
	SmallCreateProjectParent,
	LargeCreateProject,
	MainLogoBtn,
	NotificationsButton,
	NotificationsIconContainer,
	NotificationsButtonCircle,
} from './Header.sc';
import { RewardMenu } from '@/components/menu/RewardMenu';
import MenuWallet from '@/components/menu/MenuWallet';
import { menuRoutes } from '../menu/menuRoutes';
import { isUserRegistered, shortenAddress } from '@/lib/helpers';
import HeaderRoutesResponsive from './HeaderResponsiveRoutes';
import Routes from '@/lib/constants/Routes';
import {
	currentValuesHelper,
	useAppDispatch,
	useAppSelector,
} from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import {
	setShowWalletModal,
	setShowWelcomeModal,
	setShowCompleteProfile,
} from '@/features/modal/modal.slice';
import { slugToProjectView } from '@/lib/routeCreators';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import NotificationMenu from '../notification/NotificationMenu';
import useDetectDevice from '@/hooks/useDetectDevice';
import { fetchNotificationsData } from '@/features/notification/notification.services';
import { useNotification } from '@/hooks/useNotification';
import { IconGIV } from '../Icons/GIV';
import { useModalCallback } from '@/hooks/useModalCallback';

export interface IHeader {
	theme?: ETheme;
	show?: boolean;
}

const Header: FC<IHeader> = () => {
	const [showRewardMenu, setShowRewardMenu] = useState(false);
	const [showRewardMenuModal, setShowRewardMenuModal] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [showHeader, setShowHeader] = useState(true);
	const [isGIVeconomyRoute, setIsGIVeconomyRoute] = useState(false);
	const [showBackBtn, setShowBackBtn] = useState(false);
	const { notifications, setNotifications, markOneNotificationRead } =
		useNotification();

	const { chainId, active, account, library } = useWeb3React();
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph[currentValuesHelper(chainId)]),
	);
	const givBalance = sdh.getGIVTokenBalance();
	const dispatch = useAppDispatch();
	const { isEnabled, isSignedIn, userData } = useAppSelector(
		state => state.user,
	);
	const theme = useAppSelector(state => state.general.theme);
	const { total: totalUnreadNotifications } = useAppSelector(
		state => state.notification.notificationInfo,
	);
	const { lastNotificationId } = useAppSelector(
		state => state.notification.notificationInfo,
	);
	const { isMobile } = useDetectDevice();

	const router = useRouter();
	const { formatMessage } = useIntl();
	const isLight = theme === ETheme.Light;
	const lastFetchedNotificationId = notifications[0]?.id ?? undefined;
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
		} else {
			router.back();
		}
	};

	useEffect(() => {
		setIsGIVeconomyRoute(router.route.startsWith('/giv'));
		setShowBackBtn(
			router.route.startsWith(Routes.CreateProject) ||
				router.route.startsWith(Routes.Verification),
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
			if (!show) {
				setShowRewardMenu(false);
				setShowUserMenu(false);
			}
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

	useEffect(() => {
		const fetchNotificationsAndSetState = async () => {
			if (!isSignedIn) return;
			try {
				const res = await fetchNotificationsData({ limit: 4 });
				if (res?.notifications) setNotifications(res.notifications);
			} catch {
				console.log('Error fetching notifications');
			}
		};

		if (
			typeof lastFetchedNotificationId === 'number' &&
			lastNotificationId > lastFetchedNotificationId
		) {
			fetchNotificationsAndSetState();
			return;
		}

		fetchNotificationsAndSetState();
	}, [lastNotificationId, isSignedIn]);

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

	const handleRewardMenuOnLeave = () => {
		if (!showRewardMenuModal) {
			setShowRewardMenu(false);
		}
	};

	const { modalCallback: signInThenGoToNotifs } = useModalCallback(() =>
		router.push(Routes.Notifications),
	);

	const notificationsProps =
		isEnabled && !isSignedIn
			? {
					onClick: () => signInThenGoToNotifs(),
			  }
			: {
					onClick: () => setShowNotifications(true),
					onMouseEnter: () => setShowNotifications(true),
					onMouseLeave: () => setShowNotifications(false),
			  };

	return (
		<StyledHeader
			justifyContent='space-between'
			alignItems='center'
			theme={theme}
			show={showHeader}
		>
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
					<>
						<MainLogoBtn>
							<Link href={Routes.Home}>
								<Logo>
									<Image
										width='48'
										height='48'
										alt='Giveth logo'
										src='/images/logo/logo1.png'
									/>
								</Logo>
							</Link>
						</MainLogoBtn>
						<HeaderRoutesResponsive />
					</>
				)}
			</Flex>
			{!showBackBtn && (
				<HeaderLinks theme={theme}>
					{menuRoutes.map((link, index) => (
						<Link href={link.href[0]} key={index}>
							<HeaderLink
								size='Big'
								theme={theme}
								active={link.href.includes(router.route)}
							>
								{formatMessage({ id: link.title })}
							</HeaderLink>
						</Link>
					))}
				</HeaderLinks>
			)}

			<Flex gap='8px'>
				<LargeCreateProject>
					<Button
						label={formatMessage({
							id: 'component.button.create_project',
						})}
						size='small'
						buttonType={isLight ? 'primary' : 'secondary'}
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
						{!isMobile && (
							<MenuAndButtonContainer {...notificationsProps}>
								<NotificationsButton outline theme={theme}>
									<NotificationsIconContainer>
										{totalUnreadNotifications > 0 && (
											<NotificationsButtonCircle>
												<Overline styleType='Small'>
													{totalUnreadNotifications}
												</Overline>
											</NotificationsButtonCircle>
										)}
										<IconNotificationFilled16
											color={
												isLight
													? brandColors.pinky[500]
													: neutralColors.gray[100]
											}
										/>
									</NotificationsIconContainer>
									<CoverLine theme={theme} />
								</NotificationsButton>
								{showNotifications && isSignedIn && (
									<NotificationMenu
										notifications={notifications}
										markOneNotificationRead={
											markOneNotificationRead
										}
									/>
								)}
							</MenuAndButtonContainer>
						)}
						<MenuAndButtonContainer
							onClick={() => setShowRewardMenu(true)}
							onMouseEnter={() => setShowRewardMenu(true)}
							onMouseLeave={handleRewardMenuOnLeave}
						>
							<BalanceButton outline theme={theme}>
								<HBContainer>
									<IconGIV size={24} />
									<HBContent size='Big'>
										{formatWeiHelper(givBalance.balance)}
									</HBContent>
								</HBContainer>
								<CoverLine theme={theme} />
							</BalanceButton>
							{showRewardMenu && (
								<RewardMenu
									showWhatIsGIVstreamModal={
										showRewardMenuModal
									}
									setShowWhatIsGIVstreamModal={
										setShowRewardMenuModal
									}
								/>
							)}
						</MenuAndButtonContainer>
						<MenuAndButtonContainer
							onClick={() => setShowUserMenu(true)}
							onMouseEnter={() => setShowUserMenu(true)}
							onMouseLeave={() => setShowUserMenu(false)}
						>
							<WalletButton outline theme={theme}>
								<HBContainer>
									<HBPic
										src={
											userData?.avatar ||
											'/images/placeholders/profile.png'
										}
										alt='Profile Pic'
										width={'24px'}
										height={'24px'}
									/>
									<WBInfo>
										<GLink size='Medium'>
											{userData?.name ||
												shortenAddress(account)}
										</GLink>
										<WBNetwork size='Tiny'>
											{formatMessage({
												id: 'label.connected_to',
											})}{' '}
											{networksParams[chainId]
												?.chainName ||
												library?._network?.name}
										</WBNetwork>
									</WBInfo>
								</HBContainer>
								<CoverLine theme={theme} />
							</WalletButton>
							{showUserMenu && <MenuWallet />}
						</MenuAndButtonContainer>
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
		</StyledHeader>
	);
};

export default Header;
