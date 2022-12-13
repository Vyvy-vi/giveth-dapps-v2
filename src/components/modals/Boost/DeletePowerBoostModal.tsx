import React, { FC } from 'react';
import {
	Button,
	ButtonLink,
	IconRocketInSpace32,
	Lead,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch } from '@/features/hooks';
import Routes from '@/lib/constants/Routes';

interface IDeletePowerBoostModal extends IModal {
	boostId: string;
	deleteBoost: (id: string) => Promise<boolean>;
	canDelete: boolean;
}

export const DeletePowerBoostModal: FC<IDeletePowerBoostModal> = ({
	setShowModal,
	boostId,
	deleteBoost,
	canDelete,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const onDelete = async () => {
		deleteBoost(boostId);
		closeModal();
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition={'left'}
			headerTitle={canDelete ? 'Are you sure?' : 'Oops!'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<ConfirmPowerBoostModalContainer>
				{canDelete ? (
					<Content>
						If you remove GIVpower from this project, it will be
						distributed proportionally to the other projects you
						have boosted.
					</Content>
				) : (
					<Content>
						You can&apos;t remove your GIVpower from this project
						because it is the only boost you have. Please boost
						another project with GIVpower before continuing.
					</Content>
				)}
				{canDelete ? (
					<>
						<CustomButton label='cancel' onClick={closeModal} />
						<CustomButton
							buttonType='texty-primary'
							label='Remove GIVpower'
							onClick={onDelete}
						/>
					</>
				) : (
					<>
						<CustomButton
							label='view projects'
							onClick={() => router.push(Routes.Projects)}
						/>
						<CustomButton
							buttonType='texty-primary'
							label='Dismiss'
							onClick={closeModal}
						/>
					</>
				)}
			</ConfirmPowerBoostModalContainer>
		</Modal>
	);
};

export const ConfirmPowerBoostModalContainer = styled.div`
	width: 100%;
	${mediaQueries.tablet} {
		width: 450px;
	}
	padding: 24px;
`;

export const Content = styled(Lead)`
	margin-bottom: 48px;
`;

export const CustomButtonLink = styled(ButtonLink)`
	width: 300px;
	display: block;
	margin: 8px auto;
`;

export const GetButton = styled(CustomButtonLink)`
	margin: 42px auto 12px;
`;

export const CustomButton = styled(Button)`
	width: 300px;
	margin: 8px auto;
`;
