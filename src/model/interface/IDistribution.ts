export interface IDistribution {
    distributionList: IItemDistribution[];
    //pagination
    hasMore: boolean;
    total: number;
}

export interface IItemDistribution{
    id: string;
    email: string;
    displayName: string;
    isOwner: boolean;
    isMember: boolean;
}