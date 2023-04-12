import { Button } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { getAddress, isAddress } from 'ethers/lib/utils';
import { FC, useState } from 'react';
import { IProject, IWalletAddress } from '@/apollo/types/types';
import Input from '../../Input';
import { requiredOptions } from '@/lib/constants/regex';
import { client } from '@/apollo/apolloClient';
import { ADD_RECIPIENT_ADDRESS_TO_PROJECT } from '@/apollo/gql/gqlProjects';
import InlineToast, { EToastType } from '../../toasts/InlineToast';
import { networksParams } from '@/helpers/blockchain';

interface IAddNewAddress {
	project: IProject;
	selectedWallet: IWalletAddress;
}

interface IAddressForm {
	address: string;
}

export const AddNewAddress: FC<IAddNewAddress> = ({
	project,
	selectedWallet,
}) => {
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<IAddressForm>({ mode: 'onSubmit', reValidateMode: 'onSubmit' });

	const handleAdd = async (formData: IAddressForm) => {
		setLoading(true);
		const { address } = formData;
		try {
			const _address = getAddress(address);
			const { data } = await client.mutate({
				mutation: ADD_RECIPIENT_ADDRESS_TO_PROJECT,
				variables: {
					projectId: Number(project.id),
					networkId: selectedWallet.networkId,
					address: _address,
				},
			});
		} catch (error: any) {
			if (error.message) {
				setError(
					'address',
					{ type: 'focus', message: error.message },
					{ shouldFocus: true },
				);
			}
		}

		setLoading(false);
	};

	const validateAddress = async (address: string) => {
		setLoading(true);
		if (!isAddress(address)) {
			setLoading(false);
			return 'Invalid address';
		}
		return true;
	};

	const chainName = selectedWallet.networkId
		? networksParams[selectedWallet.networkId].chainName
		: 'Unknown';

	return (
		<>
			<form onSubmit={handleSubmit(handleAdd)}>
				<StyledInput
					register={register}
					registerName='address'
					label={`Receiving address on 
						${chainName}`}
					registerOptions={{
						...requiredOptions.walletAddress,
						validate: validateAddress,
					}}
					caption={`You can enter a new address to receive funds on ${chainName} network.`}
				/>
				{errors.address && (
					<StyledInlineToast
						type={EToastType.Error}
						message={errors.address?.message as string}
					/>
				)}
				<StyledButton
					size='small'
					label='SAVE ADDRESS'
					buttonType='secondary'
					type='submit'
					loading={loading}
				/>
			</form>
		</>
	);
};

const StyledInlineToast = styled(InlineToast)``;

const StyledInput = styled(Input)`
	margin-top: 24px;
`;

const StyledButton = styled(Button)`
	margin-top: 24px;
	margin-left: auto;
`;
