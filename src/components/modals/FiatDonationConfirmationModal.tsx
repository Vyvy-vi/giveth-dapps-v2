import { FC } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Button, P } from '@giveth/ui-design-system';
import Image from 'next/image';

import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { Bullets } from '@/components/styled-components/Bullets';
import BulbIcon from '/public/images/icons/lightbulb.svg';
import { useModalAnimation } from '@/hooks/useModalAnimation';

export const FiatDonationConfirmationModal: FC<IModal> = ({
	setShowModal,
	continueProcess,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<Image src={BulbIcon} alt='light bulb' />}
			headerTitle={formatMessage({ id: 'Before you continue' })}
			headerTitlePosition='left'
		>
			<Container>
				<Bullets>
					<li>
						Note that your donations history will be updated some
						time after successful transaction.
					</li>
					<li>
						Donations will only be confirmed after a while they have
						been sent, time depends on the chosen onramp
					</li>
				</Bullets>
				<Buttons>
					<OkButton
						label='Cancel'
						onClick={closeModal}
						buttonType='texty'
					/>
					<OkButton
						label='Continue'
						onClick={continueProcess}
						buttonType='secondary'
					/>
				</Buttons>
			</Container>
		</Modal>
	);
};

const Container = styled(P)`
	width: 350px;
	text-align: left;
	padding: 0 30px 30px;
`;

const OkButton = styled(Button)`
	width: 300px;
	height: 48px;
	margin: 48px auto 0;
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: row;
`;
