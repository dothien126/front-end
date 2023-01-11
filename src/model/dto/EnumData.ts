export enum EnumHeaderFilter {
    //test
    from = 'from',
    to = 'to',
    cc = 'cc',
    toCc = 'to,cc',
    subject = 'subject',
    message = 'message',
    size = 'size',
    date = 'date',
    body = 'body',
    attachment = 'attachment',
    readReceipt = 'content-type',
    addressIn = 'addressin',
    calendar = 'calendar',
    social = 'social',
    headerNamed = 'headernamed',
    //action
    keepInInbox = 'keepinbnbox',
    discard = 'discard',
    moveIntoFolder = 'moveintofolder',
    tagWith = 'tagwith',
    markAs = 'markas',
    redirectToAddress = 'redirecttoaddress',
}

export enum EnumSubCondition{
    //sub
    forFromToSubject = 'forFromToSubject',
    forFromOrToOrCcOrToCc = 'forFromOrToOrCcOrToCc',
    forMessage = 'forMessage',
    forMessageAndMarkAs = 'forMessageAndMarkAs',
    forSize = 'forSize',
    forDate = 'forDate',
    forBody = 'forBody',
    forAttachmentToReadReceipt = 'forAttachmentToReadReceipt',
    forAddressIn = 'forAddressIn',
    forCalendar = 'forCalendar',
    forSocial = 'forSocial',
    forHeaderNamed = 'forHeaderNamed',
    forAddressInAndNotEqualIsMeAndNotMe = 'forAddressInAndNotEqualIsMeAndNotMe',
    //action
    forMarkAs = 'forMarkAs',
}

export enum EnumValueForSelected{
    /* ----- sub one ----- */
    //condition
    anyof = 'anyof',
    allof = 'allof',
    //message
    is = 'is',
    isNot = 'isNot',
    //from -> subject
    matchExactly = 'matchExactly',
    doNotMatchExactly = 'doNotMatchExactly',
    contains = 'contains', //body
    doNotContains = 'doNotContains', //body
    matchWildcardCondition = 'matches',
    doNotMatchWildcardCondition = 'doNotMatchWildcardCondition',
    //size
    under = 'under',
    doNotUnder = 'doNotUnder',
    over = 'over',
    doNotOver = 'doNotOver',
    //Date
    before = 'before',
    doNotBefore = 'doNotBefore',
    after = 'after',
    doNotAfter = 'doNotAfter',
    //attachment - read recipt
    exists = 'exists',
    notExists = 'notExists',
    //address in
    from = 'from',
    to = 'to',
    cc = 'cc',
    toCc = 'to,cc',
    //calendar
    inviteRequested = 'anyrequest',
    inviteNotRequested = 'inviteNotRequested',
    inviteReplied = 'anyreply',
    inviteNotReplied = 'inviteNotReplied',
    //social
    facebookNotification = 'facebookNotification',
    linkedInNotification = 'linkedInNotification',
    twitterNotification = 'twitterNotification',
    /* ----- sub two ----- */
    //message
    inConversationIStarted = 'started',
    inConversationIParticipated = 'participated',
    massMarketing = 'massMarketing',
    fromDistributionList = 'fromDistributionList',
    markAs = 'markAs',
    flagged = 'flagged',
    read = 'read', //mark as action message and markas
    //address in
    in = 'in',
    notIn = 'notIn',
    isMe = 'isMe',
    isNotMe = 'isNotMe',
    /* ----- sub three ----- */
    //from -> to or cc
    all = 'all',
    localPart = 'localpart',
    domain = 'domain',
    //message and markas
    priority = 'priority',
    highImportance = 'high',
    normalImportance = 'normal',
    lowImportance = 'low',
    //size
    b = 'B',
    kb = 'K',
    mb = 'M',
    gb = 'G',
    //address in
    contacts = 'contacts',
    frequentEmail = 'frequentEmail',
}