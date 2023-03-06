import {
	brandColors,
	GLink,
	IconInfoFilled16,
	OutlineButton,
	P,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';

interface IArchiveCoverProps {
	isExploited?: boolean;
}

export const ArchiveCover: FC<IArchiveCoverProps> = ({ isExploited }) => {
	const [showModal, setShowModal] = useState<boolean>(true);
	const { formatMessage } = useIntl();

	return showModal ? (
		<Cover>
			<ArchiveModal>
				<ArchiveModalIcon>
					<IconInfoFilled16 color={brandColors.giv['000']} />
				</ArchiveModalIcon>
				<Flex flexDirection='column' justifyContent='space-evenly'>
					<ArchiveModalText weight={700}>
						{formatMessage({
							id: 'label.this_farm_has_ended',
						})}
					</ArchiveModalText>
					<ArchiveModalText>
						{isExploited ? (
							<>
								{formatMessage({
									id: 'label.an_exploit_has_removed_available_rewards',
								})}
								<ArchiveModalLink
									as='a'
									size='Big'
									target='_blank'
									href='https://forum.giveth.io/t/ending-givfarm-liquidity-incentives-programs-for-giv/872'
								>
									&nbsp;
									{formatMessage({
										id: 'label.this_forum_post',
									})}
									&nbsp;
								</ArchiveModalLink>
								{formatMessage({
									id: 'label.for_details',
								})}
							</>
						) : (
							formatMessage({
								id: 'label.harvest_your_rewards_and_remove_your_funds',
							})
						)}
					</ArchiveModalText>
					<CloseButton
						label={formatMessage({
							id: 'label.got_it',
						})}
						onClick={() => setShowModal(false)}
					/>
				</Flex>
			</ArchiveModal>
		</Cover>
	) : null;
};

const Cover = styled(FlexCenter)`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	right: 0;
	left: 0;
	z-index: 10;
	background: ${brandColors.giv[900]}cc;
`;

const ArchiveModal = styled.div`
	display: flex;
	background-color: ${brandColors.giv[400]};
	color: ${brandColors.giv['000']};
	gap: 10px;
	border-radius: 8px;
	width: 291px;
	padding: 16px;
`;

const ArchiveModalText = styled(P)<{ weight?: number }>`
	font-weight: ${props => (props.weight ? props.weight : 400)};
`;

const ArchiveModalLink = styled(GLink)``;

const CloseButton = styled(OutlineButton)`
	border: none;
	font-weight: 700;
	margin-left: auto;
	padding-right: 4px;
	&:hover {
		background-color: transparent;
	}
`;

const ArchiveModalIcon = styled.div`
	width: 16px;
	height: 20px;
	padding-top: 4px;
`;
