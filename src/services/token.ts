import { ethers } from 'ethers';

import { captureException } from '@sentry/nextjs';
import { IUser } from '@/apollo/types/types';
import { initializeApollo } from '@/apollo/apolloClient';
import { LOGIN_USER } from '@/apollo/gql/gqlAuth';
import { showToastError } from '@/lib/helpers';
import config from '@/configuration';

const POLYGON_NETWORK = config.POLYGON_NETWORK;
const SECONDARY_NETWORK = config.SECONDARY_NETWORK;

const apolloClient = initializeApollo();

export async function __oldWay_getToken(
	walletAddress: string | null | undefined,
	signature: string,
	networkId: number | undefined,
	user?: IUser,
) {
	if (signature && walletAddress && networkId) {
		try {
			const mutate = {
				mutation: LOGIN_USER,
				variables: {
					walletAddress: ethers.utils.getAddress(walletAddress),
					signature,
					email: user?.email,
					avatar: user?.avatar,
					name: user?.name,
					hostname: window?.location.hostname,
					networkId,
				},
			};
			const { data } = await apolloClient.mutate(mutate);
			return data?.loginWallet?.token;
		} catch (error) {
			showToastError(error);
			captureException(error, {
				tags: {
					section: 'getToken',
				},
			});
		}
	} else {
		showToastError('Input data for getting token is incomplete');
	}
}

export const fetchPrice = async (chainId: number, tokenAddress?: string) => {
	try {
		const chain =
			chainId === POLYGON_NETWORK.id
				? 'polygon-pos'
				: chainId === SECONDARY_NETWORK.id
				? 'xdai'
				: 'ethereum';
		const fetchCall = await fetch(
			`https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${tokenAddress}&vs_currencies=usd`,
		);
		const data = await fetchCall.json();
		return parseFloat(data[Object.keys(data)[0]]?.usd);
	} catch (error) {
		captureException(error, {
			tags: {
				section: 'fetchPrice',
			},
		});
	}
};
