import { createAsyncThunk } from '@reduxjs/toolkit';
import config from '@/configuration';
import {
	fetchMainnetInfo,
	fetchGnosisInfo,
	fetchOptimismInfo,
} from './subgraph.services';
import { ICurrentInfo } from './subgraph.types';

export const fetchOptimismInfoAsync = createAsyncThunk(
	'subgraph/fetchOptimismInfo',
	async (userAddress?: string) => {
		const response = await fetchOptimismInfo(userAddress);
		return { ...response, isLoaded: true };
	},
);

export const fetchGnosisInfoAsync = createAsyncThunk(
	'subgraph/fetchGnosisInfo',
	async (userAddress?: string) => {
		const response = await fetchGnosisInfo(userAddress);
		return { ...response, isLoaded: true };
	},
);

export const fetchMainnetInfoAsync = createAsyncThunk(
	'subgraph/fetchMainnetInfo',
	async (userAddress?: string) => {
		const response = await fetchMainnetInfo(userAddress);
		return { ...response, isLoaded: true };
	},
);

export const fetchCurrentInfoAsync = createAsyncThunk(
	'subgraph/fetchCurrentInfo',
	async (props: ICurrentInfo) => {
		const response =
			props.chainId === config.MAINNET_NETWORK_NUMBER
				? await fetchMainnetInfo(props.userAddress)
				: config.OPTIMISM_NETWORK_NUMBER
				? fetchOptimismInfo(props.userAddress)
				: await fetchGnosisInfo(props.userAddress);
		return {
			response: { ...response, isLoaded: true },
			chainId: props.chainId,
		};
	},
);
