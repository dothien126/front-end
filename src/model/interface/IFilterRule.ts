export interface IInOutFilterRule {
    outgoingFilterRule: boolean;
    filterRules: IFilterRule[];
}

export interface IFilterRule {
    name: string;
    active: boolean;
    filterTests: FilterTests[];
    filterActions: FilterActions[];
    selected: boolean; //client only
    indexSelected: number; //client only
    moveAdd: boolean; //client only
    moveRemove: boolean; //client only
    moveUp: boolean; //client only
    moveDown: boolean; //client only
}

export interface FilterTests{
    condition: string;
    addressTest?:        FilterTestDetails[];
    headerTest?:         FilterTestDetails[];
    conversationTest?:   FilterTestDetails[];
    bulkTest?:           FilterTestDetails[];
    listTest?:           FilterTestDetails[];
    flaggedTest?:        FilterTestDetails[];
    importanceTest?:     FilterTestDetails[];
    sizeTest?:           FilterTestDetails[];
    dateTest?:           FilterTestDetails[];
    bodyTest?:           FilterTestDetails[];
    attachmentTest?:     FilterTestDetails[];
    mimeHeaderTest?:     FilterTestDetails[];
    addressBookTest?:    FilterTestDetails[];
    contactRankingTest?: FilterTestDetails[];
    meTest?:             FilterTestDetails[];
    inviteTest?:         FilterTestDetails[];
    facebookTest?:       FilterTestDetails[];
    linkedinTest?:       FilterTestDetails[];
    twitterTest?:        FilterTestDetails[];
    headerExistsTest?:   FilterTestDetails[];
}

export interface FilterTestDetails{
    index: number; //vị trí (bắt đầu = 0)
    negative: boolean; //điều kiện phủ định
    header: string;
    part: string;
    where: string;
    flagName: string; //flaggedTest
    dateComparison: string;
    d: number; //dateTest
    s: string; //sizeTest
    stringComparison: string; //contains, is, matches
    numberComparison: string; //over, under
    imp: string; //high|normal|low)
    value: string;
    type: string;
    method: MethodOfFilterTestDetails[];
    idRender: string; //client only
    headerSelected: string; //client only
    subOneConditionSelected: string; //client only
    subTwoConditionSelected: string; //client only
    subThreeConditionSelected: string; //client only
    showInputSubOne: boolean; //client only
    showInputSubTwo: boolean; //client only
    showInputSubThree: boolean; //client only
    headerList: DataByHeader[]; //client only
    subOneConditionList: SubCondition; //client only
    subTwoConditionList: SubCondition; //client only
    subThreeConditionList: SubCondition; //client only
}

export interface MethodOfFilterTestDetails {
    _content: string;
}

export interface FilterActions {
    actionKeep: FilterActionDetails[];
    actionDiscard: FilterActionDetails[];
    actionFileInto: FilterActionDetails[];
    actionFlag: FilterActionDetails[];
    actionTag: FilterActionDetails[];
    actionRedirect: FilterActionDetails[];
    actionStop: FilterActionDetails[];
}

export interface FilterActionDetails {
    index: number;
    folderPath: string;
    copy: boolean;
    flagName: string;
    tagName: string;
    a: string;
    idRender: string; //client only
    headerActionSelected: string; //client only
    subActionSelected: string; //client only
    showInputSubAction: boolean; //client only
    headerActionList: DataByHeader[]; //client only
    subActionConditionList: SubCondition; //client only
}

export interface SubCondition {
    name: string;
    dataByHeader: DataByHeader[];
}

export interface DataByHeader{
    value: string;
    text: string;
}