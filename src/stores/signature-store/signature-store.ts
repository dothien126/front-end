import {defineStore} from "pinia";
import {MyStore} from "@/stores/my-store";
import {computed, ref} from "vue";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {Signature} from "@/model/Signature";
import SignatureService from "@/service/SignatureService";
// import {SPACE_SIGNATURE_BOTTOM, SPACE_SIGNATURE_TOP} from "@/utils/MyVariables";

export const SignatureStore = defineStore('signatureStore', () => {
    //init value
    const myStore = MyStore();
    const myUser = computed(() => myStore.myUser);
    const mySignatureList = ref<Signature[]>([]);
    const mySignatureForNewMail = ref<Signature>(new Signature());
    const mySignatureForReply = ref<Signature>(new Signature());

    // Lay danh sach signature
    async function initGetSignatureList() {
        //reset value
        mySignatureList.value = [];
        //init request
        const itemFind = new Signature();
        //call request
        const response = await SignatureService.getSignature(itemFind, myStore.token);
        if (response.data) {
            const responseData: ResponseData = response.data;
            //Kiểm tra backend có trả error ko
            if (responseData.values.error) {
                // Set thông báo thất bại
                showToastMessage(responseData.values.error, true);
            } else {
                const datas = responseData.values as Signature[];
                mySignatureList.value.push(...datas);
            }
        } else {
            showToastMessage(undefined, true);
        }

    }

    // lay chu ky dang su dung cho new mail or reply forward
    function initGetSignatureForNewMailOrReply(){
        //reset value
        mySignatureForNewMail.value = new Signature();
        mySignatureForReply.value = new Signature();
        //logic
        if(mySignatureList.value.length > 0){
            const hasSignatureNewMail = mySignatureList.value.find(value => value.id === myUser.value.defaultSignatureId);
            if(hasSignatureNewMail){
                mySignatureForNewMail.value = hasSignatureNewMail;
                mySignatureForNewMail.value.contentDisplay = calculatorSignatureForNewMailAndReply(hasSignatureNewMail);
            }
            const hasSignatureReply = mySignatureList.value.find(value => value.id === myUser.value.forwardReplySignatureId);
            if(hasSignatureReply){
                mySignatureForReply.value = hasSignatureReply;
                mySignatureForReply.value.contentDisplay = calculatorSignatureForNewMailAndReply(hasSignatureReply);
            }
        }
    }
    function calculatorSignatureForNewMailAndReply(signature: Signature){
        //ưu tiên lấy định dạng html
        let contentSignature = '';
        if(signature.content && signature.content.length > 0){
            for(const item of signature.content){
                if(item.type === 'text/html'){
                    contentSignature = item.content;
                    break;
                }
                else{
                    contentSignature = item.content;
                }
            }
        }
        return contentSignature;
    }

    return {
        mySignatureList,
        mySignatureForNewMail,
        mySignatureForReply,
        initGetSignatureList,
        initGetSignatureForNewMailOrReply,
    }
});
