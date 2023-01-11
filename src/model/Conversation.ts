export class Conversation {
  hasMore = false;
  itemList: Item[] = [];
}

export class Item {
  _id = '';
  subject = '';
  contentSort = '';
  sender = '';
  fullName = '';
  sortName = '';
  conversationId = '';
  conversationDate: Date = new Date('1990-01-01');
  unread = false;
  flag = false;
  flagName = '';
  countMessage = 0;
  tagList: ItemTag[] = [];
  checked = false; //client only
  autoSendTime = 0;
}

export class ItemTag {
  id: string = '';
  name: string = '';
}
