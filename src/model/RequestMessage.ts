import {FileAttachment} from "@/model/FileAttachment";

export class RequestMessage {
    origid = ''; // Message id of the message being replied to/forwarded (outbound messages only)
    id = ''; //message id
    did = ''; //like message id
    idnt = ''; //user id
    e: E[] = []; //address from to cc.....
    su: Content = {_content: ''}; //subject
    mp: MMp[] = []; //content
    attach: Attach = {aid: '', mp: []}; //id attachment file
    rt = ''; //Reply type - r|w. (r)eplied or for(w)arded.
    irt: Irt = {_content: ''}; //Message-ID header for message being replied to
    suid = 0; //time send
    autoSendTime = 0; //time send later
    listMailTo: string[] = []; //client only
    listMailCc: string[] = []; //client only
    listMailBcc: string[] = []; //client only
    clientContent = ''; //client only
    fileAttachmentList = [] as FileAttachment[]; //client only
    hasFileAttachment = false; //client only - dùng trong truong hop liên quan file đính kèm
}

export interface Irt {
    _content: string;
}

export interface MMp {
    part: string;
    ct: string;
    mp: MMpContent[];
}

export interface MMpContent {
    ct: string;
    content: {
        _content: string;
    }
}

export interface E {
    t: string;
    a: string;
    p: string;
}

export interface Content {
    _content: string;
}

export interface Attach {
    aid: string;
    mp: PartAttachFile[];
}

export interface PartAttachFile {
    part: string;
    mid: string;
}