interface Props {
  handleSorting: (id: string) => void;
}

export function ProfileDropdownSort({ handleSorting }: Props) {
  return (
    <div className="my-2 w-[90vw] mx-auto sm:w-[66vw] lg:w-5/6 lg:ml-4 lg:mr-auto lg:mt-0">
      <div className="w-fit ml-auto">
        <div className="dropdown dropdown-end mt-auto">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm bg-black text-white text-sm font-bold xl:text-xl"
          >
            Sort
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow border-[0.8px] border-white bg-black rounded-box w-52 xl:w-72"
          >
            <li>
              <a
                className="text-sm font-bold py-2 text-white xl:text-2xl"
                onClick={() => handleSorting("-createdAt")}
              >
                Lastest offers first
              </a>
            </li>
            <li>
              <a
                className="text-sm font-bold py-2 text-white xl:text-2xl"
                onClick={() => handleSorting("price")}
              >
                Price ascending
              </a>
            </li>
            <li>
              <a
                className="text-sm font-bold py-2 text-white xl:text-2xl"
                onClick={() => handleSorting("-price")}
              >
                Price descending
              </a>
            </li>
            <li>
              <a
                className="text-sm font-bold py-2 text-white xl:text-2xl"
                onClick={() => handleSorting("mileage")}
              >
                Mileage ascending
              </a>
            </li>
            <li>
              <a
                className="text-sm font-bold py-2 text-white xl:text-2xl"
                onClick={() => handleSorting("-mileage")}
              >
                Mileage descending
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
