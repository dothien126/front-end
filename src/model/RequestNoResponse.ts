export class RequestNoResponse {
  itemId = '';
  folderId = '';
  operation = '';
  folderName = '';
  tcon = '';
  tagName = '';
  messageId = '';
  part = '';
  prefs: IPrefs[] = [];
}

export interface IPrefs {
  name: string;
  value: any;
}
