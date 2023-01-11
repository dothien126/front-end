export class BatchRequest {
    FolderActionRequest: FolderActionRequest[] = [];
}

export class FolderActionRequest {
    action:    Action = new Action();
    requestId: string = '';
    _jsns:     string = 'urn:zimbraMail';
}

export class Action {
    op:    string = '';
    id:    string = '';
    zid:   string = '';
    l?: string;
    name:  string = '';
    rgb: string = '';
    grant: Grant = new Grant();
    retentionPolicy: RetentionPolicy = new RetentionPolicy();
}

export class Grant {
    gt:   string = '';
    inh:  string = '';
    d:    string = '';
    perm: string = '';
    pw:   string = '';
}

export class RetentionPolicy {
    keep: any = {};
    purge: any = {};
}

export class Keep {
    policy: Policy = new Policy();
}

export class Policy {
    type:     string = '';
    lifetime: string = '';
}