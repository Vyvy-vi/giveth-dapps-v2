import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { useEvent } from './useEvent';

export const useModalCallback = (callback: () => void) => {
	const dispatch = useAppDispatch();
	const cbRef = useEvent(callback);
	const showSignWithWallet = useAppSelector(
		state => state.modal.showSignWithWallet,
	);
	const signInThenDoSomething = () => {
		if (typeof window === 'undefined') return;
		window.addEventListener('signin', cbRef, {
			once: true,
		});
		dispatch(setShowSignWithWallet(true));
	};

	useEffect(() => {
		if (showSignWithWallet === false) {
			window.removeEventListener('signin', cbRef);
		}
	}, [showSignWithWallet]);
	return { signInThenDoSomething };
};
