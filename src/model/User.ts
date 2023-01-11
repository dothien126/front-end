export class User {
  _id = '';
  displayName = '';
  zimbraUserId = '';
  account = '';
  password = '';
  oldPassword = '';
  confirmPassword = ''; //client only
  jwt: string = ''; //client only
  token = '';
  lifetime = 0;
  sendLater: boolean = false;
  timeSendLater: number = 0; //don vi la giay
  clientType = '';
  docSizeLimit = 0;
  attSizeLimit = 0;
  used = 0;
  maxQuota = 0;
  mailBlacklistMaxNumEntries = 0;
  mailWhitelistMaxNumEntries = 0;
  updatedAt = new Date(0);
  timeZone = ''; //Asia/Bangkok
  language = ''; // en_US
  composeDirection = ''; //RTL LTR
  showDirectionButtonInCompose = false;
  includeSpamFolderInSearch = false;
  includeTrashFolderInSearch = false;
  includeSharedFolderInSearch = false;
  displayCheckboxInSelectedItem = false;
  displayNameInEmailAddress = false;
  defaultSignatureId = '';
  forwardReplySignatureId = '';
  mailSignatureStyle = '';
  zimbraPrefFromDisplay = ''; //tuy chon, nhap j thi nhap
  zimbraPrefFromAddress = ''; //dia chi email
  zimbraPrefFromAddressType = ''; //sendAs
  zimbraPrefReplyToEnabled = false; //true false
  zimbraPrefReplyToDisplay = ''; //tuy chon, nhap j thi nhap
  zimbraPrefReplyToAddress = ''; //dia chi email
  zimbraPrefMailForwardingAddress: string = '';
  zimbraPrefMailLocalDeliveryDisabled: boolean = false;
  zimbraPrefNewMailNotificationAddress: string = '';
  zimbraPrefNewMailNotificationEnabled: boolean = false;
  zimbraPrefOutOfOfficeReplyEnabled: boolean = false;
  zimbraPrefOutOfOfficeReply: string = '';
  zimbraPrefOutOfOfficeExternalReplyEnabled: boolean = false; //option 1
  zimbraPrefOutOfOfficeExternalReply: string = ''; //option 2
  zimbraPrefExternalSendersType: string = ''; //option 3 - ALLNOTINAB
  zimbraPrefOutOfOfficeSuppressExternalReply: boolean = false; //option 4
  zimbraPrefOutOfOfficeFromDate: Date = new Date();
  zimbraPrefOutOfOfficeUntilDate: Date = new Date();
  zimbraPrefOutOfOfficeFreeBusyStatus: string = ''; //OUTOFOFFICE - BUSY
  zimbraPrefOutOfOfficeStatusAlertOnLogin = false;
  trustImage = new TrustImage(); //systems only
  hasDeleted = new HasDeleted(); //systems only
}

export class TrustImage{
  byEmail: string[] = [];
}

export class HasDeleted{
  zimbraUserId: string = '';
  timeDeleted: Date = new Date(0);
  dayDiffTime = 0; //client only
  hourDiffTime = 0; //client only
  minuteDiffTime = 0; //client only
  secondDiffTime = 0; //client only
}
