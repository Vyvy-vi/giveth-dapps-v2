import React, { FC } from 'react';
import styled from 'styled-components';
import { IAdminUser } from '@/apollo/types/types';
import { useGiverPFPToken } from '@/hooks/useGiverPFPToken';
import { Flex } from '@/components/styled-components/Flex';
import { shortenAddress } from '@/lib/helpers';
import { PFP } from './PFP';
import { addressToUserView } from '@/lib/routeCreators';
import Link from 'next/link';

interface IUserWithPFPInCell {
	user: IAdminUser;
}

export const UserWithPFPInCell: FC<IUserWithPFPInCell> = ({ user }) => {
	const pfpToken = useGiverPFPToken(user?.walletAddress, user?.avatar);
	console.log(addressToUserView(user?.walletAddress?.toLowerCase()));
	const name =
		user?.name || shortenAddress(user?.walletAddress?.toLowerCase());
	return pfpToken ? (
		<Flex gap='12px' alignItems='center'>
			<StyledPFP pfpToken={pfpToken} />
			<Link href={addressToUserView(user?.walletAddress?.toLowerCase())}>{name || '\u200C'} </Link>
		</Flex>
	) : (
		<NoAvatar><Link href={addressToUserView(user?.walletAddress?.toLowerCase())}>{name || '\u200C'} </Link></NoAvatar>
	);
};
const StyledPFP = styled(PFP)`
	margin-top: 5px;
	margin-left: 5px;
`;

const Bold = styled.span`
	font-weight: 500;
`;

const NoAvatar = styled.span`
	padding-left: 44px;
`;
