export interface ICreateAppointmentRequest {
    _jsns: string;
    m:     M;
}

export interface M {
    l:   string;
    inv: Inv;
    e:   EElement[];
    su:  string;
    mp:  MMp;
}

export interface EElement {
    a: string;
    t: string;
}

export interface Inv {
    comp: Comp[];
}

export interface Comp {
    at:     any[];
    status: string;
    fb:     string;
    class:  string;
    transp: string;
    draft:  number;
    allDay: string;
    s:      SClass;
    e:      SClass;
    name:   string;
    loc:    string;
    or:     Or;
    alarm:  Alarm[];
}

export interface Alarm {
    action:  string;
    trigger: Trigger;
}

export interface Trigger {
    rel: Rel;
}

export interface Rel {
    m:       number;
    related: string;
    neg:     string;
}

export interface SClass {
    d: string;
    tz: string;
}

export interface Or {
    a: string;
}

export interface MMp {
    mp: MpElement[];
    ct: string;
}

export interface MpElement {
    ct:      string;
    content: string;
}
