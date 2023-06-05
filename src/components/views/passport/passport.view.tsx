import {
	ButtonText,
	Container,
	H2,
	IconExternalLink16,
	IconPassport16,
	Lead,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import ExternalLink from '@/components/ExternalLink';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';

export const PassportView = () => {
	return (
		<Container>
			<Wrapper>
				<Title>Amplify your donation</Title>
				<Lead>
					Unlock matching for your donation by verifying your
					identity! Connect your wallet to Gitcoin Passport to check
					your identity score and maximize your donation power.
					Passport is designed to proactively verify users’ identities
					to protect against Sybil attacks.
				</Lead>
				<PassportLink>
					<ExternalLink href='/' title='Learn more' />
					<IconExternalLink16 />
				</PassportLink>
				<Button>
					<FlexCenter gap='8px'>
						<IconPassport16 />
						<ButtonText>Connect passport</ButtonText>
					</FlexCenter>
				</Button>
			</Wrapper>
		</Container>
	);
};

const Wrapper = styled.div`
	padding: 80px 0;
	text-align: center;
`;

const Title = styled(H2)`
	margin-bottom: 40px;
`;

const PassportLink = styled(FlexCenter)`
	margin-top: 16px;
	margin-bottom: 60px;
	color: ${brandColors.giv[500]};
	gap: 4px;
`;

const Button = styled.button`
	padding: 16px 32px;
	background-color: ${neutralColors.gray[100]};
	border: none;
	border-radius: 48px;
	box-shadow: ${Shadow.Giv[400]};
	transition: color 0.2s ease-in-out;
	cursor: pointer;
	&:hover {
		color: ${neutralColors.gray[800]};
	}
`;
