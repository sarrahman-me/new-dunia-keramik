import FileInput from "@/components/fileInput";
import Select from "@/components/select";
import SwitchToggle from "@/components/switchToggle";
import Textfield from "@/components/textfield";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface InputGroupProps {
  forms: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    autoFocus?: boolean;
    staticData?: boolean;
    lists?: any[];
    disabled?: boolean;
    acceptFormat?: string;
    errorMessage?: string;
    urlDataApi?: string;
    variant?: "outlined" | "standard" | string;
    keyValue?: {
      key: string;
      value: string;
    };
  }[];
  setData: ({ }: any) => void;
  data: any;
  error?: {
    fields: any;
  };
}

const InputGroup = ({ forms, data, setData }: InputGroupProps) => {
  return (
    <div className="space-y-6">
      {forms.map((form, i) => {
        /**
         * mendefinisikan select component
         */

        if (form.type === "select") {
          return (
            <Select
              key={i}
              urlDataApi={form.urlDataApi}
              label={form.label}
              staticData={form.staticData}
              lists={form.lists}
              value={data[form.name]}
              placeholder={form.placeholder}
              setValue={(value) =>
                setData({
                  ...data,
                  [form.name]: value,
                })
              }
              keyValue={
                form.keyValue || {
                  key: "",
                  value: "",
                }
              }
            />
          );
        } else if (form.type === "file-input") {
          /**
           * mendefinisikan file input component
           */

          return (
            <FileInput
              key={i}
              label={form.label}
              setFile={(file) =>
                setData({
                  ...data,
                  [form.name]: file,
                })
              }
              file={data[form.name] || ""}
              acceptFormat={form.acceptFormat}
            />
          );
        } else if (form.type === "toogle") {
          /**
           * mendefinisikan toogle switch component
           */

          return (
            <SwitchToggle
              key={i}
              label={form.label}
              setValue={(v) =>
                setData({
                  ...data,
                  [form.name]: v,
                })
              }
              value={data[form.name] || false}
            />
          );
        } else {
          /**
           * mendefinisikan textfield component
           */

          return (
            <Textfield
              name={form.name}
              key={i}
              label={form.label}
              disabled={form.disabled}
              errorMessage={form.errorMessage}
              type={form.type}
              placeholder={form.placeholder}
              value={data[form.name] || ""}
              setValue={(value) =>
                setData({
                  ...data,
                  [form.name]: value,
                })
              }
            />
          );
        }
      })}
    </div>
  );
};

export default InputGroup;
