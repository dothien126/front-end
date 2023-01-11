export class ToastMessageDto {
  title = '';
  content = '';
  type = '';
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
      success: 'text-success',
      danger: 'text-danger',
    },
  };
}
