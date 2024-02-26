export function useCreateAtToString(createAt: Date | undefined) {
  if (!createAt) return "";
  else {
    let year = String(createAt).split("-")[0];
    let month = String(createAt).split("-")[1];
    let date = String(createAt).split("-")[2].split("T")[0];

    return `${date}.${month}.${year}`;
  }
}
