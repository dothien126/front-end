import { apiClient } from '@/http-common';
import {SearchRequest} from "@/model/SearchRequest";
import {ICreateAppointmentRequest} from "@/model/interface/ICreateAppointmentRequest";

class AppointmentService {
  findByPageRequest(data: SearchRequest, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/appointment/find-by-page', data);
  }
  createAppointment(data: ICreateAppointmentRequest, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/appointment/create', data);
  }
}

export default new AppointmentService();
