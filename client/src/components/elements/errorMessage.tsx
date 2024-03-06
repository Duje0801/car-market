interface Props {
  text: string;
}

export function ErrorMessage({ text }: Props) {
  return (
    <div className="badge badge-error flex flex-justify gap-2 rounded-lg p-4 m-auto h-fit max-w-[80vw]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="inline-block w-8 h-8 stroke-current"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
      <p className="text-sm text-center">{text}</p>
    </div>
  );
}
