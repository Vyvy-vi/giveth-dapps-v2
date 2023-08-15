import { FC } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Button, P } from '@giveth/ui-design-system';
import Image from 'next/image';

import { Modal } from '@/components/modals/Modal';
import { IFiatConfirmationModal } from '@/types/common';
import { Bullets } from '@/components/styled-components/Bullets';
import BulbIcon from '/public/images/icons/lightbulb.svg';
import { useModalAnimation } from '@/hooks/useModalAnimation';

export const FiatDonationConfirmationModal: FC<IFiatConfirmationModal> = ({
	setShowModal,
	continueProcess,
	type,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<Image src={BulbIcon} alt='light bulb' />}
			headerTitle={formatMessage({ id: 'label.before_you_start' })}
			headerTitlePosition='left'
		>
			<Container>
				<Bullets>
					{type === 'onramper' ? (
						<>
							<li>
								{formatMessage({
									id: 'label.',
								})}
							</li>
							<li>
								{formatMessage({
									id: 'label.',
								})}
							</li>
							<li>
								{formatMessage({
									id: 'label.',
								})}
							</li>
						</>
					) : (
						type === 'donorbox' && (
							<>
								<li>
									{formatMessage({
										id: 'label.this_is_a_way_to_support_giveth_using_our',
									})}{' '}
									<a
										href='https://www.sdgimpactfund.org/giveth-foundation'
										target='_blank'
										rel='noreferrer'
									>
										{formatMessage({
											id: 'label.sdg_impact_fund',
										})}
									</a>
								</li>
								<li>
									{formatMessage({
										id: 'label.youll_get_a_confirmation_from_donorbox_on_your_email',
									})}
								</li>
							</>
						)
					)}
				</Bullets>
				<Buttons>
					<OkButton
						label={formatMessage({ id: 'label.cancel' })}
						onClick={closeModal}
						buttonType='texty'
					/>
					<OkButton
						label={formatMessage({ id: 'label.continue' })}
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
