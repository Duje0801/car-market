export function catchErrors(
  error: any,
  setError: (value: React.SetStateAction<string>) => void
) {
  if (
    error?.response?.data?.status === "fail" &&
    typeof error?.response?.data?.message === `string`
  ) {
    setError(error.response.data.message);
  } else {
    setError("Something went wrong.");
  }
}
