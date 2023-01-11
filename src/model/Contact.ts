export class Contact {
    hasMore = false;
    itemList: ItemContact[] = [];
}

export class ItemContact {
    id = '';
    firstName = '';
    lastName = '';
    fullName = '';
    email = '';
    phone: string = '';
    position: string = '';
    company: string = '';
    description: string = '';
    birthDay: string = '';
    folderId: string = '';
    checked = false; //client only
}