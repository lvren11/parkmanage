// 解析日期
export function getBirth(cellValue) {
  if (cellValue == null || cellValue == "") return "";
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return year + "-" + month + "-" + day;
}

// 解析歌词
export function parseLyric(text) {
  const lines = text.split("\n");
  const pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
  const result = [];

  // 对于歌词格式不对的特殊处理
  if (!/\[.+\]/.test(text)) {
    return [text];
  }
  for (const item of lines) {
    if (pattern.test(item)) {
      const value = item.replace(pattern, ""); // 存歌词
      result.push(value);
    }
  }
  return result;
}

export function getTenantStatus(code: string): string {
  switch (code) {
    case 'd':
      return '临时租户';
    case 'm':
      return '月租租户';
    case 'j':
      return '季租租户';
    case 'y':
      return '年租租户';
    default:
      return ''; // 或者抛出异常
  }
}

export function changeState(state) {
  switch (state) {
    case 0:
      return "待审核";
    case -1:
      return "未通过";
    case 1:
      return "一般严重";
    case 2:
      return "非常严重";
    default:
      return "未知状态";
  }
}

export function getStatusText(code) {
  return code === 0 ? '空闲' : '租赁中';
}

export function dataformat(dateString){
  const dateTime = new Date(dateString);

  const year = dateTime.getFullYear();
  const month = ('0' + (dateTime.getMonth() + 1)).slice(-2); // 月份从 0 开始，所以要加 1
  const day = ('0' + dateTime.getDate()).slice(-2);
  const hours = ('0' + dateTime.getHours()).slice(-2);
  const minutes = ('0' + dateTime.getMinutes()).slice(-2);
  const seconds = ('0' + dateTime.getSeconds()).slice(-2);
  const milliseconds = ('00' + dateTime.getMilliseconds()).slice(-3);
  const timezoneOffset = dateTime.getTimezoneOffset();
  const timezoneOffsetSign = timezoneOffset > 0 ? '-' : '+';
  const timezoneOffsetHours = ('0' + Math.abs(Math.floor(timezoneOffset / 60))).slice(-2);
  const timezoneOffsetMinutes = ('0' + Math.abs(timezoneOffset % 60)).slice(-2);

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;

}
