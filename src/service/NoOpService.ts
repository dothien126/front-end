import { apiClient} from "@/http-common";

class NoOpService {
    noOpRequest(jwt: string): Promise<any> {
        return apiClient(jwt).post('api/user/no-op');
    }
}

export default new NoOpService();