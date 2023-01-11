export class WhiteBlackList {
    whiteList: Addr[] = [];
    blackList: Addr[] = [];
}

export class Addr {
    op: string = '+';
    content: string = '';
    checked = false; //client only
}