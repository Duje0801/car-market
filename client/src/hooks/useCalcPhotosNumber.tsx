export function useCalcPhotosNumber(photoNo: number, imagesLength: number) {
  const before: number = photoNo < 1 ? imagesLength! - 1 : photoNo - 1;
  const after: number = photoNo === imagesLength! - 1 ? 0 : photoNo + 1;

  return { before, after };
}
