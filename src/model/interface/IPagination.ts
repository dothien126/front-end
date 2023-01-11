export interface IPagination {
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    preNumber: number; //số trang phía trước trang hiện tại
    number: number; //số trang hiện tại đang chọn
    nextNumber: number; //số trang tiếp theo trang hiện tại
    //sort
    sortBy: string;
    sortAscending: string;
    //filter
    query: string;
}