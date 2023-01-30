import {
	B,
	brandColors,
	Button,
	GLink,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '../styled-components/Flex';

const MAX_NFT_QTY = 5;
const MIN_NFT_QTY = 1;

export const MintCard = () => {
	const [qtyNFT, setQtyNFT] = useState('1');
	const mintedNFT = 20;
	function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
		//handle empty input
		if (event.target.value === '') setQtyNFT('');

		//handle number
		const _qty = Number.parseInt(event.target.value);

		//handle range
		if (_qty > MAX_NFT_QTY || _qty < MIN_NFT_QTY) return;

		if (Number.isInteger(_qty)) setQtyNFT('' + _qty);
	}

	return (
		<MintCardContainer>
			<InputWrapper gap='16px' flexDirection='column'>
				<Flex justifyContent='space-between'>
					<GLink size='Small'>NFT Amount</GLink>
					<MaxLink
						size='Small'
						onClick={() => setQtyNFT('' + MAX_NFT_QTY)}
					>
						MAX
					</MaxLink>
				</Flex>
				<StyledInput
					as='input'
					type='number'
					value={qtyNFT}
					onChange={onChangeHandler}
				/>
				<InputHint>{mintedNFT}/1000 Minted</InputHint>
			</InputWrapper>
			<InfoBox gap='16px' flexDirection='column'>
				<Flex justifyContent='space-between'>
					<InfoBoxTitle>Max Mint </InfoBoxTitle>
					<InfoBoxValue>5</InfoBoxValue>
				</Flex>
				<Flex justifyContent='space-between'>
					<InfoBoxTitle>Mint Prince per</InfoBoxTitle>
					<InfoBoxValue>100</InfoBoxValue>
				</Flex>
			</InfoBox>
			<MintButton size='small' label='Mint' buttonType='primary' />
		</MintCardContainer>
	);
};

const MintCardContainer = styled.div`
	padding: 24px;
	background-color: ${brandColors.giv[800]};
	border-radius: 8px;
	max-width: 458px;
`;

const InputWrapper = styled(Flex)`
	margin-bottom: 24px;
`;

const StyledInput = styled(P)`
	padding: 15px 16px;
	width: 100%;
	color: ${brandColors.giv[200]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid ${brandColors.giv[500]};
	border-radius: 8px;
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	-moz-appearance: textfield;
`;

const MaxLink = styled(GLink)`
	color: ${semanticColors.blueSky[500]};
	cursor: pointer;
`;

const InputHint = styled(GLink)`
	color: ${brandColors.deep[100]};
`;

const InfoBox = styled(Flex)`
	margin-bottom: 32px;
`;

const InfoBoxTitle = styled(B)`
	color: ${brandColors.giv[300]};
`;

const InfoBoxValue = styled(B)`
	color: ${brandColors.giv['000']};
`;

const MintButton = styled(Button)`
	margin: auto;
	width: 100%;
	max-width: 332px;
`;
