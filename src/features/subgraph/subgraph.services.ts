import { captureException } from '@sentry/nextjs';
import config from '@/configuration';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { fetchSubgraph } from '@/services/subgraph.service';
import { defaultSubgraphValues } from './subgraph.slice';

export const fetchMainnetInfo = async (userAddress?: string) => {
	try {
		const response = await fetchSubgraph(
			SubgraphQueryBuilder.getMainnetQuery(userAddress),
			config.MAINNET_NETWORK_NUMBER,
		);
		return transformSubgraphData({
			...response,
			networkNumber: config.MAINNET_NETWORK_NUMBER,
		});
	} catch (e) {
		console.error('Error on query mainnet subgraph:', e);
		captureException(e, {
			tags: {
				section: 'fetchMainnetSubgraph',
			},
		});
		return defaultSubgraphValues;
	}
};

export const fetchGnosisInfo = async (userAddress?: string) => {
	try {
		const response = await fetchSubgraph(
			SubgraphQueryBuilder.getGnosisQuery(userAddress),
			config.XDAI_NETWORK_NUMBER,
		);
		return transformSubgraphData({
			...response,
			networkNumber: config.XDAI_NETWORK_NUMBER,
		});
	} catch (e) {
		console.error('Error on query Gnosis subgraph:', e);
		captureException(e, {
			tags: {
				section: 'fetchGnosisSubgraph',
			},
		});
		return defaultSubgraphValues;
	}
};

export const fetchOptimismInfo = async (userAddress?: string) => {
	try {
		const response = await fetchSubgraph(
			SubgraphQueryBuilder.getOptimismQuery(userAddress),
			config.OPTIMISM_NETWORK_NUMBER,
		);
		return transformSubgraphData({
			...response,
			networkNumber: config.OPTIMISM_NETWORK_NUMBER,
		});
	} catch (e) {
		console.error('Error on query Optimism subgraph:', e);
		captureException(e, {
			tags: {
				section: 'fetchOptimismSubgraph',
			},
		});
		return defaultSubgraphValues;
	}
};
