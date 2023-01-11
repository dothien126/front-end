import {FilterActionDetails, FilterTestDetails, SubCondition,} from "@/model/interface/IFilterRule";
import {EnumHeaderFilter, EnumValueForSelected,} from "@/model/dto/EnumData";
import {helper} from "@/utils/helper";
import {env} from "@/utils/MyVariables";

export function setDataByEditFilterRuleForHeader(data: FilterTestDetails, key: string, dataForFilterRuleSelected: any, filterTestDetailList: FilterTestDetails[]) {
    //Xu ly cho value header
    let headerSelected = data.header;
    if (data.method) headerSelected = EnumHeaderFilter.calendar;
    else if( key === 'addressTest') headerSelected = data.header;
    else if (key === 'addressBookTest' || key === 'contactRankingTest' || key === 'meTest') headerSelected = EnumHeaderFilter.addressIn;
    else if (key === 'conversationTest' || key === 'bulkTest' || key === 'listTest' || key === 'flaggedTest' || key === 'importanceTest') headerSelected = EnumHeaderFilter.message;
    else if (key === 'sizeTest') headerSelected = EnumHeaderFilter.size;
    else if (key === 'dateTest') headerSelected = EnumHeaderFilter.date;
    else if (key === 'bodyTest') headerSelected = EnumHeaderFilter.body;
    else if (key === 'attachmentTest') headerSelected = EnumHeaderFilter.attachment;
    else if (key === 'facebookTest' || key === 'linkedinTest' || key === 'twitterTest') headerSelected = EnumHeaderFilter.social;
    else if (key === 'headerTest' && data.header !== 'subject' || key === 'headerExistsTest') headerSelected = EnumHeaderFilter.headerNamed;
    //Xu ly cho sub one
    data.idRender = Math.random().toString(36).substring(2, 9);
    data.headerSelected = headerSelected.toLowerCase();
    data.subOneConditionSelected = '';
    data.subTwoConditionSelected = '';
    data.subThreeConditionSelected = '';
    data.showInputSubOne = false;
    data.showInputSubTwo = false;
    data.showInputSubThree = false;
    data.headerList = [...dataForFilterRuleSelected.headerList];
    data.subOneConditionList = {} as SubCondition;
    data.subTwoConditionList = {} as SubCondition;
    data.subThreeConditionList = {} as SubCondition;
    //set to list
    filterTestDetailList.push(data);
}

export function setDataByEditFilterRuleForHeaderAction(data: FilterActionDetails, key: string, dataForFilterRuleSelected: any, filterActionDetailsList: FilterActionDetails[]) {
    //Xu ly cho value header action
    let headerSelected = EnumHeaderFilter.keepInInbox;
    if( key === 'actionKeep') headerSelected = EnumHeaderFilter.keepInInbox;
    else if( key === 'actionDiscard') headerSelected = EnumHeaderFilter.discard;
    else if( key === 'actionFileInto') headerSelected = EnumHeaderFilter.moveIntoFolder;
    else if( key === 'actionFlag') headerSelected = EnumHeaderFilter.markAs;
    else if( key === 'actionRedirect') headerSelected = EnumHeaderFilter.redirectToAddress;
    else if( key === 'actionTag') headerSelected = EnumHeaderFilter.tagWith;
    //Xu ly cho sub one
    data.idRender = Math.random().toString(36).substring(2, 9);
    data.headerActionSelected = headerSelected.toLowerCase();
    data.subActionSelected = '';
    data.showInputSubAction = false;
    data.headerActionList = [...dataForFilterRuleSelected.headerActionList];
    data.subActionConditionList = {} as SubCondition;
    //set to list
    filterActionDetailsList.push(data);
}

export function dataSelectedByHeaderAction(item: FilterActionDetails, _key?: string) {
    //Xu ly cac header
    if(item.headerActionSelected === EnumHeaderFilter.moveIntoFolder){
        //set value cho sub one
        item.subActionSelected = item.folderPath;
    }
    else if(item.headerActionSelected === EnumHeaderFilter.tagWith){
        //set value cho sub one
        item.subActionSelected = item.tagName;
    }
    else if(item.headerActionSelected === EnumHeaderFilter.markAs){
        //set value cho sub one
        item.subActionSelected = item.flagName;
    }
    else if(item.headerActionSelected === EnumHeaderFilter.redirectToAddress){
        //set value cho sub one
        item.subActionSelected = item.a;
    }
}

export function dataSelectedByHeaderFromToSubject(filterTest: FilterTestDetails) {
    //Xu ly cac header: from -> subject
    if (filterTest.headerSelected === EnumHeaderFilter.from || filterTest.headerSelected === EnumHeaderFilter.to || filterTest.headerSelected === EnumHeaderFilter.cc || filterTest.headerSelected === EnumHeaderFilter.toCc || filterTest.headerSelected === EnumHeaderFilter.subject) {
        //set value cho sub one
        if(filterTest.stringComparison === EnumValueForSelected.is && !filterTest.negative){
            filterTest.subOneConditionSelected = EnumValueForSelected.matchExactly;
        }
        else if(filterTest.stringComparison === EnumValueForSelected.is && filterTest.negative){
            filterTest.subOneConditionSelected = EnumValueForSelected.doNotMatchExactly;
        }
        else if(filterTest.stringComparison === EnumValueForSelected.contains && !filterTest.negative){
            filterTest.subOneConditionSelected = EnumValueForSelected.contains;
        }
        else if(filterTest.stringComparison === EnumValueForSelected.contains && filterTest.negative){
            filterTest.subOneConditionSelected = EnumValueForSelected.doNotContains;
        }
        else if(filterTest.stringComparison === EnumValueForSelected.matchWildcardCondition && !filterTest.negative){
            filterTest.subOneConditionSelected = EnumValueForSelected.matchWildcardCondition;
        }
        else if(filterTest.stringComparison === EnumValueForSelected.matchWildcardCondition && filterTest.negative){
            filterTest.subOneConditionSelected = EnumValueForSelected.doNotMatchWildcardCondition;
        }
        //set value cho sub two
        filterTest.subTwoConditionSelected = filterTest.value;
        //set value cho sub three
        if(filterTest.part) filterTest.subThreeConditionSelected = filterTest.part;
    }
}

export function dataSelectedByHeaderMessage(item: FilterTestDetails, key?: string) {
    //Xu ly cac header: message
    if(item.headerSelected === EnumHeaderFilter.message){
        //set value cho sub one
        item.subOneConditionSelected = item.negative ? EnumValueForSelected.isNot : EnumValueForSelected.is;
        //set value cho sub two
        if(item.where === EnumValueForSelected.inConversationIStarted || item.where === EnumValueForSelected.inConversationIParticipated){
            item.subTwoConditionSelected = item.where;
        }
        else if(key === 'bulkTest'){
            item.subTwoConditionSelected = EnumValueForSelected.massMarketing;
        }
        else if(key === 'listTest'){
            item.subTwoConditionSelected = EnumValueForSelected.fromDistributionList;
        }
        else if(key === 'importanceTest' || item.flagName === EnumValueForSelected.read || item.flagName === EnumValueForSelected.priority){
            item.subTwoConditionSelected = EnumValueForSelected.markAs;
        }
        else if(item.flagName === EnumValueForSelected.flagged){
            item.subTwoConditionSelected = EnumValueForSelected.flagged;
        }
        //set value cho sub three
        if(item.imp){
            item.subThreeConditionSelected = item.imp;
        }
        else if(key === 'flaggedTest' && item.flagName === EnumValueForSelected.read){
            item.subThreeConditionSelected = EnumValueForSelected.read;
        }
        else if(key === 'flaggedTest' && item.flagName === EnumValueForSelected.priority){
            item.subThreeConditionSelected = EnumValueForSelected.priority;
        }
    }
}

export function dataSelectedByHeaderSize(item: FilterTestDetails, _key?: string) {
    //Xu ly cac header: size
    if(item.headerSelected === EnumHeaderFilter.size){
        //set value cho sub one
        if(item.numberComparison === EnumValueForSelected.under && !item.negative){
            item.subOneConditionSelected = EnumValueForSelected.under;
        }
        else if(item.numberComparison === EnumValueForSelected.under && item.negative){
            item.subOneConditionSelected = EnumValueForSelected.doNotUnder;
        }
        else if(item.numberComparison === EnumValueForSelected.over && !item.negative){
            item.subOneConditionSelected = EnumValueForSelected.over;
        }
        else if(item.numberComparison === EnumValueForSelected.over && item.negative){
            item.subOneConditionSelected = EnumValueForSelected.doNotOver;
        }
        //set value cho sub two
        if(item.s){
            item.subTwoConditionSelected = item.s.replace("K", "").replace("M", "").replace("G", "");
        }
        //set value cho sub three
        if(item.s){
            const getLastCharacter = item.s.substring(item.s.length - 1);
            if(getLastCharacter === EnumValueForSelected.kb){
                item.subThreeConditionSelected = EnumValueForSelected.kb;
            }
            else if(getLastCharacter === EnumValueForSelected.mb){
                item.subThreeConditionSelected = EnumValueForSelected.mb;
            }
            else if(getLastCharacter === EnumValueForSelected.gb){
                item.subThreeConditionSelected = EnumValueForSelected.gb;
            }
            else{
                item.subThreeConditionSelected = EnumValueForSelected.b;
            }
        }
    }
}

export function dataSelectedByHeaderDate(item: FilterTestDetails, _key?: string) {
    //Xu ly cac header: size
    if(item.headerSelected === EnumHeaderFilter.date){
        //set value cho sub one
        if(item.dateComparison === EnumValueForSelected.before && item.negative){
            item.subOneConditionSelected = EnumValueForSelected.doNotBefore;
        }
        else if(item.dateComparison === EnumValueForSelected.before && !item.negative){
            item.subOneConditionSelected = EnumValueForSelected.before;
        }
        else if(item.dateComparison === EnumValueForSelected.after && item.negative){
            item.subOneConditionSelected = EnumValueForSelected.doNotAfter;
        }
        else if(item.dateComparison === EnumValueForSelected.after && !item.negative){
            item.subOneConditionSelected = EnumValueForSelected.after;
        }
        //set value cho sub two
        if(item.d > 0){
            const date = new Date();
            date.setTime(item.d * 1000);
            item.subTwoConditionSelected = helper.formatDate(date.toString(), env.dateFormat);
        }
        //set value cho sub three - nothing
    }
}

export function dataSelectedByHeaderBody(item: FilterTestDetails, _key?: string) {
    //Xu ly cac header: size
    if(item.headerSelected === EnumHeaderFilter.body){
        //set value cho sub one
        if(item.negative){
            item.subOneConditionSelected = EnumValueForSelected.doNotContains;
        }
        else if(!item.negative){
            item.subOneConditionSelected = EnumValueForSelected.contains;
        }
        //set value cho sub two
        item.subTwoConditionSelected = item.value;
        //set value cho sub three - nothing
    }
}

export function dataSelectedByHeaderAttachmentToReadReceipt(item: FilterTestDetails, _key?: string) {
    //Xu ly cac header: size
    if(item.headerSelected === EnumHeaderFilter.attachment || item.headerSelected === EnumHeaderFilter.readReceipt){
        //set value cho sub one
        if(item.negative){
            item.subOneConditionSelected = EnumValueForSelected.notExists;
        }
        else if(!item.negative){
            item.subOneConditionSelected = EnumValueForSelected.exists;
        }
        //set value cho sub two - nothing
        //set value cho sub three - nothing
    }
}

export function dataSelectedByHeaderAddressIn(item: FilterTestDetails, key?: string) {
    //Xu ly cac header: addressIn
    if(item.headerSelected === EnumHeaderFilter.addressIn){
        //set value cho sub one
        item.subOneConditionSelected = item.header.toLowerCase();
        //set value cho sub two
        if((key === 'addressBookTest' || key === 'contactRankingTest') && item.negative){
            item.subTwoConditionSelected = EnumValueForSelected.notIn;
        }
        else if((key === 'addressBookTest' || key === 'contactRankingTest') && !item.negative){
            item.subTwoConditionSelected = EnumValueForSelected.in;
        }
        else if(key === 'meTest' && item.negative){
            item.subTwoConditionSelected = EnumValueForSelected.isNotMe;
        }
        else if(key === 'meTest' && !item.negative){
            item.subTwoConditionSelected = EnumValueForSelected.isMe;
        }
        //set value cho sub three
        if(key === 'addressBookTest'){
            item.subThreeConditionSelected = EnumValueForSelected.contacts;
        }
        else if(key === 'contactRankingTest'){
            item.subThreeConditionSelected = EnumValueForSelected.frequentEmail;
        }
    }
}

export function dataSelectedByHeaderCalendar(item: FilterTestDetails, _key?: string) {
    //Xu ly cac header: size
    if(item.headerSelected === EnumHeaderFilter.calendar){
        //set value cho sub one
        if(item.method && item.method.length > 0 && item.method[0]._content === EnumValueForSelected.inviteRequested && !item.negative){
            item.subOneConditionSelected = EnumValueForSelected.inviteRequested;
        }
        else if(item.method && item.method.length > 0 && item.method[0]._content === EnumValueForSelected.inviteRequested && item.negative){
            item.subOneConditionSelected = EnumValueForSelected.inviteNotRequested;
        }
        if(item.method && item.method.length > 0 && item.method[0]._content === EnumValueForSelected.inviteReplied && !item.negative){
            item.subOneConditionSelected = EnumValueForSelected.inviteReplied;
        }
        else if(item.method && item.method.length > 0 && item.method[0]._content === EnumValueForSelected.inviteReplied && item.negative){
            item.subOneConditionSelected = EnumValueForSelected.inviteNotReplied;
        }
        //set value cho sub two - nothing
        //set value cho sub three - nothing
    }
}

export function dataSelectedByHeaderSocial(item: FilterTestDetails, key?: string) {
    //Xu ly cac header: size
    if(item.headerSelected === EnumHeaderFilter.social){
        //set value cho sub one
        if(key === 'facebookTest'){
            item.subOneConditionSelected = EnumValueForSelected.facebookNotification;
        }
        else if(key === 'linkedinTest'){
            item.subOneConditionSelected = EnumValueForSelected.linkedInNotification;
        }
        else if(key === 'twitterTest'){
            item.subOneConditionSelected = EnumValueForSelected.twitterNotification;
        }
        //set value cho sub two - nothing
        //set value cho sub three - nothing
    }
}

export function dataSelectedByHeaderNamed(item: FilterTestDetails, key?: string) {
    //Xu ly cac header: size
    if(item.headerSelected === EnumHeaderFilter.headerNamed){
        //set value cho sub one
        item.subOneConditionSelected = item.header;
        //set value cho sub two
        if(key === 'headerExistsTest'){
            if(item.negative){
                item.subTwoConditionSelected = EnumValueForSelected.notExists;
            }
            else if(!item.negative){
                item.subTwoConditionSelected = EnumValueForSelected.exists;
            }
        }
        else if(key === 'headerTest'){
            if(item.stringComparison === EnumValueForSelected.is && item.negative){
                item.subTwoConditionSelected = EnumValueForSelected.doNotMatchExactly;
            }
            else if(item.stringComparison === EnumValueForSelected.is && !item.negative){
                item.subTwoConditionSelected = EnumValueForSelected.matchExactly;
            }
            else if(item.stringComparison === EnumValueForSelected.contains && item.negative){
                item.subTwoConditionSelected = EnumValueForSelected.doNotContains;
            }
            else if(item.stringComparison === EnumValueForSelected.contains && !item.negative){
                item.subTwoConditionSelected = EnumValueForSelected.contains;
            }
            else if(item.stringComparison === EnumValueForSelected.matchWildcardCondition && item.negative){
                item.subTwoConditionSelected = EnumValueForSelected.doNotMatchWildcardCondition;
            }
            else if(item.stringComparison === EnumValueForSelected.matchWildcardCondition && !item.negative){
                item.subTwoConditionSelected = EnumValueForSelected.matchWildcardCondition;
            }
        }
        //set value cho sub three
        item.subThreeConditionSelected = item.value;
    }
}