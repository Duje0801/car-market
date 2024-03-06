interface Props {
  size: string;
}

export function WaitingDots({ size }: Props) {
  const classname = `loading loading-ball loading-${size}`;

  return (
    <div className="flex justify-center mt-8">
      <span className={classname}></span>
      <span className={classname}></span>
      <span className={classname}></span>
    </div>
  );
}
