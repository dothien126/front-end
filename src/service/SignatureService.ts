import { apiClient } from '@/http-common';
import {Signature} from "@/model/Signature";

class SignatureService {
  getSignature(data: Signature, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/signature/get', data);
  }
  createSignature(data: Signature, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/signature/create', data);
  }
  modifySignature(data: Signature, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/signature/modify', data);
  }
  deleteSignature(data: Signature, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/signature/delete', data);
  }
}

export default new SignatureService();
