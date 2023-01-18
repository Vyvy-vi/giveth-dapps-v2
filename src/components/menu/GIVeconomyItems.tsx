import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
	B,
	brandColors,
	Caption,
	GLink,
	IconGIVFarm,
	neutralColors,
} from '@giveth/ui-design-system';
import { useAppSelector } from '@/features/hooks';
import { HighlightSection } from './common';
import Routes from '@/lib/constants/Routes';
import { Flex } from '../styled-components/Flex';
import { ETheme } from '@/features/general/general.slice';

const giveconomyItems = [
	{
		title: 'The economy of giving',
		label: 'Giveconomy',
		href: Routes.GIVECONOMY,
	},
	{ title: 'The governance', label: 'GIVgarden', href: Routes.GIVgarden },
	{ title: 'Liquidity to earn', label: 'GIVfarm', href: Routes.GIVfarm },
	{ title: 'Donors reward', label: 'GIVbacks', href: Routes.GIVbacks },
	{ title: 'Invest your GIV', label: 'GIVpower', href: Routes.GIVpower },
	{ title: 'Giveth rewards', label: 'GIVstream', href: Routes.GIVstream },
];

export const GIVeconomyItems = () => {
	const theme = useAppSelector(state => state.general.theme);

	return (
		<>
			<Link href={Routes.GIVfarm}>
				<HighlightSection theme={theme}>
					<Caption>Liquidity</Caption>
					<Flex justifyContent='space-between'>
						<B>GIVfarm</B>
						<IconGIVFarm
							size={24}
							color={
								theme === ETheme.Dark
									? neutralColors.gray[100]
									: neutralColors.gray[900]
							}
						/>
					</Flex>
				</HighlightSection>
			</Link>
			<LearnStyle medium>Learn about</LearnStyle>
			{giveconomyItems.map((item, idx) => (
				<Link key={idx} href={item.href}>
					<MenuItem theme={theme}>
						<GIVeconomyItemTitle size='Small'>
							{item.title}
						</GIVeconomyItemTitle>
						<Label size='Big'>{item.label}</Label>
					</MenuItem>
				</Link>
			))}
		</>
	);
};

const LearnStyle = styled(Caption)`
	margin: 24px 16px 16px;
`;

const MenuItem = styled(Flex)`
	flex-direction: column;
	gap: 4px;
	padding: 4px 16px;
	&:hover {
		background-color: ${props =>
			props.theme === ETheme.Dark
				? brandColors.giv[500]
				: neutralColors.gray[200]};
	}
	border-radius: 8px;
	margin: 8px 0;
	transition: background-color 0.3s ease;
`;

const GIVeconomyItemTitle = styled(GLink)`
	color: ${brandColors.giv[200]};
	color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[200]
			: neutralColors.gray[600]};
`;

const Label = styled(GLink)``;
