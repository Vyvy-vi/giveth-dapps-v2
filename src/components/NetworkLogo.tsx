import React from 'react';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { IconPolygon } from '@/components/Icons/Polygon';
import config from '@/configuration';
import { IconOptimism } from './Icons/Optimism';

const NetworkLogo = (props: { chainId?: number; logoSize?: number }) => {
	const { chainId, logoSize } = props;
	if (chainId === config.MAINNET_NETWORK_NUMBER) {
		return <IconEthereum size={logoSize} />;
	} else if (chainId === config.XDAI_NETWORK_NUMBER) {
		return <IconGnosisChain size={logoSize} />;
	} else if (chainId === config.POLYGON_NETWORK_NUMBER) {
		return <IconPolygon size={logoSize} />;
	} else if (chainId === config.OPTIMISM_NETWORK_NUMBER) {
		return <IconOptimism size={logoSize} />;
	} else return null;
};

export default NetworkLogo;
