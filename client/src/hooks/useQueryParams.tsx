interface IQueryFields {
  make: string;
  model: string;
  firstRegistrationFrom: string;
  firstRegistrationTo: string;
  country: string;
  mileageFrom: string;
  mileageTo: string;
  condition: string;
  fuel: string;
  gearbox: string;
  minPower: string;
  maxPower: string;
  priceFrom: string;
  priceTo: string;
}

export function useQueryParams(fields: IQueryFields) {
  const {
    make,
    model,
    firstRegistrationFrom,
    firstRegistrationTo,
    country,
    mileageFrom,
    mileageTo,
    condition,
    fuel,
    gearbox,
    minPower,
    maxPower,
    priceFrom,
    priceTo,
  } = fields;

  let queryParams = "";
  if (make && make !== "Make") queryParams += `make=${make}&`;
  if (model) queryParams += `model=${model}&`;
  if (
    firstRegistrationFrom &&
    firstRegistrationFrom !== "First registration from" &&
    firstRegistrationFrom !== "-"
  ) {
    queryParams += `firstRegistrationFrom=${firstRegistrationFrom}&`;
  }
  if (
    firstRegistrationTo &&
    firstRegistrationTo !== "First registration to" &&
    firstRegistrationFrom !== "-"
  ) {
    queryParams += `firstRegistrationTo=${firstRegistrationTo}&`;
  }
  if (country && country !== "Pick country")
    queryParams += `country=${country}&`;
  if (mileageFrom) queryParams += `mileageFrom=${mileageFrom}&`;
  if (mileageTo) queryParams += `mileageTo=${mileageTo}&`;
  if (condition && condition !== "New/Used")
    queryParams += `condition=${condition}&`;
  if (fuel && fuel !== "Fuel") queryParams += `fuel=${fuel}&`;
  if (gearbox && gearbox !== "Gearbox") queryParams += `gearbox=${gearbox}&`;
  if (minPower) queryParams += `minPower=${minPower}&`;
  if (maxPower) queryParams += `maxPower=${maxPower}&`;
  if (priceFrom) queryParams += `priceFrom=${priceFrom}&`;
  if (priceTo) queryParams += `priceTo=${priceTo}`;

  if (queryParams.slice(-1) === "&" || queryParams.slice(-1) === "?") {
    queryParams = queryParams.slice(0, -1);
  }

  return queryParams;
}
