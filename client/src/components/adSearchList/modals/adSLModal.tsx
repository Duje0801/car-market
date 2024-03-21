import { AdSLFilter } from "../filter/adSLFilter";

export function AdSLModal() {
  return (
    <dialog id="filterSearchModal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-2">Filter</h3>
        <div className="flex flex-col gap-2">
          <AdSLFilter />
        </div>
      </div>
    </dialog>
  );
}
