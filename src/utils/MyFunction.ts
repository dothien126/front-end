import { MyStore } from '@/stores/my-store';
import {RequestNoResponse} from "@/model/RequestNoResponse";
import {ResponseData} from "@/model/ResponseData";
import ConversationService from "@/service/ConversationService";
import ConversationDetailService from "@/service/ConversationDetailService";
import {ToasitfyMessage} from "@/model/dto/ToasitfyMessageDto";
import {Fault} from "@/model/Fault";
import {computed} from "vue";
import dayjs from "dayjs";
import {ItemTag} from "@/model/ConversationDetail";

export function isEmailValid(email: string) {
  const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  if (!email)
    return false;

  if(email.length>254)
    return false;

  const valid = emailRegex.test(email);
  if(!valid)
    return false;

  // Further checking of some things regex can't handle
  const parts = email.split("@");
  if(parts[0].length>64)
    return false;

  const domainParts = parts[1].split(".");
  return !domainParts.some(function (part) {
    return part.length > 63;
  });
}

export function showToastMessage(content?: string, error?: boolean, details?: Fault[]) {
  //init value
  const message = new ToasitfyMessage();
  const myStore = MyStore();
  //Set giá trị thông báo
  if (error) {
    message.title = myStore.locale.alertError;
    message.content = content ? content : message.alert.content.error;
    message.type = message.alert.class.danger;
    message.details = details ? details : message.details;
    message.class = error;
  } else {
    message.title = myStore.locale.alertSuccess;
    message.content = content ? content : message.alert.content.success;
    message.type = message.alert.class.success;
    message.details = details ? details : message.details;
  }
  myStore.showMessage = message;
}

export async function actionConversation(itemID: string, op: string, tcon?: string, itemTag?: ItemTag) {
  //init value
  let main = true;
  const myStore = MyStore();
  //init request
  const itemFind = new RequestNoResponse();
  itemFind.itemId = itemID;
  itemFind.operation = op;
  if(tcon) itemFind.tcon = tcon;
  if(itemTag) itemFind.tagName = itemTag.name;
  //call request
  const response = await ConversationService.action(itemFind, myStore.token);
  if (response.data) {
    const responseData: ResponseData = response.data;
    //Kiểm tra backend có trả error ko
    if (responseData.values.error) {
      // Set thông báo thất bại
      main = false; showToastMessage(responseData.values.error, true);
    }
  } else {
    showToastMessage(undefined, true);
  }
  return main;
}

export async function actionConversationDetail(itemID: string, op: string, itemTag?: ItemTag, reload?: boolean) {
  //init value
  let main = true;
  const myStore = MyStore();
  //init request
  const itemFind = new RequestNoResponse();
  itemFind.messageId = itemID;
  itemFind.operation = op;
  if(itemTag) itemFind.tagName = itemTag.name;
  //call request
  const response = await ConversationDetailService.action(itemFind, myStore.token);
  if (response.data) {
    const responseData: ResponseData = response.data;
    //Kiểm tra backend có trả error ko
    if (responseData.values.error) {
      // Set thông báo thất bại
      main = false; showToastMessage(responseData.values.error, true);
    } else {
      //reload
      if(reload){
        // Xử lý tag trong conversation
      }
    }
  } else {
    showToastMessage(undefined, true);
  }
  return main;
}

function ColorToHex(color: string) {
  const hexadecimal = parseInt(color, 10).toString(16);
  return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

export function convertRGBtoHex(rgb: string) {
  //init value color
  const red = rgb.split(',').length > 0 ? rgb.split(',')[0] : '';
  const green = rgb.split(',').length > 0 ? rgb.split(',')[1] : '';
  const blue = rgb.split(',').length > 0 ? rgb.split(',')[2] : '';
  if(red && green && blue){
    return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
  }
  else{
    return "#94a3b8";
  }
}

export function convertHtmlToPlainText(html) {
  let divContainer= document.createElement("div");
  divContainer.innerHTML = html;
  return divContainer.textContent || divContainer.innerText || "";
}

export function timeAgo(time) {
  const myStore = MyStore();
  const locale = computed(() => myStore.locale);
  // const date = new Date((time || '').replace(/-/g, '/').replace(/[TZ]/g, ' '));
  const date = new Date(time || '');
  const diff = (new Date().getTime() - date.getTime()) / 1000;
  const dayDiff = Math.floor(diff / 86400);

  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return dayjs(time).format('DD/MM/YYYY');
  }

  return (
      (dayDiff === 0 &&
          ((diff < 60 && locale.value.justNow) ||
              (diff < 120 && locale.value.oneMinuteAgo) ||
              (diff < 3600 && Math.floor(diff / 60) + ' ' + locale.value.minuteAgo) ||
              (diff < 7200 && locale.value.oneHourAgo) ||
              (diff < 86400 && Math.floor(diff / 3600) + ' ' + locale.value.hourAgo))) ||
      (dayDiff === 1 && locale.value.yesterday) ||
      (dayDiff < 7 && dayDiff + ' ' + locale.value.dayAgo) ||
      (dayDiff < 31 && Math.ceil(dayDiff / 7) + ' ' + locale.value.weekAgo)
  );
}

export function genPassword(){
  const length = 10;
  const string = "abcdefghijklmnopqrstuvwxyz";
  const numeric = "0123456789";
  const punctuation = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let character = "";
  let password = "";
  while (password.length < length) {
    const entity1 = Math.ceil(
        string.length * Math.random() * Math.random()
    );
    const entity2 = Math.ceil(
        numeric.length * Math.random() * Math.random()
    );
    const entity3 = Math.ceil(
        punctuation.length * Math.random() * Math.random()
    );
    let hold = string.charAt(entity1);
    hold = password.length % 2 === 0 ? hold.toUpperCase() : hold;
    character += hold;
    character += numeric.charAt(entity2);
    character += punctuation.charAt(entity3);
    password = character;
  }
  password = password
      .split("")
      .sort(() => {
        return 0.5 - Math.random();
      })
      .join("");
  return password.substr(0, length);
}

export function percentageUse(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}

export function lastLoginIsValid(date: Date) {
  const dateCompare = new Date(date);
  const dateInvalid = new Date(0);
  return dateCompare.getFullYear() !== dateInvalid.getFullYear();
}

export function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g,"");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,"");
  return str;
}

export function tryParseJSONObject (jsonString){
  try {
    const o = JSON.parse(jsonString);
    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === "object") {
      return o;
    }
  }
  catch (e) { }

  return false;
}

export function toSlug(str) {
  // Chuyển hết sang chữ thường
  str = str.toLowerCase();

  // xóa dấu
  str = str
      .normalize('NFD') // chuyển chuỗi sang unicode tổ hợp
      .replace(/[\u0300-\u036f]/g, ''); // xóa các ký tự dấu sau khi tách tổ hợp

  // Thay ký tự đĐ
  str = str.replace(/[đĐ]/g, 'd');

  // Xóa ký tự đặc biệt
  str = str.replace(/([^0-9a-z-\s])/g, '');

  // Xóa khoảng trắng thay bằng ký tự -
  str = str.replace(/(\s+)/g, '-');

  // Xóa ký tự - liên tiếp
  str = str.replace(/-+/g, '-');

  // xóa phần dư - ở đầu & cuối
  str = str.replace(/^-+|-+$/g, '');

  // return
  return str;
}

export function PaginatorForArray(items: any[], pages: number, per_pages: number) {
  var page = pages || 1,
      per_page = per_pages || 10,
      offset = (page - 1) * per_page,

      paginatedItems = items.slice(offset).slice(0, per_page),
      total_pages = Math.ceil(items.length / per_page);
  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: (total_pages > page) ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems,
    offset: offset,
  };
}

export function removeMultiItemForArray(arrays, ...forDeletion) {
  return arrays.filter(item => !forDeletion.includes(item))
}