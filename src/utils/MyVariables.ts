const nameCookie = import.meta.env.VITE_NAME_COOKIE;
const nameAdminCookie = import.meta.env.VITE_NAME_ADMIN_COOKIE;
const serverUrl = import.meta.env.VITE_SERVER_URL;

//Setup môi trường
export const env = {
    hostServer: serverUrl,
    nameCookie: nameCookie,
    nameAdminCookie: nameAdminCookie,
    dateTimeFormat: 'DD/MM/YYYY hh:mm:ss A',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm A',
    litePickerOption: {
        autoApply: false,
        singleMode: false,
        numberOfColumns: 2,
        numberOfMonths: 2,
        showWeekNumbers: true,
        dropdowns: {
            minYear: 1990,
            maxYear: null,
            months: true,
            years: true,
        },
    },
};

export const VALUE_EXISTED = "Dữ liệu đã tồn tại";
export const REQUIRED = "Vui lòng không bỏ trống ô này";
export const NOT_MATCH_PASSWORD = "Xác nhận mật khẩu không chính xác";
export const NOT_VALUES = "Không có dữ liệu";
export const INVALID_NAME = "Tên không hợp lệ";
export const INVALID_MIN_NUMBER = "Dữ liệu nhập không được nhỏ hơn 0";
export const INVALID_OPTION_SELECT = "Dữ liệu đang chọn không hợp lệ";
export const RANGE_PAGE_SIZE = [10, 30, 100, 500];
//export const RANGE_PAGE_SIZE = [1, 3, 10, 50];
export const VALUE_STATUS_ACCOUNT = [
    {name: 'allStatus', value: 'all'},
    {name: 'active', value: 'active'},
    {name: 'locked', value: 'locked'}];
export const VALUE_NO_ALL_STATUS_ACCOUNT = [
    {name: 'active', value: 'active'},
    {name: 'locked', value: 'locked'},];
export const VALUE_STATUS_DISTRIBUTION = [
    {name: 'enabled', value: 'enabled'},
    {name: 'disabled', value: 'disabled'}];
export const regexOnlyLetterAndNumber = new RegExp("^[a-zA-Z0-9-_]+$");
export const regexOnlyNumber = new RegExp("^[0-9]+$");
export const DEFAULT_COLOR = "#7c3aed";
export const TRANSPARENT_COLOR = "#00FFFF00";
export const ROLE_DATA = {
    none: "",
    read: "r",
    readEditAddRemove: "rwidx",
    readEditAddRemoveAdmin: "rwidxa",
}
//value who object mail gateway
export const inDeny = "_in_deny"; //not translate
export const outDeny = "_out_deny"; //not translate
export const inWhitelist = "_in_whitelist"; //not translate
//value type who detail
// export const regularExpression = dict_vn_admin.regularExpression;
export const regularExpression = 'Regular Expression'; //not translate
export const mailAddress = 'Mail address'; //not translate
export const domain = 'Domain'; //not translate
export const ipAddress = 'IP Address'; //not translate
//value for mode theme
export const modeLogo = {  //not translate
    lightMode: 'light-mode',
    darkMode: 'dark-mode',
}
export const toolBarEditor = {
    items: [
        'heading',
        '|',
        'bold',
        'italic',
        '|',
        'link',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells',
        '|',
        'outdent',
        'indent',
        '|',
        'uploadImage',
        'blockQuote',
        '|',
        'undo',
        'redo',
    ],
    shouldNotGroupWhenFull: true
}

// Begin HungHv: Bảng đối chiếu songg ngữ query search trong component TopBarSearch
export const queryTranslte = {
    'has:attachment': [' *Has attachment', ' *Có tệp tin đính kèm'],
    'is:flagged': [' *Flagged', ' *Được gắn cờ'],
    'is:unread': [' *Unread', ' *Chưa đọc'],
    'is:draft': [' *Draft', ' *Bản nháp'],
    'is:received': [' *Received by me', ' *Nhận bởi tôi'],
    'is:unreplied': [' *Unreplied by me', ' *Không được trả lời bởi tôi'],
    'is:unforwarded': [' *Unforwarded', ' *Chưa chuyển tiếp'],
    'is:solo': [' *Solo', ' *Cuộc đàm thoại bởi một thư'],
    'is:fromme': [' *From me', ' *Từ tôi'],
    'is:tofromme': [' *To from me', ' *Tới hoặc từ tôi'],
    'is:fromccme': [' *From CC me', ' *Từ hoặc CC cho tôi'],
    'is:local': [' *In one of my folders', ' *Trong một các thư mục của tôi'],
    'is:anywhere': [' *In any folder', ' *Trong thư mục bất kỳ'],
    'is:read': [' *Read', ' *Đã đọc'],
    'is:notflagged': [' *Not flagged', ' *Chưa gắn cờ'],
    'is:sent': [' *Sent by me', ' *Được gửi bởi tôi'],
    'is:replied': [' *Replied by me', ' *Được trả lời bởi tôi'],
    'is:forwarded': [' *Forwarded', ' *Đã chuyển tiếp'],
    'is:invite': [' *Invite', ' *Mời'],
    'is:tome': [' *To me', ' *Tới tôi'],
    'is:ccme': [' *CC me', ' *CC cho tôi'],
    'is:toccme': [' *To CC me', ' *Tới hoặc CC cho tôi'],
    'is:tofromccme': [' *To from CC me', ' *Tới, từ hoặc CC cho tôi'],
    'is:remote': [' *In one of the folders shared with me', ' *Trong một các thư mục chia sẻ với tôi'],
    'attachment:application/pdf': [' *Attached file is Adobe PDF', ' *Có tệp đính kèm là Adobe PDF'],
    'attachment:application/*': [' *Attached file is application', ' *Có tệp đính kèm là ứng dụng'],
    'attachment:image/*': [' *Attached file is image', ' *Có tệp đính kèm là hình ảnh'],
    'attachment:message/rfc822': [' *Attached file is mail', ' *Có tệp đính kèm là thư'],
    'attachment:excel': [' *Attached file is Microsoft Excel', ' *Có tệp đính kèm là Microsoft Excel'],
    'attachment:text': [' *Attached file is text Document', ' *Có tệp đính kèm là tài liệu văn bản'],
    'from:': [' *Received from: ', '*Đã nhận từ: '],
    'to:': [' *Sent to: ', ' *Đã gửi từ: '],
    'before:': [' *Sent before: ', ' *Gửi trước ngày: '],
    'after:': [' *Sent after: ', ' *Gửi sau ngày: '],
    'date:': [' *Date: ', ' *Ngày gửi: '],
    'larger:': [' *File size larger than: ', ' *Kích thước File lớn hơn: '],
    'smaller': [' *File size smaller than: ', ' *Kích thước File nhỏ hơn: '],
    'tag:': [' *Tag: ', ' *Thẻ: '],
    'in:': [' *In Folder: ', ' *Trong thư mục: '],
    '"/"': ['Root', 'Thư mục gốc'],
    '"/inbox"': ['Inbox', 'Hộp thư đến'],
    '"/sent"': ['Sent', 'Gửi đi'],
    '"/drafts"': ['Drafts', 'Thư nháp'],
    '"/junk"': ['Spam', 'Thư rác'],
    'trash': ['Trash', 'Thùng rác'],
    'contacts': ['Contacts', 'Liên hệ'],
    '"Emailed Contacts"': ['Emailed Contacts', 'Email từng liên hệ']
}

export const exampleQueryTranslate = [
    'has:attachment',
    'is:flagged',
    'is:unread',
    'is:draft',
    'is:received',
    'is:unreplied',
    'is:unforwarded',
    'is:solo',
    'is:fromme',
    'is:tofromme',
    'is:fromccme',
    'is:local',
    'is:anywhere',
    'is:read',
    'is:notflagged',
    'is:sent',
    'is:replied',
    'is:forwarded',
    'is:invite',
    'is:tome',
    'is:ccme',
    'is:toccme',
    'is:tofromccme',
    'is:remote',
    'attachment:application/pdf',
    'attachment:application/*',
    'attachment:image/*',
    'attachment:message/rfc822',
    'attachment:excel',
    'attachment:text',
    'from:',
    'to:',
    'before:',
    'after:',
    'date:',
    'larger:',
    'smaller',
    'tag:',
    'in:',
    '"/"',
    '"/inbox"',
    '"/sent"',
    '"/drafts"',
    '"/junk"',
    'trash',
    'contacts',
    '"Emailed Contacts"'
]
// End HungHv: Bảng đối chiếu songg ngữ query search trong component TopBarSearch

// Begin Bảng các trạng thái của conversation search
export const advancedFilterSearch = [
    'is:draft',
    'is:received',
    'is:unreplied',
    'is:unforwarded',
    'is:solo',
    'is:fromme',
    'is:tofromme',
    'is:fromccme',
    'is:local',
    'is:anywhere',
    'is:read',
    'is:notflagged',
    'is:sent',
    'is:replied',
    'is:forwarded',
    'is:invite',
    'is:tome',
    'is:ccme',
    'is:toccme',
    'is:tofromccme',
    'is:remote',
]
// End Bảng các trạng thái của conversation search