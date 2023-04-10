import { neutralColors, semanticColors } from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled from 'styled-components';

export enum EBadgeStatus {
	DEFAULT,
	WARNING,
	ERROR,
	SUCCESS,
}

interface IBadge {
	label: string;
	status: EBadgeStatus;
	showBullet?: boolean;
}

const badgeStatusToColor = (status: EBadgeStatus) => {
	switch (status) {
		case EBadgeStatus.DEFAULT:
			return neutralColors.gray;
		case EBadgeStatus.WARNING:
			return semanticColors.golden;
		case EBadgeStatus.ERROR:
			return semanticColors.punch;
		case EBadgeStatus.SUCCESS:
			return semanticColors.jade;
		default:
			return neutralColors.gray;
	}
};

export const Badge: FC<IBadge> = ({ label, status, showBullet }) => {
	return (
		<BadgeContainer mainColor={badgeStatusToColor(status)}>
			{showBullet && <BulletPoint>&bull;</BulletPoint>}
			{label}
		</BadgeContainer>
	);
};

interface IBadgeContainer {
	mainColor: any;
}

export const BadgeContainer = styled.span<IBadgeContainer>`
	display: flex;
	align-items: center;
	font-size: 12px;
	color: ${props => props.mainColor[700]} !important;
	background: ${props => props.mainColor[100]};
	border: 2px solid ${props => props.mainColor[300]};
	box-sizing: border-box;
	border-radius: 50px;
	padding: 2px 8px;
	height: 24px;
`;

const BulletPoint = styled.div`
	font-size: 18px;
	margin-right: 4px;
	padding: 0;
`;
