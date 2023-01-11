import { apiClient } from '@/http-common';
import { Folder } from '@/model/Folder';

class FolderService {
  find(data: Folder, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/folder/find', data);
  }

  listCreateFolder(data: Folder, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/folder/list-create-folder', data);
  }

  createFolder(data: Folder, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/folder/create', data);
  }

  getArrayFolder(data: Folder, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/folder/get-array', data);
  }
}

export default new FolderService();
