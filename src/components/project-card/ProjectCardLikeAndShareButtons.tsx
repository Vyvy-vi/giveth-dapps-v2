import { useEffect, useState } from 'react';
import {
	brandColors,
	IconHeartFilled16,
	IconHeartOutline16,
	IconRocketInSpace,
	IconShare16,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import styled, { css } from 'styled-components';

import { captureException } from '@sentry/nextjs';
import { useRouter } from 'next/router';
import ShareModal from '../modals/ShareModal';
import { likeProject, unlikeProject } from '@/lib/reaction';
import { showToastError } from '@/lib/helpers';
import { Flex } from '../styled-components/Flex';
import { IProject } from '@/apollo/types/types';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import {
	decrementLikedProjectsCount,
	incrementLikedProjectsCount,
} from '@/features/user/user.slice';
import { slugToProjectView } from '@/lib/routeCreators';

interface IProjectCardLikeAndShareButtons {
	project: IProject;
}

const ProjectCardLikeAndShareButtons = (
	props: IProjectCardLikeAndShareButtons,
) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const { project } = props;
	const { slug, id: projectId, verified } = project;
	const [reaction, setReaction] = useState(project.reaction);
	const [totalReactions, setTotalReactions] = useState(
		project.totalReactions,
	);
	const [loading, setLoading] = useState(false);
	const { isSignedIn, userData: user } = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const router = useRouter();

	const likeUnlikeProject = async () => {
		if (!isSignedIn) {
			dispatch(setShowSignWithWallet(true));
			return;
		}

		if (loading) return;

		if (projectId) {
			setLoading(true);

			try {
				if (!reaction) {
					const newReaction = await likeProject(projectId);
					setReaction(newReaction);
					if (newReaction) {
						setTotalReactions((totalReactions || 0) + 1);
						dispatch(incrementLikedProjectsCount());
					}
				} else if (reaction?.userId === user?.id) {
					const successful = await unlikeProject(reaction.id);
					if (successful) {
						setReaction(undefined);
						setTotalReactions((totalReactions || 1) - 1);
						dispatch(decrementLikedProjectsCount());
					}
				}
			} catch (e) {
				showToastError(e);
				captureException(e, {
					tags: {
						section: 'likeUnlikeProject',
					},
				});
			} finally {
				setLoading(false);
			}
		}
	};

	const boostProject = async () => {
		if (!isSignedIn) {
			dispatch(setShowSignWithWallet(true));
			return;
		}

		if (loading) return;

		if (projectId) router.push(`${slugToProjectView(slug)}?open=boost`);
	};

	useEffect(() => {
		setReaction(project.reaction);
	}, [project.reaction]);

	useEffect(() => {
		setTotalReactions(project.totalReactions);
	}, [project.totalReactions]);

	return (
		<>
			{showModal && (
				<ShareModal setShowModal={setShowModal} projectHref={slug} />
			)}
			<BadgeWrapper>
				<Flex gap='6px'>
					{verified && (
						<BadgeButton onClick={boostProject}>
							<IconRocketInSpace />
						</BadgeButton>
					)}
					<BadgeButton loading={loading} onClick={likeUnlikeProject}>
						{Number(totalReactions) > 0 && (
							<Subline>{totalReactions}</Subline>
						)}
						{reaction?.userId && reaction?.userId === user?.id ? (
							<IconHeartFilled16 color={brandColors.pinky[500]} />
						) : (
							<IconHeartOutline16 />
						)}
					</BadgeButton>
					<BadgeButton
						onClick={e => {
							setShowModal(true);
						}}
					>
						<IconShare16 />
					</BadgeButton>
				</Flex>
			</BadgeWrapper>
		</>
	);
};

interface IBadgeButton {
	loading?: boolean;
}

const BadgeButton = styled(Flex)<IBadgeButton>`
	gap: 3px;
	padding: 6px 7px;
	z-index: 2;
	align-items: center;
	border-radius: 16px;
	cursor: pointer;
	transition: color 0.3s ease;
	color: ${neutralColors.gray[600]};
	box-shadow: 0 3px 20px ${brandColors.giv[400]}21;
	&:hover {
		color: ${neutralColors.gray[900]};
	}
	pointer-events: auto;
	position: relative;
	overflow: hidden;

	&::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		border-radius: 16px;
		z-index: -1;
		background-color: #ffffff;
	}
	${props =>
		props.loading
			? css`
					&::before {
						content: '';
						position: absolute;
						top: -10px;
						bottom: -10px;
						left: -10px;
						right: -10px;
						z-index: -2;
						animation: rotate linear 1s infinite;
						background-color: #399953;
						background-repeat: no-repeat;
						background-size: 50% 50%, 50% 50%;
						background-position: 0 0, 100% 0, 100% 100%, 0 100%;
						background-image: linear-gradient(#ffffff, #ffffff),
							linear-gradient(#ffffff, #ffffff),
							linear-gradient(#ffffff, #ffffff),
							linear-gradient(
								${brandColors.giv[500]},
								${brandColors.giv[500]}
							);
					}
					&::after {
						top: 2px;
						bottom: 2px;
						left: 2px;
						right: 2px;
					}
			  `
			: ``}

	@keyframes rotate {
		100% {
			transform: rotate(1turn);
		}
	}
`;

const BadgeWrapper = styled.div`
	width: 100%;
	position: absolute;
	z-index: 2;
	display: flex;
	justify-content: flex-end;
	padding: 16px;
	pointer-events: none;
`;

export default ProjectCardLikeAndShareButtons;
