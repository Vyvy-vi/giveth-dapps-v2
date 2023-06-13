import { P, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import { mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch } from '@/features/hooks';
import { setShowWalletModal } from '@/features/modal/modal.slice';
import { networksParams } from '@/helpers/blockchain';
import { jointItems } from '@/helpers/text';

export interface IWrongNetworkInnerModal {
	cardName: string;
	targetNetworks: number[];
}

export const WrongNetworkInnerModal: FC<IWrongNetworkInnerModal> = ({
	cardName,
	targetNetworks,
}) => {
	const { account } = useWeb3React();
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();

	const connectWallet = () => {
		dispatch(setShowWalletModal(true));
	};

	const chainNames = targetNetworks.map(
		network => networksParams[network].chainName,
	);

	const chainsStr = jointItems(chainNames);

	return (
		<WrongNetworkInnerModalContainer>
			{account ? (
				<>
					<Description>
						<P>
							{formatMessage(
								{
									id: 'component.reward_card.wrong_network',
								},
								{
									name: cardName,
									chains: chainsStr,
								},
							)}
						</P>
					</Description>
					<ButtonsContainer>
						<Button
							label={formatMessage({
								id: 'label.switch_network',
							})}
							buttonType='primary'
						/>
					</ButtonsContainer>
				</>
			) : (
				<>
					<Description>
						<P>
							{formatMessage(
								{
									id: 'component.reward_card.connect_wallet',
								},
								{
									name: cardName,
									chains: chainsStr,
								},
							)}
						</P>
					</Description>
					<ButtonsContainer>
						<Button
							label={formatMessage({
								id: 'component.button.connect_wallet',
							})}
							onClick={connectWallet}
							buttonType='primary'
						/>
					</ButtonsContainer>
				</>
			)}
		</WrongNetworkInnerModalContainer>
	);
};

const WrongNetworkInnerModalContainer = styled.div`
	padding: 6px 24px;
	width: 100%;
	${mediaQueries.tablet} {
		max-width: 450px;
	}
`;

const Description = styled.div`
	padding: 12px;
	margin-bottom: 12px;
	text-align: center;
	color: ${brandColors.deep[100]};
`;

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;
