export interface IAppointment {
    hasMore: boolean;
    itemList: Appt[];
}

export interface Appt {
    x_uid:     string;
    uid:       string;
    l:         string;
    s:         number;
    d:         number;
    md:        number;
    ms:        number;
    rev:       number;
    dur:       number;
    ptst:      string;
    fba:       string;
    or:        Or;
    fb:        string;
    transp:    string;
    name:      string;
    loc:       string;
    alarm:     boolean;
    isOrg:     boolean;
    id:        string;
    invId:     string;
    compNum:   number;
    status:    string;
    class:     string;
    allDay:    boolean;
    draft:     boolean;
    neverSent: boolean;
    inst:      Inst[];
    alarmData: AlarmDatum[];
    f:         string;
    tn:        string;
    t:         string;
    cm:        boolean;
    sf:        string;
}

export interface AlarmDatum {
    nextAlarm:      number;
    alarmInstStart: number;
    invId:          number;
    compNum:        number;
    name:           string;
    loc:            string;
    alarm:          Alarm[];
}

export interface Alarm {
    action:  string;
    trigger: Trigger[];
    desc:    Desc[];
}

export interface Desc {
}

export interface Trigger {
    rel: Rel[];
}

export interface Rel {
    neg:     boolean;
    s:       number;
    related: string;
}

export interface Inst {
    s:    number;
    ridZ: string;
}

export interface Or {
    a:   string;
    url: string;
}