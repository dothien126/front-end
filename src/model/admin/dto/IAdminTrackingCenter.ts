export interface IAdminTrackingCenter {
    id: string; //id
    from: string; //from
    target: string; //to
    starttime: number;
    endtime: number;
    ndr: boolean;
    greylist: boolean;
    dstatus: string; //status
    rstatus: string; //status
    logs: string[]; //detail
    time: number; //detail
    timeDisplay: Date; //client only
}