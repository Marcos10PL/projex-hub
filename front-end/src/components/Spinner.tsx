type SpinnerProps = {
  size: number;
};

export default function Spinner({ size }: SpinnerProps) {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full border-2 border-secondary border-t-transparent border-b-transparent"
        style={{
          width: `${size}rem`,
          height: `${size}rem`,
        }}
      />
    </div>
  );
}
