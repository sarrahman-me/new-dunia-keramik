/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { HTMLInputTypeAttribute } from "react";
import Label from "./label";

interface ITextfield {
  name: string;
  setValue: (v: any) => void;
  value?: any;
  type?: HTMLInputTypeAttribute;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
}

export default function Textfield({
  name,
  type,
  label,
  placeholder,
  setValue,
  value,
  disabled,
  errorMessage,
}: ITextfield) {
  return (
    <div className="flex flex-col">
      <Label htmlFor={name}>{label}</Label>
      <input
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="bg-white disabled:bg-gray-200 disabled:cursor-not-allowed outline-none border text-black rounded-sm focus:ring-amber-600 focus:border-amber-600 block w-full p-1.5 min-w-32"
        id={name}
        type={type || "text"}
        placeholder={placeholder}
      />
      {errorMessage && (
        <p className="text-xs text-red-400 my-1">{errorMessage}</p>
      )}
    </div>
  );
}
