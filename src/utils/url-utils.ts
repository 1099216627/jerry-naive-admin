/**
 * 将对象添加当作参数拼接到URL上面
 * @param baseUrl 需要拼接的url
 * @param obj 参数对象
 * @returns {string} 拼接后的对象
 * 例子:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: object): string {
  let parameters = "";
  let url = "";
  for (const key in obj) {
    parameters += key + "=" + encodeURIComponent(obj[key]) + "&";
  }
  parameters = parameters.replace(/&$/, "");
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters;
  } else {
    url = baseUrl.replace(/\/?$/, "?") + parameters;
  }
  return url;
}
//去除对象中的空值
export function removeEmptyValue(obj: object): any {
  const newObj = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
