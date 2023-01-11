export interface IAdminQuarantine {
    id: string;
    time: number;
    subject: string;
    content: string;
    file: string;
    header: string;
    spamlevel: number;
    spaminfo: SpamInfoFieldOfIAdminQuarantine[];
    from: string;
    receiver: string;
    envelope_sender: string;
    virusname: string;
    bytes: number;
    htmlContent: string; //custom
    accountList: string[]; //custom
}

export interface SpamInfoFieldOfIAdminQuarantine{
    desc: string;
    score: number;
    name: string;
    url: string;
}

