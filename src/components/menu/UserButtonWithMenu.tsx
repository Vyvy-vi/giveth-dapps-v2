import React, { FC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import { networksParams } from '@/helpers/blockchain';
import { shortenAddress } from '@/lib/helpers';
import {
	MenuAndButtonContainer,
	WalletButton,
	HBContainer,
	HBPic,
	WBInfo,
	WBNetwork,
	CoverLine,
	HeaderSidebarButtonWrapper,
	SidebarInnerContainer,
	UserName,
} from '../Header/Header.sc';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { useDelayedState } from '@/hooks/useDelayedState';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { SideBar, ESideBarDirection } from '../sidebar/SideBar';
import { MenuContainer } from './Menu.sc';
import { UserItems } from './UserItems';
import { FlexSpacer } from '../styled-components/Flex';
import { ItemsProvider } from '@/context/Items.context';

export interface IHeaderButtonProps {
	isHeaderShowing: boolean;
	theme: ETheme;
}

interface IUserButtonWithMenuProps extends IHeaderButtonProps {}

export const UserButtonWithMenu: FC<IUserButtonWithMenuProps> = ({
	isHeaderShowing,
	theme,
}) => {
	const [showMenu, menuCondition, openMenu, closeMenu] = useDelayedState();

	const isDesktop = useMediaQuery(device.laptopL);
	const [showSidebar, sidebarCondition, openSidebar, closeSidebar] =
		useDelayedState();

	useEffect(() => {
		if (!isHeaderShowing) {
			closeMenu();
		}
	}, [isHeaderShowing]);

	const props = isDesktop
		? {
				onMouseEnter: () => openMenu(),
				onMouseLeave: () => closeMenu(),
		  }
		: { onClick: openSidebar };

	return (
		<MenuAndButtonContainer {...props}>
			<WalletButton outline theme={theme} isHover={showMenu}>
				<HeaderUserButton />
				<CoverLine theme={theme} className='cover-line' />
			</WalletButton>
			{menuCondition && (
				<MenuContainer isAnimating={showMenu} theme={theme}>
					<ItemsProvider close={closeMenu}>
						<UserItems />
					</ItemsProvider>
				</MenuContainer>
			)}
			{sidebarCondition && (
				<SideBar
					close={closeSidebar}
					isAnimating={showSidebar}
					direction={ESideBarDirection.Right}
					header={
						<>
							<FlexSpacer />
							<HeaderSidebarButtonWrapper>
								<HeaderUserButton />
							</HeaderSidebarButtonWrapper>
						</>
					}
				>
					<SidebarInnerContainer>
						<ItemsProvider close={closeSidebar}>
							<UserItems />
						</ItemsProvider>
					</SidebarInnerContainer>
				</SideBar>
			)}
		</MenuAndButtonContainer>
	);
};

const HeaderUserButton = ({}) => {
	const { chainId, account, library } = useWeb3React();
	const { userData } = useAppSelector(state => state.user);
	const { formatMessage } = useIntl();
	return (
		<HBContainer>
			<HBPic
				src={userData?.avatar || '/images/placeholders/profile.png'}
				alt='Profile Pic'
				width={'24px'}
				height={'24px'}
			/>
			<WBInfo>
				<UserName size='Medium'>
					{userData?.name || shortenAddress(account)}
				</UserName>
				<WBNetwork size='Tiny'>
					{formatMessage({
						id: 'label.connected_to',
					})}{' '}
					{(chainId && networksParams[chainId]?.chainName) ||
						library?._network?.name}
				</WBNetwork>
			</WBInfo>
		</HBContainer>
	);
};
