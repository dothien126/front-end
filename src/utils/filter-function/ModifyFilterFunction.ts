import {
    FilterActionDetails,
    FilterActions,
    FilterTestDetails,
    FilterTests,
    MethodOfFilterTestDetails
} from "@/model/interface/IFilterRule";
import {EnumHeaderFilter, EnumValueForSelected} from "@/model/dto/EnumData";

export function initDataMofidyForHeaderFromToSubject(item: FilterTestDetails, filterTests: FilterTests) {
    //Xu ly cac header: from -> subject
    if (item.headerSelected === EnumHeaderFilter.from || item.headerSelected === EnumHeaderFilter.to || item.headerSelected === EnumHeaderFilter.cc || item.headerSelected === EnumHeaderFilter.toCc || item.headerSelected === EnumHeaderFilter.subject) {
        //init value
        let stringComparison = EnumValueForSelected.contains;
        //logic for string comparison
        if (item.subOneConditionSelected === EnumValueForSelected.doNotMatchExactly || item.subOneConditionSelected === EnumValueForSelected.matchExactly) {
            stringComparison = EnumValueForSelected.is;
        } else if (item.subOneConditionSelected === EnumValueForSelected.doNotMatchWildcardCondition || item.subOneConditionSelected === EnumValueForSelected.matchWildcardCondition) {
            stringComparison = EnumValueForSelected.matchWildcardCondition;
        }
        //set value to init data request
        if(item.headerSelected !== EnumHeaderFilter.subject){
            const addressTest = {
                value: item.subTwoConditionSelected,
                header: item.headerSelected,
                part: item.subThreeConditionSelected,
                negative: item.subOneConditionSelected === EnumValueForSelected.doNotMatchExactly || item.subOneConditionSelected === EnumValueForSelected.doNotContains || item.subOneConditionSelected === EnumValueForSelected.doNotMatchWildcardCondition,
                stringComparison: stringComparison,
            } as FilterTestDetails;
            //set to list
            if(filterTests.addressTest) filterTests.addressTest.push(addressTest);
        }
        else{
            const headerTest = {
                value: item.subTwoConditionSelected,
                header: item.headerSelected,
                negative: item.subOneConditionSelected === EnumValueForSelected.doNotMatchExactly || item.subOneConditionSelected === EnumValueForSelected.doNotContains || item.subOneConditionSelected === EnumValueForSelected.doNotMatchWildcardCondition,
                stringComparison: stringComparison,
            } as FilterTestDetails;
            //set to list
            if(filterTests.headerTest) filterTests.headerTest.push(headerTest);
        }
    }
}

export function initDataMofidyForHeaderMessage(item: FilterTestDetails, filterTests: FilterTests) {
    //Xu ly cac header: message
    if(item.headerSelected === EnumHeaderFilter.message){
        if(item.subTwoConditionSelected === EnumValueForSelected.inConversationIStarted || item.subTwoConditionSelected === EnumValueForSelected.inConversationIParticipated){
            //set value to init data request
            const conversationTest = {where: item.subTwoConditionSelected, negative: item.subOneConditionSelected === EnumValueForSelected.isNot} as FilterTestDetails;
            //set to list
            if(filterTests.conversationTest) filterTests.conversationTest.push(conversationTest);
        }
        else if(item.subTwoConditionSelected === EnumValueForSelected.massMarketing){
            //set value to init data request
            const bulkTest = {negative: item.subOneConditionSelected === EnumValueForSelected.isNot} as FilterTestDetails;
            //set to list
            if(filterTests.bulkTest) filterTests.bulkTest.push(bulkTest);
        }
        else if(item.subTwoConditionSelected === EnumValueForSelected.fromDistributionList){
            //set value to init data request
            const listTest = {negative: item.subOneConditionSelected === EnumValueForSelected.isNot} as FilterTestDetails;
            //set to list
            if(filterTests.listTest) filterTests.listTest.push(listTest);
        }
        else if(item.subTwoConditionSelected === EnumValueForSelected.flagged){
            //set value to init data request
            const flaggedTest = {flagName: item.subTwoConditionSelected, negative: item.subOneConditionSelected === EnumValueForSelected.isNot} as FilterTestDetails;
            //set to list
            if(filterTests.flaggedTest) filterTests.flaggedTest.push(flaggedTest);
        }
        else if(item.subTwoConditionSelected === EnumValueForSelected.markAs && (item.subThreeConditionSelected === EnumValueForSelected.read || item.subThreeConditionSelected === EnumValueForSelected.priority)){
            //set value to init data request
            const flaggedTest = {flagName: item.subThreeConditionSelected, negative: item.subOneConditionSelected === EnumValueForSelected.isNot} as FilterTestDetails;
            //set to list
            if(filterTests.flaggedTest) filterTests.flaggedTest.push(flaggedTest);
        }
        else if(item.subTwoConditionSelected === EnumValueForSelected.markAs && (item.subThreeConditionSelected === EnumValueForSelected.highImportance || item.subThreeConditionSelected === EnumValueForSelected.normalImportance || item.subThreeConditionSelected === EnumValueForSelected.lowImportance)){
            //set value to init data request
            const importanceTest = {imp: item.subThreeConditionSelected, negative: item.subOneConditionSelected === EnumValueForSelected.isNot} as FilterTestDetails;
            //set to list
            if(filterTests.importanceTest) filterTests.importanceTest.push(importanceTest);
        }
    }
}

export function initDataMofidyForHeaderSize(item: FilterTestDetails, filterTests: FilterTests) {
    //Xu ly cac header: size
    if(item.headerSelected === EnumHeaderFilter.size){
        //init value
        let numberComparison = EnumValueForSelected.over;
        //logic for number comparison
        if (item.subOneConditionSelected === EnumValueForSelected.doNotUnder || item.subOneConditionSelected === EnumValueForSelected.under) {
            numberComparison = EnumValueForSelected.under;
        }
        //set value to init data request
        const sizeTest = {
            s: item.subThreeConditionSelected === EnumValueForSelected.b ? item.subTwoConditionSelected : item.subTwoConditionSelected + item.subThreeConditionSelected,
            header: item.headerSelected,
            negative: item.subOneConditionSelected === EnumValueForSelected.doNotOver || item.subOneConditionSelected === EnumValueForSelected.doNotUnder,
            numberComparison: numberComparison,
        } as FilterTestDetails;
        //set to list
        if(filterTests.sizeTest) filterTests.sizeTest.push(sizeTest);
    }
}

export function initDataMofidyForHeaderDate(item: FilterTestDetails, filterTests: FilterTests) {
    //Xu ly cac header: size
    if(item.headerSelected === EnumHeaderFilter.date){
        //init value
        let dateComparison = EnumValueForSelected.before;
        //logic for number comparison
        if (item.subOneConditionSelected === EnumValueForSelected.after || item.subOneConditionSelected === EnumValueForSelected.doNotAfter) {
            dateComparison = EnumValueForSelected.after;
        }
        //logic parse date
        const dateParts = item.subTwoConditionSelected.split("/");
        const parseDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
        const time = parseDate.getTime() / 1000;
        //set value to init data request
        const dateTest = {
            d: time,
            header: item.headerSelected,
            negative: item.subOneConditionSelected === EnumValueForSelected.doNotBefore || item.subOneConditionSelected === EnumValueForSelected.doNotAfter,
            dateComparison: dateComparison,
        } as FilterTestDetails;
        //set to list
        if(filterTests.dateTest) filterTests.dateTest.push(dateTest);
    }
}

export function initDataMofidyForHeaderBody(item: FilterTestDetails, filterTests: FilterTests) {
    //Xu ly cac header: body
    if (item.headerSelected === EnumHeaderFilter.body) {
        //set value to init data request
        const bodyTest = {
            value: item.subTwoConditionSelected,
            header: item.headerSelected,
            negative: item.subOneConditionSelected === EnumValueForSelected.doNotContains,
        } as FilterTestDetails;
        //set to list
        if(filterTests.bodyTest) filterTests.bodyTest.push(bodyTest);
    }
}

export function initDataMofidyForHeaderAttachmentToReadReceipt(item: FilterTestDetails, filterTests: FilterTests) {
    //Xu ly cac header: body
    if (item.headerSelected === EnumHeaderFilter.attachment) {
        //set value to init data request
        const attachmentTest = {
            negative: item.subOneConditionSelected === EnumValueForSelected.notExists,
        } as FilterTestDetails;
        //set to list
        if(filterTests.attachmentTest) filterTests.attachmentTest.push(attachmentTest);
    }
    else if(item.headerSelected === EnumHeaderFilter.readReceipt){
        //set value to init data request
        const mimeHeaderTest = {
            header: item.headerSelected,
            stringComparison: EnumValueForSelected.contains,
            value: 'message/disposition-notification',
            negative: item.subOneConditionSelected === EnumValueForSelected.notExists,
        } as FilterTestDetails;
        //set to list
        if(filterTests.mimeHeaderTest) filterTests.mimeHeaderTest.push(mimeHeaderTest);
    }
}

export function initDataMofidyForHeaderAddressIn(item: FilterTestDetails, filterTests: FilterTests) {
    //Xu ly cac header: addressIn
    if (item.headerSelected === EnumHeaderFilter.addressIn) {
        if(item.subThreeConditionSelected === EnumValueForSelected.contacts){
            //set value to init data request
            const addressBookTest = {
                header: item.subOneConditionSelected,
                type: EnumValueForSelected.contacts,
                negative: item.subTwoConditionSelected === EnumValueForSelected.notIn,
            } as FilterTestDetails;
            //set to list
            if(filterTests.addressBookTest) filterTests.addressBookTest.push(addressBookTest);
        }
        else if(item.subThreeConditionSelected === EnumValueForSelected.frequentEmail){
            //set value to init data request
            const contactRankingTest = {
                header: item.subOneConditionSelected,
                negative: item.subTwoConditionSelected === EnumValueForSelected.notIn,
            } as FilterTestDetails;
            //set to list
            if(filterTests.contactRankingTest) filterTests.contactRankingTest.push(contactRankingTest);
        }
        else if(item.subTwoConditionSelected === EnumValueForSelected.isMe || item.subTwoConditionSelected === EnumValueForSelected.isNotMe){
            //set value to init data request
            const meTest = {
                header: item.subOneConditionSelected,
                negative: item.subTwoConditionSelected === EnumValueForSelected.isNotMe,
            } as FilterTestDetails;
            //set to list
            if(filterTests.meTest) filterTests.meTest.push(meTest);
        }
    }
}

export function initDataMofidyForHeaderCalendar(item: FilterTestDetails, filterTests: FilterTests) {
    //Xu ly cac header: calendar
    if (item.headerSelected === EnumHeaderFilter.calendar) {
        //init value method
        let content = EnumValueForSelected.inviteRequested;
        if(item.subOneConditionSelected === EnumValueForSelected.inviteReplied || item.subOneConditionSelected === EnumValueForSelected.inviteNotReplied){
            content = EnumValueForSelected.inviteReplied;
        }
        const method = {_content: content} as MethodOfFilterTestDetails;
        //set value to init data request
        const inviteTest = {
            method: [method],
            negative: item.subOneConditionSelected === EnumValueForSelected.inviteNotReplied || item.subOneConditionSelected === EnumValueForSelected.inviteNotRequested,
        } as FilterTestDetails;
        //set to list
        if(filterTests.inviteTest) filterTests.inviteTest.push(inviteTest);
    }
}

export function initDataMofidyForHeaderSocial(item: FilterTestDetails, filterTests: FilterTests) {
    //Xu ly cac header: social
    if (item.headerSelected === EnumHeaderFilter.social) {
        if(item.subOneConditionSelected === EnumValueForSelected.facebookNotification){
            //set value to init data request
            const facebookTest = {
            } as FilterTestDetails;
            //set to list
            if(filterTests.facebookTest) filterTests.facebookTest.push(facebookTest);
        }
        else if(item.subOneConditionSelected === EnumValueForSelected.linkedInNotification){
            //set value to init data request
            const linkedinTest = {
            } as FilterTestDetails;
            //set to list
            if(filterTests.linkedinTest) filterTests.linkedinTest.push(linkedinTest);
        }
        else if(item.subOneConditionSelected === EnumValueForSelected.twitterNotification){
            //set value to init data request
            const twitterTest = {
            } as FilterTestDetails;
            //set to list
            if(filterTests.twitterTest) filterTests.twitterTest.push(twitterTest);
        }
    }
}

export function initDataMofidyForHeaderNamed(item: FilterTestDetails, filterTests: FilterTests) {
    //Xu ly cac header: social
    if (item.headerSelected === EnumHeaderFilter.headerNamed) {
        if(item.subTwoConditionSelected === EnumValueForSelected.exists || item.subTwoConditionSelected === EnumValueForSelected.notExists){
            //set value to init data request
            const headerExistsTest = {
                header: item.subOneConditionSelected,
                value: item.subThreeConditionSelected,
                negative: item.subTwoConditionSelected === EnumValueForSelected.notExists
            } as FilterTestDetails;
            //set to list
            if(filterTests.headerExistsTest) filterTests.headerExistsTest.push(headerExistsTest);
        }
        else{
            //init value stringComparison
            let stringComparison = EnumValueForSelected.is;
            if(item.subTwoConditionSelected === EnumValueForSelected.contains || item.subTwoConditionSelected === EnumValueForSelected.doNotContains){
                stringComparison = EnumValueForSelected.contains;
            }
            else if(item.subTwoConditionSelected === EnumValueForSelected.matchWildcardCondition || item.subTwoConditionSelected === EnumValueForSelected.doNotMatchWildcardCondition){
                stringComparison = EnumValueForSelected.matchWildcardCondition;
            }
            //set value to init data request
            const headerTest = {
                header: item.subOneConditionSelected,
                value: item.subThreeConditionSelected,
                stringComparison: stringComparison,
                negative: item.subTwoConditionSelected === EnumValueForSelected.doNotMatchExactly || item.subTwoConditionSelected === EnumValueForSelected.doNotContains || item.subTwoConditionSelected === EnumValueForSelected.doNotMatchWildcardCondition
            } as FilterTestDetails;
            //set to list
            if(filterTests.headerTest) filterTests.headerTest.push(headerTest);
        }
    }
}

export function initDataMofidyForHeaderActionKeepAndDiscard(item: FilterActionDetails, filterActions: FilterActions) {
    //Xu ly cac header: keep
    if (item.headerActionSelected === EnumHeaderFilter.keepInInbox) {
        //set value to init data request
        const actionKeep = {} as FilterActionDetails;
        //set to list
        if(filterActions.actionKeep) filterActions.actionKeep.push(actionKeep);
    }
    else if (item.headerActionSelected === EnumHeaderFilter.discard) {
        //set value to init data request
        const actionDiscard = {} as FilterActionDetails;
        //set to list
        if(filterActions.actionDiscard) filterActions.actionDiscard.push(actionDiscard);
    }
}

export function initDataMofidyForActionFileIntoAndFlagAndRedirectAndTag(item: FilterActionDetails, filterActions: FilterActions) {
    //Xu ly cac header: move into folder
    if (item.headerActionSelected === EnumHeaderFilter.moveIntoFolder) {
        //set value to init data request
        const actionFileInto = {folderPath: item.folderPath} as FilterActionDetails;
        //set to list
        if(filterActions.actionFileInto) filterActions.actionFileInto.push(actionFileInto);
    }
    else if (item.headerActionSelected === EnumHeaderFilter.tagWith) {
        //set value to init data request
        const actionTag = {tagName: item.tagName} as FilterActionDetails;
        //set to list
        if(filterActions.actionTag) filterActions.actionTag.push(actionTag);
    }
    else if (item.headerActionSelected === EnumHeaderFilter.markAs) {
        //set value to init data request
        const actionFlag = {flagName: item.subActionSelected} as FilterActionDetails;
        //set to list
        if(filterActions.actionFlag) filterActions.actionFlag.push(actionFlag);
    }
    else if (item.headerActionSelected === EnumHeaderFilter.redirectToAddress) {
        //set value to init data request
        const actionRedirect = {a: item.subActionSelected} as FilterActionDetails;
        //set to list
        if(filterActions.actionRedirect) filterActions.actionRedirect.push(actionRedirect);
    }
}