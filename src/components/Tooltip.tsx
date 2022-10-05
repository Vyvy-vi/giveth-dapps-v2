import { FC, ReactNode, RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface ITooltipProps {
	parentRef: RefObject<HTMLDivElement>;
	children: ReactNode;
}

export interface ITooltipDirection {
	direction: 'right' | 'left' | 'top' | 'bottom';
	align?: 'center' | 'right' | 'left' | 'top' | 'bottom';
}

export const Tooltip: FC<ITooltipProps> = ({ parentRef, children }) => {
	const el = useRef(document.createElement('div'));
	const childRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		console.log('enter');

		const current = el.current;
		const modalRoot = document.querySelector('body') as HTMLElement;
		const size = parentRef.current?.getBoundingClientRect();

		if (modalRoot) {
			modalRoot.appendChild(current);
		}
		return () => {
			console.log('leave');
			modalRoot!.removeChild(current);
		};
	}, [parentRef]);

	// console.log('top', parentRef.current?.getBoundingClientRect().top);
	console.log('height', childRef.current);

	return createPortal(
		<TooltipContainer
			ref={childRef}
			style={{
				top: parentRef.current?.getBoundingClientRect().top,
				left: parentRef.current?.getBoundingClientRect().left,
			}}
		>
			{children}
		</TooltipContainer>,
		el.current,
	);
};

const TooltipContainer = styled.div`
	position: fixed;
	background-color: red;
	left: 0;
	padding: 0;
	transform: translate(-50%, calc(-100% - 16px));
`;
