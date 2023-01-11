import {RequestMessage} from "@/model/RequestMessage";
import {ComposeMessageDto} from "@/model/dto/ComposeMessageDto";

export class ConversationDetail {
  hasMore = false;
  itemList: ItemConversationDetail[] = [];
  conversationId = '';
  mbArchiveModalShowHide = false; //client only
  deleteModalShowHide = false; //client only
}

export class ItemConversationDetail {
  _id = '';
  conversationId = '';
  subject = '';
  contentSort = '';
  emailAddress: EmailAddress[] = [];
  messageId = '';
  messageIdHeader: string = '';
  messageSize = '';
  messageDate: Date = new Date();
  content = '';
  attachments: Attachment[] = [];
  flag = false;
  hasHtml = false;
  tagList: ItemTag[] = [];
  autoSendTime = 0;
  expandedContent = false; //client only
  showHide = false; //client only
  newConversation = false; //client only
  accodionHide = false; //client only;
  tippyShow = false; //client only
  composeMessageDto = new ComposeMessageDto(); //client only
  requestMessage = new RequestMessage(); //client only
  trustImageEmail = ''; //client only
  trustImageDomainList: string[] = []; //client only
  elementContent = {} as any; // client only
  imageMailAlert = false; //client only
  nodeListImage = {} as any; //client only
}

export class ItemTag {
  id: string = '';
  name: string = '';
}

export class EmailAddress {
  address = '';
  name = '';
  partName = '';
  type = '';
}

export class Attachment {
  fileName = '';
  size = 0;
  part = '';
  type = '';
}
