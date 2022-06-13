import {
	EDonationStatus,
	EDonationType,
	EProjectStatus,
} from '@/apollo/types/gqlEnums';

export interface IProject {
	id?: string;
	title?: string;
	balance?: number;
	image?: string;
	slug: string;
	creationDate?: string;
	admin?: string;
	description?: string;
	walletAddress?: string;
	impactLocation?: string;
	qualityScore?: number;
	verified?: boolean;
	listed?: boolean | null;
	categories: ICategory[];
	reaction?: IReaction;
	totalReactions: number;
	adminUser: {
		id?: string;
		email?: string;
		name?: string;
		walletAddress?: string;
	};
	donations: {
		id?: string;
	}[];
	users: IUser[];
	totalDonations?: number;
	totalTraceDonations?: number;
	totalProjectUpdates?: number;
	traceCampaignId: string | null;
	status: {
		id?: string;
		name?: EProjectStatus;
	};
	updatedAt: string;
	organization?: {
		name: string;
		label: string;
		supportCustomTokens: boolean;
	};
}

export interface IProjectEdition {
	id?: string;
	title?: string;
	image?: string;
	description?: string;
	walletAddress?: string;
	impactLocation?: string;
	categories: ICategory[];
	adminUser: {
		walletAddress?: string;
	};
	status: {
		name?: string;
	};
	slug: string;
}

export interface IProjectCreation {
	title: string;
	description: string;
	impactLocation?: any;
	categories: any;
	organisationId: number;
	walletAddress: string;
	image?: string;
	isDraft?: boolean;
}

export interface IUser {
	id?: string;
	firstName?: string;
	lastName?: string;
	name?: string;
	email?: string;
	avatar?: string;
	walletAddress?: string;
	url?: string;
	location?: string;
	userId?: string;
	totalDonated?: number;
	totalReceived?: number;
	projectsCount?: number;
	donationsCount?: number;
	likedProjectsCount?: number;
}

export interface IReaction {
	id: string;
	userId: string;
}

export interface IDonation {
	id: string;
	user: {
		id?: string;
		email?: string;
		name?: string;
		firstName?: string;
	};
	fromWalletAddress: string;
	amount: number;
	currency: string;
	valueUsd?: number;
	transactionId: string;
	transactionNetworkId: number;
	createdAt: string;
	donationType?: EDonationType;
	anonymous?: boolean;
	status: EDonationStatus;
}

export interface IWalletDonation extends IDonation {
	anonymous: boolean;
	priceEth: number;
	priceUsd: number;
	project: IProject;
	toWalletAddress: string;
	valueEth: number;
	valueUsd: number;
}

export interface IMediumBlogPost {
	title: string;
	author: string;
	description: string;
	link: string;
	pubDate: string;
	guid: string;
}

export interface ICategory {
	name: string;
}

export interface IProjectBySlug {
	project: IProject;
}

export interface IProjectUpdate {
	content: string;
	createdAt: string;
	id: string;
	projectId: string;
	title: string;
	userId: string;
}

export interface ISiweMessage {
	nonce: string;
	message: string;
}

export interface IProjectRegistry {
	isNonProfitOrganization?: boolean;
	organizationCountry?: string;
	organizationWebsite?: string;
	organizationDescription?: string;
}

export interface IProjectContacts {
	twitter?: string;
	facebook?: string;
	linkedin?: string;
	instagram?: string;
	youtube?: string;
}

export interface IProjectMilestones {
	foundationDate?: Date;
	mission?: string;
	achievedMilestones?: string;
	achievedMilestonesProof?: string;
}

export interface IProjectManagingFunds {
	description: string;
	relatedAddresses: RelatedAddress[];
}

export interface RelatedAddress {
	title: string;
	address: string;
	networkId: number;
}
export interface IProjectVerification {
	id: string;
	isTermAndConditionsAccepted: boolean;
	emailConfirmationToken?: string;
	emailConfirmationSent?: boolean;
	emailConfirmationSentAt?: string;
	emailConfirmedAt?: string;
	emailConfirmed?: boolean;
	projectRegistry?: IProjectRegistry;
	projectContacts?: IProjectContacts;
	milestones?: IProjectMilestones;
	managingFunds?: IProjectManagingFunds;
	emailConfirmationTokenExpiredAt?: string;
	user: IUser;
	project: IProject;
	status: PROJECT_VERIFICATION_STATUSES;
	lastStep: PROJECT_VERIFICATION_STEPS;
}

export enum PROJECT_VERIFICATION_STATUSES {
	VERIFIED = 'verified',
	DRAFT = 'draft',
	SUBMITTED = 'submitted',
	REJECTED = 'rejected',
}

export interface ProjectVerificationUpdateInput {
	step: PROJECT_VERIFICATION_STEPS;
	projectVerificationId: number;
	projectRegistry?: IProjectRegistry;
	projectContacts?: IProjectContacts;
	milestones?: IProjectMilestones;
	managingFunds?: IProjectManagingFunds;
	isTermAndConditionsAccepted?: boolean;
}

export enum PROJECT_VERIFICATION_STEPS {
	PERSONAL_INFO = 'personalInfo',
	PROJECT_REGISTRY = 'projectRegistry',
	PROJECT_CONTACTS = 'projectContacts',
	MANAGING_FUNDS = 'managingFunds',
	MILESTONES = 'milestones',
	TERM_AND_CONDITION = 'termAndCondition',
	SUBMIT = 'submit',
}
