"use client";
import React from "react";
import { Switch } from "@headlessui/react";

/**
 * Komponen SwitchToggle digunakan untuk membuat tombol toggle yang dapat mengganti nilai boolean.
 *
 * @param {boolean} value - Nilai boolean yang akan diatur oleh tombol toggle.
 * @param {function} setValue - Fungsi yang akan dipanggil saat tombol toggle diubah.
 * @param {string} label - Label yang mendeskripsikan fungsi dari tombol toggle (opsional).
 */

interface SwitchProps {
  setValue: (e: boolean) => void;
  value: boolean;
  label?: string;
}

const SwitchToggle = ({ value, setValue, label }: SwitchProps) => {
  return (
    <div className="flex items-center">
      <Switch
        checked={value}
        onChange={setValue}
        className={`${value
          ? "bg-gradient-to-br from-amber-700 via-primary-600 to-primary-700"
          : "bg-white border"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${value ? "translate-x-6 bg-white" : "translate-x-1 bg-gray-400"
            } inline-block h-4 w-4 transform rounded-full transition`}
        />
      </Switch>
      {label && (
        <label className="ml-2 text-sm md:text-base select-none text-black first-letter:uppercase">
          {label}
        </label>
      )}
    </div>
  );
};

export default SwitchToggle;
