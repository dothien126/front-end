export class Folder {
    _id = '';
    folderId = '';
    name = '';
    uuid = ''; // Item's UUID - a globally unique identifier
    globalParentId = '';
    parentId = '';
    folderPath = '';
    deletable = false;
    view = '';
    url = '';
    items = 0; // Number of non-subfolder items in folder
    color = 0; // color numeric; range 0-127; defaults to 0 if not present; client can display only 0-7
    size = 0; // Total size of all of non-subfolder items in folder
    unreadCount = 0;
    nodes: Folder[] = [];
    label = '';
    id = '';
    rgb = '';
    iconName = ''; //client only
    stroke = ''; //client only
    fill = ''; //client only
    retentionTypeKeep = 'years'; //client only
    retentionTypePurge = 'years'; //client only
    actionMenu = {} as ActionMenu;
    grantList = [] as IGrant[];
    retentionPolicy = {} as IRetentionPolicy;
    checked = false;
}

export interface IGrant {
    emailShared: string; //share folder
    role: string; //share folder
    permission: string;
    password: string;
    display?: string;
}

export interface IRetentionPolicy{
    keep: IRetentionPolicyDetail;
    purge: IRetentionPolicyDetail;
}

export interface IRetentionPolicyDetail{
    lifeTime: string;
    type: string;
}

export interface ActionMenu {
    NEW_FOLDER: IActionMenuType;
    MOVE_FOLDER: IActionMenuType;
    SHARE_FOLDER: IActionMenuType;
    EDIT_FOLDER: IActionMenuType;
    RENAME_FOLDER: IActionMenuType;
    DELETE_FOLDER: IActionMenuType;
}

export interface IActionMenuType {
    label: string;
    iconName: string;
}
