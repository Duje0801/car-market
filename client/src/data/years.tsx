export function yearsData() {
  const years: (string | number)[] = ["1999. and before"];

  for (let i = 2000; i <= new Date().getFullYear(); i++) {
    years.unshift(i);
  }

  years.unshift("-")

  return years;
}
