export function formatString(str: string, params: any) {
  if (!params) {
    return str;
  }
  for (const key in params) {
    str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), params[key]);
  }
  return str;
}