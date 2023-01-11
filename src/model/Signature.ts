export class Signature {
    id: string = '';
    title: string = '';
    content: Content[] = [];
    contentDisplay = ''; //client only
}

export class Content {
    type = '';
    content = '';
}
