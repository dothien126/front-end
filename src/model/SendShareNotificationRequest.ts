export class SendShareNotificationRequest {
    item: IItemOfSendShareNotification = new IItemOfSendShareNotification();
    e: IEmailOfSendShareNotification = new IEmailOfSendShareNotification();
    notes: INoteOfSendShareNotification = new INoteOfSendShareNotification();
    _jsns: string = 'urn:zimbraMail';
}

export class IItemOfSendShareNotification{
    id: string = '';
}

export class IEmailOfSendShareNotification{
    a: string = '';
}

export class INoteOfSendShareNotification {
    _content: string = '';
}