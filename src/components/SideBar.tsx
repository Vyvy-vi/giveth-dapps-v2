import { brandColors, neutralColors } from '@giveth/ui-design-system';
import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { zIndex } from '@/lib/constants/constants';
import { FlexCenter } from './styled-components/Flex';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';

export enum ESideBarDirection {
	Left,
	Right,
}

interface ISideBar {
	close: () => void;
	isAnimating: boolean;
	direction: ESideBarDirection;
	children: ReactNode;
}

export const SideBar: FC<ISideBar> = ({ close, isAnimating, children }) => {
	const theme = useAppSelector(state => state.general.theme);
	const el = useRef(document.createElement('div'));

	useEffect(() => {
		const current = el.current;
		const root = document.querySelector('body') as HTMLElement;
		root.style.overflowY = 'hidden';
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				close();
			}
		};

		if (root) {
			root.addEventListener('keydown', handleKeyDown);
			root.appendChild(current);
		}
		return () => {
			root.removeEventListener('keydown', handleKeyDown);
			root.style.overflowY = 'overlay';
			root!.removeChild(current);
		};
	}, []);

	return createPortal(
		<Background
			isAnimating={isAnimating}
			onClick={e => {
				e.stopPropagation();
				close();
			}}
		>
			<SidebarContainer isAnimating={isAnimating} theme={theme}>
				{children}
			</SidebarContainer>
		</Background>,
		el.current,
	);
};

const Background = styled(FlexCenter)<{ isAnimating: boolean }>`
	width: 100%;
	height: 100%;
	background: ${brandColors.giv[900]}b3;
	position: fixed;
	top: 0;
	left: 0;
	z-index: ${zIndex.MODAL};
	opacity: 0;
	opacity: ${props => (props.isAnimating ? 1 : 0)};
	transition: opacity 0.3s ease;
`;

const SidebarContainer = styled(FlexCenter)<{ isAnimating: boolean }>`
	width: 353px;
	height: 100%;
	overflow-y: auto;
	background: ${brandColors.giv[900]};
	position: fixed;
	top: 0;
	z-index: ${zIndex.MODAL};
	left: 0;
	left: ${props => (props.isAnimating ? 0 : '-353px')};
	transition: left 0.3s ease;
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[600]
			: neutralColors.gray[100]};
	color: ${props =>
		props.theme === ETheme.Dark
			? neutralColors.gray[100]
			: neutralColors.gray[900]};
`;
