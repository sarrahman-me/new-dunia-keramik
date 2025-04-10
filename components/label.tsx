interface ILabel {
  children: React.ReactNode;
  htmlFor?: string;
}

export default function Label({ htmlFor, children }: ILabel) {
  return (
    <label
      htmlFor={htmlFor}
      className="capitalize text-gray-500 antialiased block"
    >
      {children}
    </label>
  );
}
