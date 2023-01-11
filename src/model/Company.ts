export class Company {
    _id: string = '';
    logo: string = '';
    logoDarkMode: string = '';
    title: string = '';
    webmail: string = '';
    status: string = '';
    verticalMode: boolean = false;
    zimbraHostInfo = new ZimbraHostInfo();
}

export class ZimbraHostInfo {
    apiUrl: string = '';
    attachmentUrl: string = '';
    downloadUrl: string = '';
}