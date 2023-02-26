import styled from 'styled-components';
import {
	H3,
	IconExternalLink24,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import SwagImg from '/public/images/swag.png';
import Image from 'next/image';
import { GhostButton } from '@/components/styled-components/Button';
import { Col, Row } from '@/components/Grid';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const GivethSwag = () => {
	return (
		<Wrapper>
			<Col xs={12} md={6}>
				<Text>
					<H3 weight={700}>Giveth Swag</H3>
					<Desc size='large'>
						Want to get your hands on the latest Giveth swag? Swing
						by our booth, and we’ll let you know how to take part in
						our Impact Quests to claim cool prizes. Or if you
						prefer, order yours now from our new and improved swag
						shop.
					</Desc>
					<ExternalLink href={links.SWAG}>
						<GhostButton
							label='Go to Swag shop'
							size='large'
							icon={<IconExternalLink24 />}
						/>
					</ExternalLink>
				</Text>
			</Col>
			<Col xs={12} md={6}>
				<Img src={SwagImg} alt='Swag Image' />
			</Col>
		</Wrapper>
	);
};

const Img = styled(Image)`
	max-width: 100%;
`;

const Text = styled.div`
	/* max-width: 557px; */
`;

const Desc = styled(Lead)`
	margin: 47px 0 31px;
`;

const Wrapper = styled(Row)`
	color: ${neutralColors.gray[900]};
	border-radius: 16px;
	background: ${neutralColors.gray[200]};
	padding: 40px;
`;

export default GivethSwag;
