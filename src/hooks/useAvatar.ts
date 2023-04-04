import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { captureException } from '@sentry/nextjs';
import { useWeb3React } from '@web3-react/core';
import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import { gToast, ToastType } from '@/components/toasts';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import { useAppDispatch } from '@/features/hooks';

enum EProfilePicTab {
	LOADING,
	UPLOAD,
	PFP,
}
export const useAvatar = () => {
	const [updateUser] = useMutation(UPDATE_USER);
	const [activeTab, setActiveTab] = useState(EProfilePicTab.LOADING);
	const dispatch = useAppDispatch();
	const { account } = useWeb3React();

	const handleAvatar = (nftUrl?: string, url?: string) => {
		if (activeTab === 1) {
			return url;
		} else {
			return nftUrl;
		}
	};
	const onSaveAvatar = async (
		onDelete: () => void,
		nftUrl?: string,
		url?: string,
	) => {
		try {
			const { data: response } = await updateUser({
				variables: {
					avatar: handleAvatar(nftUrl, url),
				},
			});
			console.log('Response', response);
			if (response.updateUser) {
				account && dispatch(fetchUserByAddress(account));
				gToast('Profile Photo updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
				onDelete();
			} else {
				throw 'updateUser false';
			}
		} catch (error: any) {
			gToast('Failed to update your information. Please try again.', {
				type: ToastType.DANGER,
				title: error.message,
			});
			captureException(error, {
				tags: {
					section: 'onSaveAvatar',
				},
			});
		}
	};
	return { onSaveAvatar, activeTab, setActiveTab };
};
