import { Button, H6, Lead, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import RadioButton from '../../RadioButton';
import Input from '@/components/Input';
import { Label } from '../create/Create.sc';
import { TextArea } from '@/components/styled-components/TextArea';
import selectCustomStyles from '@/lib/constants/selectCustomStyles';
import { BtnContainer, ContentSeparator } from './VerificationIndex';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_ALLOWED_COUNTRIES,
	UPDATE_PROJECT_VERIFICATION,
} from '@/apollo/gql/gqlVerification';
import { EVerificationSteps } from '@/apollo/types/types';
import { mediaQueries } from '@/lib/constants/constants';
import { validators } from '@/lib/constants/regex';

enum ProjectRegistryStates {
	NOTSELECTED = 'notselected',
	YES = 'yes',
	NO = 'no',
}

interface IOption {
	value: string;
	label: string;
}

function isObjEmpty(obj: Object) {
	return Object.keys(obj).length > 0;
}

interface IRegisteryForm {
	link: string;
}

export default function ProjectRegistry() {
	const { verificationData, setVerificationData, setStep } =
		useVerificationData();
	const { projectRegistry } = verificationData || {};
	const [countries, setCountries] = useState<IOption[]>([]);
	const [isNonProfit, setIsNonProfit] = useState<ProjectRegistryStates>(
		projectRegistry
			? projectRegistry.isNonProfitOrganization
				? ProjectRegistryStates.YES
				: ProjectRegistryStates.NO
			: ProjectRegistryStates.NOTSELECTED,
	);
	const [description, setDescription] = useState(
		projectRegistry?.organizationDescription || '',
	);
	const [country, setCountry] = useState<IOption>();
	const [loading, setloading] = useState(false);
	const [isChanged, setIsChanged] = useState(false);
	const { register, handleSubmit, formState, getValues, setValue } =
		useForm<IRegisteryForm>();
	console.log('formState', formState.dirtyFields);
	console.log('formStateErr', formState.errors);
	const handleNext = () => {
		async function sendReq() {
			setloading(true);
			const { data } = await client.mutate({
				mutation: UPDATE_PROJECT_VERIFICATION,
				variables: {
					projectVerificationUpdateInput: {
						projectVerificationId: Number(verificationData?.id),
						step: EVerificationSteps.PROJECT_REGISTRY,
						projectRegistry: {
							isNonProfitOrganization:
								isNonProfit === ProjectRegistryStates.YES,
							organizationCountry: country?.value,
							organizationWebsite: getValues('link'),
							organizationDescription: description,
						},
					},
				},
			});
			setVerificationData(data.updateProjectVerificationForm);
			setloading(false);
			setStep(4);
		}

		if (isObjEmpty(formState.dirtyFields)) {
			sendReq();
		} else {
			setStep(4);
		}
	};

	useEffect(() => {
		async function fetchCountries() {
			const { data } = await client.query({
				query: FETCH_ALLOWED_COUNTRIES,
			});
			const _countries = data.getAllowedCountries.map(
				(_country: any) => ({
					label: _country.name,
					value: _country.name,
				}),
			);
			setCountries(_countries);
			const selectedContry = data.getAllowedCountries.find(
				(_country: any) =>
					_country.name === projectRegistry?.organizationCountry,
			);
			if (selectedContry) {
				setCountry({
					label: selectedContry.name,
					value: selectedContry.name,
				});
			}
		}
		fetchCountries();
	}, []);

	return (
		<>
			<form onSubmit={handleSubmit(handleNext)}>
				<div>
					<H6 weight={700}>Project registry</H6>
					<RadioSectionContainer>
						<RadioSectionTitle>
							Is your project part of a registered non-profit
							organization?
						</RadioSectionTitle>
						<RadioSectionSubTitle>
							Having obtained non-profit status is not a
							requirement but it is helpful for the verification
							process
						</RadioSectionSubTitle>
						<br />
						<RadioContainer>
							<RadioButton
								title='Yes'
								toggleRadio={() => {
									setIsChanged(true);
									setIsNonProfit(ProjectRegistryStates.YES);
								}}
								isSelected={
									isNonProfit === ProjectRegistryStates.YES
								}
							/>
							<RadioButton
								title='No'
								toggleRadio={() => {
									setIsChanged(true);
									setIsNonProfit(ProjectRegistryStates.NO);
								}}
								isSelected={
									isNonProfit === ProjectRegistryStates.NO
								}
							/>
						</RadioContainer>
					</RadioSectionContainer>
					<br />
					{isNonProfit === ProjectRegistryStates.YES && (
						<>
							<Lead>In which country are you registered?</Lead>
							<br />
							<Select
								options={countries}
								styles={selectCustomStyles}
								value={country}
								onChange={(option: any) => {
									setIsChanged(true);
									setCountry(option);
								}}
							/>
							<br />
							<Lead>
								Please provide a link to your country's
								government registry where the team can look up
								and confirm your status.
							</Lead>
							<br />
							<LinkInputContainer>
								<Label>Please enter full link</Label>
								<Input
									registerName='link'
									register={register}
									registerOptions={validators.url}
									placeholder='https://'
									error={formState.errors.link}
									defaultValue={
										projectRegistry?.organizationWebsite ||
										''
									}
								/>
							</LinkInputContainer>
						</>
					)}

					{isNonProfit === ProjectRegistryStates.NO && (
						<>
							<Lead>
								Okay, it sounds like your project is not a
								registered non-profit. Please tell us a bit
								about how your organization is structured.
							</Lead>
							<br />
							<TextArea
								value={description}
								name='link'
								placeholder='eg. "We are a decentralized autonomous organization that works toward the development of web3
						applications"'
								onChange={e => {
									setIsChanged(true);
									setDescription(e.target.value);
								}}
							/>
						</>
					)}
				</div>
				<div>
					<ContentSeparator />
					<BtnContainer>
						<Button
							onClick={() => setStep(2)}
							label='<     PREVIOUS'
						/>
						<Button
							loading={loading}
							label='NEXT     >'
							type='submit'
						/>
					</BtnContainer>
				</div>
			</form>
		</>
	);
}

const RadioSectionContainer = styled.div`
	margin-top: 29px;
	width: 100%;
	background-color: ${neutralColors.gray[200]};
	border-radius: 16px;
	padding: 16px 24px;
`;
const RadioSectionTitle = styled(Lead)`
	color: ${neutralColors.gray[900]};
	margin-bottom: 8px;
`;

const RadioSectionSubTitle = styled(P)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 8px;
`;

const RadioContainer = styled.div`
	display: flex;
	gap: 100px;
	${mediaQueries.mobileL} {
		gap: 160px;
	}
`;

const LinkInputContainer = styled.div`
	max-width: 520px;
`;
