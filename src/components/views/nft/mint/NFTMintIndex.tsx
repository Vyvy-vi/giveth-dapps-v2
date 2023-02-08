import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	Button,
	ButtonLink,
	H1,
	Lead,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { Contract } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { JsonRpcProvider } from '@ethersproject/providers';
import { OvalVerticalGradient, OvalHorizontalGradient } from '../common.styles';
import { Col, Container, Row } from '@/components/Grid';
import { MintCard } from '@/components/cards/MintCard';
import config from '@/configuration';
import { abi as PFP_ABI } from '@/artifacts/pfpGiver.json';
import { GiversPFP } from '@/types/contracts';
import { EPFPMinSteps, usePFPMintData } from '@/context/pfpmint.context';
import EligibilityModal from '../overview/EligibilityModal';

export const NFTMintIndex = () => {
	const { formatMessage } = useIntl();
	const { account, library, chainId } = useWeb3React();
	const { step, setStep, qty, tx: txHash } = usePFPMintData();
	const [showEligibilityModal, setShowEligibilityModal] = useState(false);

	useEffect(() => {
		const checkAddress = async () => {
			if (!library || !account) return;
			try {
				const _provider =
					chainId === config.MAINNET_NETWORK_NUMBER
						? library
						: new JsonRpcProvider(config.MAINNET_CONFIG.nodeUrl);
				const PFPContract = new Contract(
					config.MAINNET_CONFIG.PFP_CONTRACT_ADDRESS ?? '',
					PFP_ABI,
					_provider,
				) as GiversPFP;
				const res = await PFPContract.allowList(account);
				if (!res) {
					setShowEligibilityModal(true);
				}
				console.log(res);
			} catch (error) {
				console.log('Error on check allow List', error);
			}
		};
		checkAddress();
	}, [account, chainId, library]);

	return (
		<MintViewContainer>
			<OvalVerticalGradient />
			<OvalHorizontalGradient />
			<MintContainer>
				<Row style={{ paddingBottom: '20px;' }}>
					<Col xs={12} sm={8} md={6}>
						{step === EPFPMinSteps.MINT ? (
							<>
								<Title>
									{formatMessage({
										id: 'label.mint_your_giver',
									})}
								</Title>
								<ContentWrapper>
									<Desc size='medium'>
										{formatMessage({
											id: 'page.mint.mint_your_giver.desc',
										})}
									</Desc>
									<MintCard />
								</ContentWrapper>
							</>
						) : step === EPFPMinSteps.SUCCESS ? (
							<>
								<Title>
									{formatMessage({
										id: 'label.welcome_giver',
									})}
								</Title>
								<ContentWrapper>
									<Desc>
										{formatMessage(
											{
												id: 'page.mint.welcome_giver.desc',
											},
											{
												itemCount: qty,
											},
										)}
									</Desc>
									<ButtonLink
										linkType='texty'
										label='View on  OPENSEA'
										href=''
									/>
									<Image
										src='/images/yellow_flower_full.svg'
										alt='yellow flower'
										width={360}
										height={360}
									/>
								</ContentWrapper>
							</>
						) : (
							<>
								<Title>
									{formatMessage({
										id: 'label.uh_oh',
									})}
								</Title>
								<ContentWrapper>
									<Desc>
										{formatMessage({
											id: 'page.mint.fail.desc',
										})}
									</Desc>
									<ButtonLink
										linkType='texty'
										label='View transaction on etherscan'
										href={`${config.MAINNET_CONFIG.blockExplorerUrls}/tx/${txHash}`}
									/>
									<MintAgainButton
										label={formatMessage({
											id: 'label.mint_again',
										})}
										buttonType='primary'
										size='large'
										onClick={() =>
											setStep(EPFPMinSteps.MINT)
										}
									/>
									<Image
										src='/images/yellow_flower_full.svg'
										alt='yellow flower'
										width={360}
										height={360}
									/>
								</ContentWrapper>
							</>
						)}
					</Col>
					<Col xs={12} sm={4} md={6}>
						<ImagesWrapper>
							<Image1>
								<Image
									src='/images/nft/pfp-mint.png'
									alt='nft'
									fill
								/>
							</Image1>
							<Image2>
								<Image
									src='/images/nft/pfp-mint.png'
									alt='nft'
									fill
								/>
							</Image2>
						</ImagesWrapper>
					</Col>
				</Row>
			</MintContainer>
			{showEligibilityModal && (
				<EligibilityModal
					isSuccess={false}
					setShowModal={setShowEligibilityModal}
				/>
			)}
		</MintViewContainer>
	);
};

const MintViewContainer = styled.div`
	min-height: 100vh;
	position: relative;
	overflow-x: hidden;
`;

const MintContainer = styled(Container)`
	padding-top: 200px;
	position: relative;
`;

const Title = styled(H1)`
	font-weight: 700;
	color: ${brandColors.deep[100]};
	margin-bottom: 22px;
`;

const ContentWrapper = styled.div`
	/* flex-direction: column; */
	/* align-items: center; */
	gap: 21px;
	position: relative;
	z-index: 2;
	${mediaQueries.tablet} {
		max-width: 480px;
	}
`;

const Desc = styled(Lead)`
	margin-bottom: 32px;
	text-align: center;
	width: 100%;
	${mediaQueries.laptopS} {
		text-align: left;
		max-width: 360px;
	}
	${mediaQueries.laptopL} {
		max-width: 480px;
	}
`;

const MintAgainButton = styled(Button)`
	width: 251px;
	margin-bottom: 48px;
`;

const ImagesWrapper = styled.div`
	position: relative;
	height: 1000px;
`;

const ImageWrapper = styled.div`
	position: absolute;
	right: 0;
	width: 100%;
	& > img {
		object-fit: contain;
		height: unset !important;
	}
	${mediaQueries.tablet} {
		width: 400px;
		height: 400px;
	}
`;

const Image1 = styled(ImageWrapper)`
	z-index: 2;
	${mediaQueries.tablet} {
		display: none;
	}
	${mediaQueries.laptopS} {
		display: block;
	}
`;

const Image2 = styled(ImageWrapper)`
	z-index: 1;
	position: absolute;
	right: 92px;
	top: 200px;
	opacity: 0.6;
	display: none;
	${mediaQueries.tablet} {
		display: block;
		right: -100px;
		top: 370px;
	}
	${mediaQueries.laptopS} {
		right: 92px;
		top: 200px;
	}
`;
