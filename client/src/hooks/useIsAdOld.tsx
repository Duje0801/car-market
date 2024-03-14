export function useIsAdOld(date: Date) {
  return Date.now() - 15552000000 > new Date(date).getTime();
}
