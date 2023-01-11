export class ComposeMessageDto{
    id = ''; //id trên DOM
    showHide = true;
    minusCompose = true;
    fullScreenCompose = false;
    fullscreenActive = false;
    divSendLater: any; //send later
    interValDisplayTime: any; //send later
    interValCloseSendLater: any;
    indexRender = 0; //send later
    timeCalculatorSendLater = new Date(); //send later
    showModalSendLater = false; //send later
    cancelSendLater = false; //send later
    sendLaterSuccess = false; //send later
    timeDisplaySendLater = 0; //send later
}