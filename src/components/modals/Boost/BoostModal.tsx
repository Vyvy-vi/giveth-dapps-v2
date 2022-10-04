import { IconRocketInSpace32 } from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';

import { useModalAnimation } from '@/hooks/useModalAnimation';
import 'rc-slider/assets/index.css';
import { ZeroGivpowerModal } from './ZeroGivpowerModal';
import { BoostModalContainer } from './BoostModal.sc';
import BoostedInnerModal from './BoostedInnerModal';
import BoostInnerModal from './BoostInnerModal';
import { BN } from '@/helpers/number';
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';

interface IBoostModalProps extends IModal {
	projectId: string;
}

export enum EBoostModalState {
	BOOSTING,
	BOOSTED,
	LIMIT_EXCEEDED,
}

const BoostModal: FC<IBoostModalProps> = ({ setShowModal, projectId }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [percentage, setPercentage] = useState(0);
	const [state, setState] = useState(EBoostModalState.BOOSTING);
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.xDaiValues),
	);
	const givPower = sdh.getUserGIVPowerBalance();

	if (givPower.balance == '0') {
		return <ZeroGivpowerModal setShowModal={setShowModal} />;
	}

	const title = () => {
		switch (state) {
			case EBoostModalState.BOOSTING:
				return 'Boost';
			case EBoostModalState.LIMIT_EXCEEDED:
				return 'Oh no!';
			case EBoostModalState.BOOSTED:
				return 'Well done!';
			default:
				return 'Boost';
		}
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition={'left'}
			headerTitle={title()}
			headerIcon={<IconRocketInSpace32 />}
		>
			<BoostModalContainer state={state}>
				{state === EBoostModalState.BOOSTING ||
				state === EBoostModalState.LIMIT_EXCEEDED ? (
					<BoostInnerModal
						totalGIVpower={BN(givPower.balance)}
						setPercentage={setPercentage}
						state={state}
						setState={setState}
						// TODO: Create Project context
						projectId={projectId}
						setShowModal={setShowModal}
					/>
				) : (
					<BoostedInnerModal
						percentage={percentage}
						closeModal={closeModal}
					/>
				)}
			</BoostModalContainer>
		</Modal>
	);
};

export default BoostModal;
