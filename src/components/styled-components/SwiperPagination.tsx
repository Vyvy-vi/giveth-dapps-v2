import { H5 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FlexCenter } from './Flex';
import { Shadow } from './Shadow';

export const PaginationWrapper = styled(H5)`
	display: flex;
	align-items: center;
`;

export const NavigationWrapper = styled.div<{ disabled?: boolean }>`
	cursor: pointer;
	border-radius: 48px;
	box-shadow: ${Shadow.Giv[400]};
	padding: 8px 13px;
	&.swiper-button-disabled {
		opacity: 0.4;
		cursor: default;
	}
`;

export const SwiperPaginationWrapper = styled(FlexCenter)`
	padding: 16px;
`;
