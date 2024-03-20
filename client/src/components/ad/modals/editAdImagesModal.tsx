interface Props {
  handleModalClick: (operation: string) => void;
}

export function EditAdImagesModal({ handleModalClick }: Props) {
  return (
    <>
      {" "}
      {/* Delete One Image modal */}
      <dialog id="deleteOneAdImageModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">
            Are you sure you want to delete this image?
          </h3>
          <div className="flex flex-col gap-2">
            <form method="dialog">
              <button className="btn w-full">No</button>
            </form>
            <form method="dialog">
              <button
                onClick={() => handleModalClick(`deleteOne`)}
                className="btn btn-error w-full"
              >
                Yes
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* Delete All Images modal */}
      <dialog id="deleteAllAdImagesModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">
            Are you sure you want to delete all images?
          </h3>
          <div className="flex flex-col gap-2">
            <form method="dialog">
              <button className="btn w-full">No</button>
            </form>
            <form method="dialog">
              <button
                onClick={() => handleModalClick(`deleteAll`)}
                className="btn btn-error w-full"
              >
                Yes
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
