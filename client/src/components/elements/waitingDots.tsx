interface Props {
  size: string;
  marginTop: number;
}

export function WaitingDots({ size, marginTop }: Props) {
  const classnameDiv = `flex justify-center mt-${marginTop}`;
  const classnameSpan = `loading loading-ball loading-${size}`;

  return (
    <div className={classnameDiv}>
      <span className={classnameSpan}></span>
      <span className={classnameSpan}></span>
      <span className={classnameSpan}></span>
    </div>
  );
}
