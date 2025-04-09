"use client";
import Textfield from "@/components/textfield";
import { useState } from "react";

interface InputGroupProps {
  forms: {
    type: "select" | "number" | "text";
    label: string;
    name: string;
    placeholder?: string;
    lists?: { [key: string]: string }[];
    staticData?: boolean;
    keyValue?: {
      key: string;
      value: string;
    };
    disabled?: boolean;
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setData: (values: Record<string, any>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

const InputGroup = ({ forms, setData, data }: InputGroupProps) => {
  const [inputData, setInputData] = useState(data);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (name: string, value: any) => {
    const newData = { ...inputData, [name]: value };
    setInputData(newData);
    setData(newData);
  };

  return (
    <div className="space-y-4">
      {forms.map((form) => (
        <div key={form.name} className="flex flex-col">
          <label
            htmlFor={form.name}
            className="block text-sm md:text-base font-medium text-amber-700"
          >
            {form.label}
          </label>

          {form.type === "select" ? (
            <select
              id={form.name}
              value={inputData[form.name] || ""}
              onChange={(e) => handleChange(form.name, e.target.value)}
              disabled={form.disabled}
              className="bg-white disabled:bg-gray-200 disabled:cursor-not-allowed outline-none border text-amber-950 rounded-lg focus:ring-amber-600 focus:border-amber-600 block w-full p-1.5 min-w-32"
            >
              <option value="">{form.placeholder}</option>
              {form.lists?.map((item, index) => (
                <option key={index} value={item[form.keyValue!.key]}>
                  {item[form.keyValue!.value]}
                </option>
              ))}
            </select>
          ) : (
            <Textfield
              type={form.type}
              value={inputData[form.name] || ""}
              onChange={(value) => handleChange(form.name, value)}
              disabled={form.disabled}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default InputGroup;
