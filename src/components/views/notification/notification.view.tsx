import {
	H5,
	IconConfig24,
	IconNotificationOutline32,
	Lead,
} from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import {
	NotificationContainer,
	NotificationHeader,
	IconContainer,
	NotificationDesc,
	ConfigContainer,
} from './notification.sc';
import {
	TabsContainer,
	TabItem,
	TabItemCount,
} from '@/components/styled-components/Tabs';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowFooter } from '@/features/general/general.slice';
import { fetchNotificationsData } from '@/features/notification/notification.services';
import { INotification } from '@/features/notification/notification.types';
import { NotificationBox } from '@/components/notification/NotificationBox';
import { Flex } from '@/components/styled-components/Flex';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';

enum ENotificationTabs {
	ALL,
	GENERAL = 'general',
	PROJECTS = 'projectRelated',
	GIVECONOMY = 'givEconomyRelated',
}

function NotificationView() {
	const [tab, setTab] = useState(ENotificationTabs.ALL);
	const [allNotifs, setAllNotifs] = useState<INotification[]>([]);
	const [generalNotifs, setGenralNotifs] = useState<INotification[]>([]);
	const [projectNotifs, setProjectsNotifs] = useState<INotification[]>([]);
	const [giveconomyNotifs, setGIVeconomyNotifs] = useState<INotification[]>(
		[],
	);
	const [loading, setLoading] = useState(false);

	const {
		total: totalUnreadNotifications,
		general,
		projectsRelated,
		givEconomyRelated,
	} = useAppSelector(state => state.notification.notificationInfo);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowFooter(false));
	}, [dispatch]);

	useEffect(() => {
		setLoading(true);
		fetchNotificationsData()
			.then(res => {
				if (res?.notifications) setAllNotifs(res.notifications);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleTabChange = (newTab: ENotificationTabs) => {
		if (newTab === tab) return;
		setTab(newTab);
		setLoading(true);
		let query;
		if (newTab !== ENotificationTabs.ALL) {
			query = {
				category: newTab,
			};
		}
		fetchNotificationsData(query)
			.then(res => {
				if (res?.notifications) {
					switch (newTab) {
						case ENotificationTabs.ALL:
							setAllNotifs(res.notifications);
							break;
						case ENotificationTabs.GENERAL:
							setGenralNotifs(res.notifications);
							break;
						case ENotificationTabs.PROJECTS:
							setProjectsNotifs(res.notifications);
							break;
						case ENotificationTabs.GIVECONOMY:
							setGIVeconomyNotifs(res.notifications);
							break;
						default:
							break;
					}
				}
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<NotificationContainer>
			<NotificationHeader gap='8px'>
				<IconContainer>
					<IconNotificationOutline32 />
				</IconContainer>
				<NotificationDesc>
					<H5 weight={700}>Notification Center</H5>
					<Lead>
						Your activity history, starting with the Most recent
					</Lead>
				</NotificationDesc>
			</NotificationHeader>

			<Flex justifyContent='space-between' alignItems='center'>
				<TabsContainer>
					<TabItem
						active={tab === ENotificationTabs.ALL}
						onClick={() => handleTabChange(ENotificationTabs.ALL)}
					>
						All
						<TabItemCount active={tab === ENotificationTabs.ALL}>
							{totalUnreadNotifications}
						</TabItemCount>
					</TabItem>
					<TabItem
						active={tab === ENotificationTabs.GENERAL}
						onClick={() =>
							handleTabChange(ENotificationTabs.GENERAL)
						}
					>
						General
						<TabItemCount
							active={tab === ENotificationTabs.GENERAL}
						>
							{general}
						</TabItemCount>
					</TabItem>
					<TabItem
						active={tab === ENotificationTabs.PROJECTS}
						onClick={() =>
							handleTabChange(ENotificationTabs.PROJECTS)
						}
					>
						Projects
						<TabItemCount
							active={tab === ENotificationTabs.PROJECTS}
						>
							{projectsRelated}
						</TabItemCount>
					</TabItem>
					<TabItem
						active={tab === ENotificationTabs.GIVECONOMY}
						onClick={() =>
							handleTabChange(ENotificationTabs.GIVECONOMY)
						}
					>
						GIVeconomy
						<TabItemCount
							active={tab === ENotificationTabs.GIVECONOMY}
						>
							{givEconomyRelated}
						</TabItemCount>
					</TabItem>
				</TabsContainer>
				<InternalLink href={Routes.NotificationsSettings}>
					<ConfigContainer>
						<IconConfig24 />
					</ConfigContainer>
				</InternalLink>
			</Flex>
			<div>
				{loading ? (
					<div>Loading...</div>
				) : tab === ENotificationTabs.ALL ? (
					allNotifs.map(notification => (
						<NotificationBox
							key={notification.id}
							notification={notification}
						/>
					))
				) : tab === ENotificationTabs.GENERAL ? (
					generalNotifs.map(notification => (
						<NotificationBox
							key={notification.id}
							notification={notification}
						/>
					))
				) : tab === ENotificationTabs.PROJECTS ? (
					projectNotifs.map(notification => (
						<NotificationBox
							key={notification.id}
							notification={notification}
						/>
					))
				) : tab === ENotificationTabs.GIVECONOMY ? (
					giveconomyNotifs.map(notification => (
						<NotificationBox
							key={notification.id}
							notification={notification}
						/>
					))
				) : null}
			</div>
		</NotificationContainer>
	);
}

export default NotificationView;
