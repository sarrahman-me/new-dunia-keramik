/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import Label from "./label";

interface SelectProps {
  value?: any;
  setValue: (value: any) => void;
  staticData?: boolean;
  lists?: any[];
  urlDataApi?: string;
  keyValue: {
    key: string;
    value: string;
  };
  placeholder?: string;
  label?: string;
}

const Select = ({
  setValue,
  value,
  placeholder,
  lists = [],
  keyValue,
  label,
  urlDataApi,
  staticData,
}: SelectProps) => {
  const [dataApi, setDataApi] = useState<any[]>([]);
  const [selectedItem, setSelected] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      if (urlDataApi) {
        try {
          const res = await fetch(urlDataApi);
          const json = await res.json();
          setDataApi(json.data);
        } catch (error) {
          console.error("Gagal fetch data:", error);
        }
      }
    };

    fetchData();
  }, [urlDataApi]);

  const dataToUse: any[] = staticData ? lists : dataApi;

  useEffect(() => {
    if (value && keyValue && dataToUse.length > 0) {
      const selectedItemFromValue = dataToUse.find(
        (item) => item[keyValue.key] === value
      );
      if (selectedItemFromValue) {
        setSelected(selectedItemFromValue);
      }
    } else {
      setSelected({});
    }
  }, [value, keyValue, dataToUse]);

  const handleSelectChange = (selectedItem: any) => {
    const selectedKey = selectedItem[keyValue.key];
    setValue(selectedKey);
    setSelected(selectedItem);
  };

  return (
    <div className={`${dataToUse.length === 0 ? "hidden" : ""}`}>
      {label && <Label htmlFor={label}>{label}</Label>}

      <Listbox value={selectedItem} onChange={handleSelectChange}>
        <ListboxButton className="flex justify-between items-center border text-black bg-white focus:border-amber-600 p-1.5 outline-none disabled:border-gray-500 disabled:cursor-not-allowed w-full rounded-sm">
          <p>{selectedItem[keyValue.value] || placeholder}</p>
          <IoIosArrowDown />
        </ListboxButton>

        <ListboxOptions className="mt-2 p-1.5 border border-amber-600 ring-amber-600 bg-white rounded-sm shadow-md max-h-48 overflow-scroll outline-none">
          {dataToUse.map((list, i) => (
            <ListboxOption key={i} value={list}>
              {({ focus, selected }) => (
                <div
                  className={`${selected
                    ? "bg-amber-500 text-white"
                    : focus
                      ? "bg-amber-50 text-amber-950"
                      : "bg-white text-black"
                    } cursor-pointer select-none p-1.5 rounded-sm`}
                >
                  {list[keyValue.value]}
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
};

export default Select;
