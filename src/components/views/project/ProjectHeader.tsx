import { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { H3 } from '@giveth/ui-design-system';
import { useProjectContext } from '@/context/project.context';
import { ProjectOwnerWithPfp } from './ProjectOwnerWithPfp';

const ProjectHeader = () => {
	const { projectData } = useProjectContext();
	const { title, image, adminUser } = projectData || {};
	const [adjustTitle, setAdjustTitle] = useState<boolean>(false);
	const containerRef = useRef(null);

	useEffect(() => {
		const observerHandler = (entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;
			setAdjustTitle(!entry.isIntersecting);
		};
		const observer = new IntersectionObserver(observerHandler, {
			root: null,
			rootMargin: '0px',
			threshold: 0.45,
		});

		if (containerRef.current) observer.observe(containerRef.current);

		return () => {
			if (observer) observer.disconnect();
		};
	}, [containerRef, adjustTitle]);

	return (
		<ImageWrapper>
			<ProjectImage src={image || ''} alt='test' loading='lazy' />
			<Title>
				<div>{title}</div>
				<ProjectOwnerWithPfp user={adminUser} />
			</Title>
		</ImageWrapper>
	);
};

const ImageWrapper = styled.div`
	position: relative;
	display: inline-block;
	overflow: hidden;
	width: 100%;
`;

const ProjectImage = styled.img`
	border-radius: 16px;
	width: 100%;
	object-fit: cover; // Ensures the image covers the entire container
	height: 546px;
`;

const Title = styled(H3)`
	position: absolute;
	bottom: 40px;
	left: 40px;
	color: #fff;
	font-weight: bold;
	text-align: left;
	z-index: 1;
	max-width: 90%; // Set max-width to a suitable percentage value based on your preference
	white-space: pre-wrap; // Allows the text to wrap to the next line
	> div:first-child {
		margin-bottom: 4px;
	}
`;

export default ProjectHeader;
