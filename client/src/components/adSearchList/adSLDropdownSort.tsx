interface Props {
  handleSorting: (id: string) => void;
}

export function AdSLDropdownSort({ handleSorting }: Props) {
  return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-sm bg-black text-white text-sm font-bold"
        >
          Sort
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow border-[0.8px] border-white bg-black rounded-box w-52"
        >
          <li>
            <a
              className="text-sm font-bold py-2 text-white"
              onClick={() => handleSorting("-createdAt")}
            >
              Lastest offers first
            </a>
          </li>
          <li>
            <a
              className="text-sm font-bold py-2 text-white"
              onClick={() => handleSorting("price")}
            >
              Price ascending
            </a>
          </li>
          <li>
            <a
              className="text-sm font-bold py-2 text-white"
              onClick={() => handleSorting("-price")}
            >
              Price descending
            </a>
          </li>
          <li>
            <a
              className="text-sm font-bold py-2 text-white"
              onClick={() => handleSorting("mileage")}
            >
              Mileage ascending
            </a>
          </li>
          <li>
            <a
              className="text-sm font-bold py-2 text-white"
              onClick={() => handleSorting("-mileage")}
            >
              Mileage descending
            </a>
          </li>
        </ul>
      </div>
  );
}
