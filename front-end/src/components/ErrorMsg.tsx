type ErrorProps = {
  message: string | undefined;
};

export default function ErrorMsg({ message }: ErrorProps) {
  if (!message) return null;

  return (
    <div
      className="text-red-400 text-center mt-2"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  );
}
