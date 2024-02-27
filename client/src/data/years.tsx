export function yearsData() {
  const years: (string | number)[] = ["Older"];

  for (let i = 2000; i <= new Date().getFullYear(); i++) {
    years.unshift(i);
  }

  years.unshift("");

  return years;
}
