import { Dispatch, SetStateAction } from "react";

interface Props {
  totalLength: number;
  itemsPerPage: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export function Pagination({
  totalLength,
  itemsPerPage,
  page,
  setPage,
}: Props) {
  const numberOfPages: number = Math.ceil(totalLength / itemsPerPage);

  //Active and unactive classes
  const activeClass: string = "join-item btn btn-active";
  const unactiveClass: string = "join-item btn bg-white";

  //If number of ads is less then 6, pages list will not appear
  if (totalLength < itemsPerPage + 1) return <div></div>;
  //If number of ads is higher then 25, not all pages will appear
  //for example if 10 pages exists (1, 2, ... ,7 , ... , 10) will appear
  else if (totalLength > itemsPerPage * 5) {
    return (
      <div className="join">
        <div
          className="join-item btn bg-white"
          onClick={() => setPage(page === 1 ? 1 : page - 1)}
        >
          Previous
        </div>
        <div
          className={page === 1 ? activeClass : unactiveClass}
          onClick={() => setPage(1)}
        >
          1
        </div>
        {page === 1 || page === 2 ? (
          <div
            className={page === 2 ? activeClass : unactiveClass}
            onClick={() => setPage(2)}
          >
            2
          </div>
        ) : (
          <div>...</div>
        )}
        {page === 1 ||
        page === 2 ||
        page === numberOfPages ||
        page === numberOfPages - 1 ? null : (
          <div className={activeClass} onClick={() => setPage(page)}>
            {page}
          </div>
        )}
        {page === numberOfPages || page === numberOfPages - 1 ? (
          <div
            className={page === numberOfPages - 1 ? activeClass : unactiveClass}
            onClick={() => setPage(numberOfPages - 1)}
          >
            {numberOfPages - 1}
          </div>
        ) : (
          <div>...</div>
        )}
        <div
          className={page === numberOfPages ? activeClass : unactiveClass}
          onClick={() => setPage(numberOfPages)}
        >
          {numberOfPages}
        </div>
        <div
          className="join-item btn bg-white"
          onClick={() =>
            setPage(page === numberOfPages ? numberOfPages : page + 1)
          }
        >
          Next
        </div>
      </div>
    );
  } //If number of ads is between 6 and 25, all pages will appear (from 1 to 5)
  else {
    let pagesArray: number[] = [];

    for (let i = 1; i <= numberOfPages; i++) {
      pagesArray = [...pagesArray, i];
    }
    return (
      <div className="flex justify-center">
        <div className="join shadow-xl">
          <div
            className="join-item btn bg-white"
            onClick={() => setPage(page === 1 ? 1 : page - 1)}
          >
            Previous
          </div>
          {pagesArray.map((el, i) => {
            return (
              <div
                className={page === el ? activeClass : unactiveClass}
                onClick={() => setPage(el)}
                key={i}
              >
                {el}
              </div>
            );
          })}
          <div
            className="join-item btn bg-white"
            onClick={() =>
              setPage(page === numberOfPages ? numberOfPages : page + 1)
            }
          >
            Next
          </div>
        </div>
      </div>
    );
  }
}
