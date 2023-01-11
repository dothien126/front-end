export class MessageDetail {
  _id = '';
  subject = '';
  contentSort = '';
  emailAddress: EmailAddress[] = [];
  messageId = '';
  messageIdHeader: string = '';
  messageSize = '';
  messageDate: Date = new Date();
  content = '';
  conversationId = '';
  fileAttachmentList?: PurpleMp[] = [];
}

export class EmailAddress {
  address = '';
  name = '';
  partName = '';
  type = '';
}

export interface PurpleMp {
  part:      string;
  ct:        string;
  mp?:       FluffyMp[];
  s?:        number;
  cd?:       string;
  filename?: string;
}


export interface FluffyMp {
  part:     string;
  ct:       string;
  s:        number;
  body?:    boolean;
  content?: string;
}
