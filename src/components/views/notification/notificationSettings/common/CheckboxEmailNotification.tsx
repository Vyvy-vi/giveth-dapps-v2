import styled from 'styled-components';
import { useState } from 'react';
import Checkbox from '@/components/Checkbox';

const CheckboxEmailNotification = () => {
	const [emailNotification, setEmailNotification] = useState(false);
	const [dappNotification, setDappNotification] = useState(false);
	return (
		<Container>
			<Checkbox
				label='Send me email'
				checked={emailNotification}
				onChange={setEmailNotification}
				size={18}
			/>
			<Checkbox
				label='Dapp notification'
				checked={dappNotification}
				onChange={setDappNotification}
				size={18}
			/>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	gap: 16px;
	flex-direction: column;
`;

export default CheckboxEmailNotification;
