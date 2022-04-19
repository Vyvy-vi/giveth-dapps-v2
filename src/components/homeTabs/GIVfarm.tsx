import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import StakingPoolCard from '@/components/cards/StakingPoolCard';
import config from '@/configuration';
import { StakingType } from '@/types/config';
import React, { useEffect, useState } from 'react';
import {
	GIVfarmTopContainer,
	Subtitle,
	Title,
	GIVfarmRewardCard,
	PoolRow,
	ContractRow,
	CopyWrapper,
	GIVfarmBottomContainer,
} from './GIVfarm.sc';
import {
	IconGIVFarm,
	IconExternalLink,
	GLink,
	IconCopy,
} from '@giveth/ui-design-system';
import { NetworkSelector } from '@/components/NetworkSelector';
import StakingPositionCard from '@/components/cards/StakingPositionCard';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { BigNumber } from 'bignumber.js';
import { constants } from 'ethers';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { useFarms } from '@/context/farm.context';
import { TopInnerContainer, ExtLink, ExtLinkRow } from './commons';
import { useWeb3React } from '@web3-react/core';
import { GIVfrens } from '@/components/GIVfrens';
import { givEconomySupportedNetworks } from '@/lib/constants/constants';
import { shortenAddress } from '@/lib/helpers';
import { Col, Container, Row } from '@/components/Grid';
import links from '@/lib/constants/links';
import {
	DaoCard,
	DaoCardTitle,
	DaoCardQuote,
	DaoCardButton,
} from '../GIVfrens.sc';

const GIVfarmTabContainer = styled(Container)``;

export const TabGIVfarmTop = () => {
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const { givTokenDistroHelper } = useTokenDistro();
	const { totalEarned } = useFarms();
	const { chainId } = useWeb3React();

	useEffect(() => {
		setRewardLiquidPart(givTokenDistroHelper.getLiquidPart(totalEarned));
		setRewardStream(
			givTokenDistroHelper.getStreamPartTokenPerWeek(totalEarned),
		);
	}, [totalEarned, givTokenDistroHelper]);

	return (
		<GIVfarmTopContainer>
			<TopInnerContainer>
				<Row style={{ alignItems: 'flex-end' }}>
					<Col xs={12} sm={7} xl={8}>
						<Flex alignItems='baseline' gap='16px'>
							<Title>GIVfarm</Title>
							<IconGIVFarm size={64} />
						</Flex>
						<Subtitle size='medium'>
							Stake tokens in the GIVfarm to grow your rewards.
						</Subtitle>
					</Col>
					<Col xs={12} sm={5} xl={4}>
						<GIVfarmRewardCard
							title='Your GIVfarm rewards'
							wrongNetworkText='GIVfarm is only available on Mainnet and Gnosis Chain.'
							liquidAmount={rewardLiquidPart}
							stream={rewardStream}
							network={chainId}
							targetNetworks={[
								config.MAINNET_NETWORK_NUMBER,
								config.XDAI_NETWORK_NUMBER,
							]}
						/>
					</Col>
				</Row>
			</TopInnerContainer>
		</GIVfarmTopContainer>
	);
};

export const TabGIVfarmBottom = () => {
	const { chainId } = useWeb3React();

	return (
		<GIVfarmBottomContainer>
			<Container>
				<Flex alignItems='center' gap='24px' wrap={1}>
					<NetworkSelector />
					<ExtLinkRow alignItems='center'>
						<ExtLink
							size='Big'
							target='_blank'
							rel='noreferrer'
							href='https://omni.xdaichain.com/bridge'
						>
							Bridge your GIV
						</ExtLink>
						<IconExternalLink />
					</ExtLinkRow>
					<ExtLinkRow alignItems='center'>
						<ExtLink
							size='Big'
							target='_blank'
							rel='noreferrer'
							href={
								chainId === config.XDAI_NETWORK_NUMBER
									? config.XDAI_CONFIG.GIV.BUY_LINK
									: config.MAINNET_CONFIG.GIV.BUY_LINK
							}
						>
							Buy GIV token
						</ExtLink>
						<IconExternalLink />
					</ExtLinkRow>
					<ContractRow>
						<GLink>{`Contract (${
							chainId === config.XDAI_NETWORK_NUMBER
								? config.XDAI_CONFIG.chainName
								: config.MAINNET_CONFIG.chainName
						}):`}</GLink>
						<GLink>
							{shortenAddress(
								chainId === config.XDAI_NETWORK_NUMBER
									? config.XDAI_CONFIG.TOKEN_ADDRESS
									: config.MAINNET_CONFIG.TOKEN_ADDRESS,
							)}
						</GLink>
						<CopyWrapper
							onClick={() => {
								navigator.clipboard.writeText(
									chainId === config.XDAI_NETWORK_NUMBER
										? config.XDAI_CONFIG.TOKEN_ADDRESS
										: config.MAINNET_CONFIG.TOKEN_ADDRESS,
								);
							}}
						>
							<IconCopy />
						</CopyWrapper>
					</ContractRow>
				</Flex>
				{chainId === config.XDAI_NETWORK_NUMBER && (
					<>
						<PoolRow>
							{config.XDAI_CONFIG.pools.map(
								(poolStakingConfig, index) => {
									return (
										<Col
											sm={6}
											lg={4}
											key={`staking_pool_card_xdai_${index}`}
										>
											<StakingPoolCard
												network={
													config.XDAI_NETWORK_NUMBER
												}
												poolStakingConfig={
													poolStakingConfig
												}
											/>
										</Col>
									);
								},
							)}
							<Col sm={6} lg={4}>
								<StakingPoolCard
									network={config.XDAI_NETWORK_NUMBER}
									poolStakingConfig={getGivStakingConfig(
										config.XDAI_CONFIG,
									)}
								/>
							</Col>
						</PoolRow>
						<GIVfrens
							regenFarms={config.XDAI_CONFIG.regenFarms}
							network={config.XDAI_NETWORK_NUMBER}
						/>
					</>
				)}
				{(!chainId ||
					chainId === config.MAINNET_NETWORK_NUMBER ||
					!givEconomySupportedNetworks.includes(chainId)) && (
					<>
						<PoolRow
							disabled={
								!chainId ||
								!givEconomySupportedNetworks.includes(chainId)
							}
						>
							{config.MAINNET_CONFIG.pools.map(
								(poolStakingConfig, index) => {
									return poolStakingConfig.type ===
										StakingType.UNISWAPV3 ? (
										<Col
											sm={6}
											lg={4}
											key={`staking_pool_card_mainnet_${index}`}
										>
											<StakingPositionCard
												network={
													config.MAINNET_NETWORK_NUMBER
												}
												poolStakingConfig={
													poolStakingConfig
												}
											/>
										</Col>
									) : (
										<Col sm={6} lg={4}>
											<StakingPoolCard
												key={`staking_pool_card_mainnet_${index}`}
												network={
													config.MAINNET_NETWORK_NUMBER
												}
												poolStakingConfig={
													poolStakingConfig
												}
											/>
										</Col>
									);
								},
							)}
							<Col sm={6} lg={4}>
								<StakingPoolCard
									network={config.MAINNET_NETWORK_NUMBER}
									poolStakingConfig={getGivStakingConfig(
										config.MAINNET_CONFIG,
									)}
								/>
							</Col>
						</PoolRow>
						<GIVfrens
							regenFarms={config.XDAI_CONFIG.regenFarms}
							network={config.XDAI_NETWORK_NUMBER}
						/>
					</>
				)}
				<Col xs={12}>
					<DaoCard>
						<DaoCardTitle weight={900}>Add Your DAO</DaoCardTitle>
						<DaoCardQuote size='small'>
							Apply to kickstart a RegenFarm for your for-good DAO
						</DaoCardQuote>
						<DaoCardButton
							label='APPLY NOW'
							linkType='primary'
							href={links.JOINGIVFRENS}
							target='_blank'
						/>
					</DaoCard>
				</Col>
			</Container>
		</GIVfarmBottomContainer>
	);
};
