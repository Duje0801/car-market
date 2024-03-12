export function useCalcPhotosNumber(photoNo: number, photosLength: number) {
  const before: number = photoNo < 1 ? photosLength - 1 : photoNo - 1;
  const after: number = photoNo === photosLength - 1 ? 0 : photoNo + 1;

  return { before, after };
}
