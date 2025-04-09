interface textfieldProps {
  type?: string;
  label?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  disabled?: boolean;
}

const Textfield = ({
  type = "text",
  label,
  placeholder,
  onChange,
  value,
  disabled,
}: textfieldProps) => {
  return (
    <div className="space-y-1 w-full">
      <label
        htmlFor={label}
        className="block text-sm md:text-base font-medium text-amber-700"
      >
        {label}
      </label>
      <input
        onChange={(e) => onChange(e.target.value)}
        type={type}
        value={value}
        name={label}
        disabled={disabled}
        id={label}
        className="bg-white disabled:bg-gray-200 disabled:cursor-not-allowed outline-none border text-amber-950 rounded-lg focus:ring-amber-600 focus:border-amber-600 block w-full p-1.5 min-w-32"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Textfield;
