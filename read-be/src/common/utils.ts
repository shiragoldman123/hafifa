export function removeNullFields(obj: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.fromEntries(Object.entries(obj).filter(([_key, value]) => value !== null)) as any;
}
