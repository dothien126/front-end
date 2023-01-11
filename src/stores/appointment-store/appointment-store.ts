import {defineStore} from "pinia";
import {MyStore} from "@/stores/my-store";
import {ref} from "vue";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {SearchRequest} from "@/model/SearchRequest";
import {Appt, IAppointment} from "@/model/interface/IAppointment";
import AppointmentService from "@/service/AppointmentService";
import {FolderStore} from "@/stores/folder-store/folder-store";
import {ICreateAppointmentResponse} from "@/model/interface/ICreateAppointmentResponse";

export const MyAppointmentStore = defineStore('myAppointmentStore', () => {
    //init value
    const myStore = MyStore();
    const folderStore = FolderStore();
    const bodyRequest = ref<SearchRequest>(new SearchRequest());
    const myAppointmentList = ref<IAppointment>({hasMore: false, itemList: [] as Appt[]} as IAppointment);
    const appointmendCreated = ref<ICreateAppointmentResponse>({apptId: '', _jsns: '', calItemId: '', rev: 0, ms: 0, invId: ''} as ICreateAppointmentResponse);
    function appointmentBodyRequest(item: SearchRequest) {
        bodyRequest.value = item;
    }

    async function getAppointment() {
        if (folderStore.calendarFolder.id && myStore.token) {
            const appointmentRequest = new SearchRequest();
            appointmentRequest.locale = myStore.myUser.language;
            appointmentRequest.sortBy = 'none';
            appointmentRequest.types = 'appointment';
            appointmentRequest.limit = '500';
            appointmentRequest.filter = 'inid:\"' + folderStore.calendarFolder.id + '\"';
            //set to body request
            appointmentBodyRequest(appointmentRequest);
            //call request
            await initGetAppointmentList();
        }
    }

    function setAppointmendCreated(data: ICreateAppointmentResponse){
        appointmendCreated.value = data;
    }

    // Lay danh sach filter rule
    async function initGetAppointmentList() {
        //reset value
        myAppointmentList.value.itemList = [];
        //call request
        const response = await AppointmentService.findByPageRequest(bodyRequest.value, myStore.token);
        if (response.data) {
            const responseData: ResponseData = response.data;
            //Kiểm tra backend có trả error ko
            if (responseData.values.error) {
                // Set thông báo thất bại
                showToastMessage(responseData.values.error, true);
            } else {
                myAppointmentList.value = responseData.values as IAppointment;
            }
        } else {
            showToastMessage(undefined, true);
        }
        return myAppointmentList.value;
    }

    return {
        bodyRequest,
        myAppointmentList,
        appointmendCreated,
        getAppointment,
        setAppointmendCreated,
    }
});