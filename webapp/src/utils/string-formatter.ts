export function formatString(str: string, params: any) {
  if (!params) {
    return str;
  }
  for (const key in params) {
    str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), params[key]);
  }
  return str;
}

export function addDotsInsideTooLongString(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 6) + "..." + text.substring(text.length - 5);
  }
  return text;
}
