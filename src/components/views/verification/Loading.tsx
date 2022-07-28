import styled from 'styled-components';
import LottieControl from '@/components/animations/lottieControl';
import { FlexCenter } from '@/components/styled-components/Flex';
import LoadingAnimation from '@/animations/loading_giv.json';

export default function LoadingVerification() {
	return (
		<Container>
			<LottieControl animationData={LoadingAnimation} size={150} />
		</Container>
	);
}

const Container = styled(FlexCenter)``;
