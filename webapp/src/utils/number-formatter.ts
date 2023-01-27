export function padStartZero(value: number, size: number):string {
  return String(value).padStart(size, "0").slice(-size);
}
