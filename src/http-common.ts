import axios, { AxiosInstance } from 'axios';
import { env } from '@/utils/MyVariables';

export function apiClient(cookie: string): AxiosInstance {
  return axios.create({
    baseURL: env.hostServer,
    headers: { 'Content-Type': 'application/json', 'jwt-zimbra-client': cookie },
  });
}

export function apiAdmin(jwt: string): AxiosInstance {
  return axios.create({
    baseURL: env.hostServer,
    headers: { 'Content-Type': 'application/json', 'jwt-zimbra-admin': jwt },
  });
}
