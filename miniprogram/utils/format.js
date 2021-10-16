const INVALID_DATE = 'Invalid Date';
export function formatDate(date, fmt = 'YYYY-MM-DD') {
  if (typeof date === 'number' || typeof date === 'string') {
    date = new Date(date);
  }
  if (date.toString() === INVALID_DATE) {
    return INVALID_DATE;
  }
  var o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    S: date.getMilliseconds(),
  };
  if (/(Y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
}
