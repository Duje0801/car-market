export function handleOpenModal (id: string) {
    const modal = document.getElementById(
        `${id}Modal`
      ) as HTMLDialogElement | null;
      if (modal) {
        modal.showModal();
      }  
}