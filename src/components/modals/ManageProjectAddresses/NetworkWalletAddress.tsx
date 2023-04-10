import { FC } from 'react';
import styled from 'styled-components';
import { Button, Caption, IconChevronRight16 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { IWalletAddress } from '@/apollo/types/types';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { Badge, EBadgeStatus } from '@/components/Badge';
import NetworkLogo from '@/components/NetworkLogo';
import { networksParams } from '@/helpers/blockchain';

interface INetworkWalletAddress {
	networkWallet: IWalletAddress;
}
export const NetworkWalletAddress: FC<INetworkWalletAddress> = ({
	networkWallet,
}) => {
	const { formatMessage } = useIntl();

	return (
		<Wrapper flexDirection='column'>
			<StyledBadge label='wow' status={EBadgeStatus.SUCCESS} />
			<Flex justifyContent='space-between'>
				<FlexCenter gap='8px'>
					<NetworkLogo
						chainId={networkWallet.networkId}
						logoSize={24}
					/>
					{networkWallet.networkId && (
						<Caption>
							{networksParams[networkWallet.networkId].chainName}
						</Caption>
					)}
				</FlexCenter>
				{!networkWallet.address && (
					<Button
						size='small'
						label={formatMessage({ id: 'label.add_address' })}
						buttonType='texty-secondary'
						icon={
							<div>
								<IconChevronRight16 />
							</div>
						}
					/>
				)}
			</Flex>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	margin: 24px 0;
	gap: 8px;
`;

const StyledBadge = styled(Badge)`
	width: fit-content;
`;
