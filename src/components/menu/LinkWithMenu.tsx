import { GLink, IconChevronDown24 } from '@giveth/ui-design-system';
import { FC, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { zIndex } from '@/lib/constants/constants';
import { useAppSelector } from '@/features/hooks';
import { HeaderLink } from '../Header/Header.sc';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface ILinkWithMenu {
	title: string;
	children: ReactNode;
}

export const LinkWithMenu: FC<ILinkWithMenu> = ({ title, children }) => {
	const [show, setShow] = useState(false);
	const elRef = useRef<HTMLDivElement>(null);
	const theme = useAppSelector(state => state.general.theme);
	const { isAnimating, closeModal: closeMenu } = useModalAnimation(setShow);

	return (
		<LinkWithMenuContainer
			onMouseEnter={() => setShow(true)}
			onMouseLeave={closeMenu}
			ref={elRef}
			theme={theme}
		>
			<GLink size='Big'>{title}</GLink>
			<ArrowContainer up={show}>
				<IconChevronDown24 />
			</ArrowContainer>
			{show && (
				<Menu isAnimating={isAnimating} parentRef={elRef}>
					{children}
				</Menu>
			)}
		</LinkWithMenuContainer>
	);
};

const LinkWithMenuContainer = styled(HeaderLink)`
	padding: 10px 42px 10px 16px;
	cursor: pointer;
	position: relative;
`;

const ArrowContainer = styled.span<{ up: boolean }>`
	position: relative;
	margin-left: 10px;
	width: 24px;
	height: 24px;
	display: inline-block;
	transition: transform 0.3s ease;
	transform: ${props => (props.up ? 'rotate(-180deg)' : 'rotate(0deg)')};
	position: absolute;
	top: 9px;
	right: 10px;
`;

interface IMenuProps {
	parentRef: RefObject<HTMLDivElement>;
	isAnimating: boolean;
	children: ReactNode;
}

export const Menu: FC<IMenuProps> = ({ parentRef, isAnimating, children }) => {
	const el = useRef(document.createElement('div'));

	useEffect(() => {
		const current = el.current;
		const body = document.querySelector('body') as HTMLElement;

		if (body) {
			body.appendChild(current);
		}
		return () => {
			body!.removeChild(current);
		};
	}, []);

	return createPortal(
		<MenuContainer
			isAnimating={isAnimating}
			style={{
				top: parentRef?.current?.getBoundingClientRect().bottom,
				left: parentRef?.current?.getBoundingClientRect().left,
			}}
		>
			{children}
		</MenuContainer>,
		el.current,
	);
};

const MenuContainer = styled.div<{ isAnimating: boolean }>`
	position: fixed;
	color: #fff;
	border-radius: 6px;
	padding: 8px 0;
	z-index: ${zIndex.MODAL};
	top: 0;
	left: 0;
	opacity: ${props => (props.isAnimating ? 0 : 1)};
	transition: opacity 0.3s ease;
`;
