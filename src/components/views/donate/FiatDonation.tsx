import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import InputStyled from '@/components/styled-components/Input';
import { InputSize } from '@/components/Input';
import { Button, B, neutralColors } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { FiatDonationConfirmationModal } from '@/components/modals/FiatDonationConfirmationModal';
import {
	setShowWalletModal,
	setShowSignWithWallet,
} from '@/features/modal/modal.slice';
import { useDonateData } from '@/context/donate.context';
import config from '@/configuration';

const FiatDonation = () => {
	const { formatMessage } = useIntl();
	const { project } = useDonateData();
	const { account } = useWeb3React();
	const dispatch = useAppDispatch();
	const [onramperConfirmationModal, setOnramperConfirmationModal] =
		useState(false);
	const [donorboxConfirmationModal, setDonorboxConfirmationModal] =
		useState(false);
	const { id } = project;
	const { userData, isSignedIn, isEnabled } = useAppSelector(
		state => state.user,
	);
	const givethProjectId = '1';
	const [temporaryEmail, setTemporaryEmail] = useState('');
	const [emailReady, setEmailReady] = useState(false);
	const [openOnramper, setOpenOnramper] = useState(false);
	const [openDonorBox, setOpenDonorBox] = useState(false);
	const mainnetAddress = project.addresses?.find(
		i => i.networkId === config.PRIMARY_NETWORK.id,
	)?.address;
	const partnerContext = {
		userId: userData?.id,
		userWallet: userData?.walletAddress,
		projectWallet: mainnetAddress,
		projectId: id,
		email: userData?.email || temporaryEmail,
	};
	const wallets = {
		ETH: { address: mainnetAddress },
	};

	const rampNetwork = new RampInstantSDK({
		hostAppName: 'giveth',
		hostLogoUrl: 'https://rampnetwork.github.io/assets/misc/test-logo.png',
		hostApiKey: 've2mesm3jbhjjoqs8t57v3qzdnveza662sugh88e',
		url: 'https://ri-widget-staging.firebaseapp.com/',
	});
	return (
		<>
			<FiatContainer>
				{emailReady || isSignedIn ? (
					openOnramper && mainnetAddress ? (
						<div
							style={{
								width: '440px',
								height: '595px',
								boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.1)',
								borderRadius: '10px',
								margin: '20px auto',
							}}
						>
							<iframe
								src={`https://widget.onramper.com?color=266677&apiKey=${
									process.env.NEXT_PUBLIC_ONRAMPER_API_KEY
								}&supportSwap=false&supportSell=false&onlyCryptos=ETH,USDC,DAI_ERC20&defaultFiat=USD&defaultCrypto=USDC&wallets=ETH:${mainnetAddress},USDC:${mainnetAddress},DAI_ERC20:${mainnetAddress}&partnerContext=${JSON.stringify(
									partnerContext,
								)}`}
								height='660px'
								width='100%'
								title='Onramper widget'
								allow='accelerometer;
  autoplay; camera; gyroscope; payment'
								style={{
									boxShadow:
										'1px 1px 1px 1px rgba(0,0,0,0.2)',
									margin: '0 0 20px 0',
								}}
							/>
						</div>
					) : openDonorBox ? (
						<>
							<script src='https://donorbox.org/widget.js'></script>
							<iframe
								src='https://donorbox.org/embed/giveth'
								name='donorbox'
								scrolling='no'
								height='520px'
								width='100%'
								style={{
									maxWidth: '500px',
									minWidth: '250px',
									maxHeight: 'none !important',
								}}
							></iframe>
						</>
					) : (
						<Buttons>
							{onramperConfirmationModal && (
								<FiatDonationConfirmationModal
									setShowModal={setOnramperConfirmationModal}
									continueProcess={() =>
										setOpenOnramper(true)
									}
									type='onramper'
								/>
							)}
							{donorboxConfirmationModal && (
								<FiatDonationConfirmationModal
									setShowModal={setDonorboxConfirmationModal}
									continueProcess={() =>
										setOpenDonorBox(true)
									}
									type='donorbox'
								/>
							)}
							<ImageContainer>
								<Image
									src='/images/powered_by_onramper.png'
									width='220'
									height='60'
									alt={'Powered by OnRamper'}
								/>
							</ImageContainer>
							<Info>
								Buy crypto with your credit without leaving the
								platform. Donate the purchase to this project
								directly with your credit card with Onramper
							</Info>
							<Button
								label='CONTINUE WITH ONRAMPER'
								onClick={() => {
									setOnramperConfirmationModal(true);
								}}
							/>
							{id === givethProjectId && (
								<DonorBoxContainer>
									<ImageContainer>
										<Image
											src='/images/powered_by_donorbox.png'
											width='220'
											height='60'
											alt={'Powered by Donorbox'}
										/>
									</ImageContainer>
									<Info>
										Easily connect a PayPal or Stripe
										account to this form and donate directly
										from your account with Donorbox
									</Info>
									<Button
										label='CONTINUE WITH DONORBOX'
										onClick={() =>
											setDonorboxConfirmationModal(true)
										}
										// disabled
									/>
								</DonorBoxContainer>
							)}
						</Buttons>
					)
				) : (
					<FirstContainer>
						<InputStyled
							inputSize={InputSize.LARGE}
							hasLeftIcon={false}
							value={temporaryEmail}
							placeholder='Proceed with an email'
							onChange={e => setTemporaryEmail(e.target.value)}
						/>
						<StyledButton
							label={'Donate with email'}
							buttonType='secondary'
							size='medium'
							disabled={!temporaryEmail}
							onClick={() => {
								setEmailReady(true);
							}}
						/>
						{formatMessage({ id: 'label.or' })}
						{!isSignedIn && (
							<StyledButton
								label={formatMessage({
									id: 'label.sign_wallet',
								})}
								buttonType='secondary'
								size='medium'
								onClick={() => {
									dispatch(setShowSignWithWallet(true));
								}}
							/>
						)}
					</FirstContainer>
				)}
			</FiatContainer>
			{/* <a onClick={() => rampNetwork.show()}>ramp-network</a> */}
		</>
	);
};

const FiatContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	align-items: center;
`;
const FirstContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px 0;
	width: 100%;
`;
const ImageContainer = styled.div`
	width: 100%;
	text-align: center;
	margin-top: 23px;
	img {
		object-fit: cover;
	}
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 18px;
	margin: 40px 0;
	button {
		margin: 16px 0 0 0;
	}
`;

const Info = styled(B)`
	font-weight: 400;
	font-size: 16px;
	line-height: 150%;
	color: ${neutralColors.gray[800]};
`;

const DonorBoxContainer = styled(Buttons)`
	border-top: 1px solid ${neutralColors.gray[400]};
`;

const StyledButton = styled(Button)`
	width: 100%;
	margin: 20px 0;
`;

export default FiatDonation;
