import {Fault} from "@/model/Fault";

export class ToasitfyMessage {
    title = '';
    content = '';
    type = '';
    class = false;
    details: Fault[] = [];
    alert = {
        title: {
            error: 'Tải thất bại!',
            success: 'Tải thành công!',
        },
        content: {
            error: 'Kiểm tra lại dữ liệu',
            success: 'Dữ liệu đã được tải',
        },
        class: {
            success: 'success',
            danger: 'danger',
        },
    };
}
