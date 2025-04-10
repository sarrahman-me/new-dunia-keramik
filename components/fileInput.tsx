/* eslint-disable @next/next/no-img-element */
"use client";
import { FaUpload } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import Label from "./label";

/**
 * Komponen FileInput digunakan untuk mengunggah file dan, jika diaktifkan, menampilkan pratinjau file gambar.
 *
 * @param {string} label - Label yang ditampilkan di atas elemen input file.
 * @param {string} error - Pesan kesalahan yang ditampilkan jika terjadi kesalahan validasi.
 * @param {function} setFile - Fungsi yang dipanggil saat file dipilih untuk menyimpan file (dalam format base64 as string[]).
 * @param {boolean} previewFile - Jika benar, akan menampilkan pratinjau file gambar.
 */

interface FileInputProps {
  label?: string;
  error?: string;
  setFile: (file: string) => void;
  file: string;
  acceptFormat?: string;
}

const FileInput = ({
  label,
  error,
  setFile,
  file,
  acceptFormat,
}: FileInputProps) => {
  const handleFileChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // const nameFile = file.name;
      // const typeFile = file.type;

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        setFile(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFileType = (base64String: string): string => {
    if (
      base64String.startsWith("data:application/pdf;base64,") ||
      base64String.includes("s3.amazonaws.com/pdf")
    ) {
      return "application/pdf";
    } else if (
      base64String.startsWith("data:video/mp4;base64,") ||
      base64String.startsWith("s3.amazonaws.com/video")
    ) {
      return "video/mp4";
    } else {
      return "image";
    }
  };

  const fileType = getFileType(file);

  const renderPreview = () => {
    if (fileType === "image") {
      return (
        <img
          src={file}
          className="object-contain max-h-28 md:max-h-[155px] border"
          alt={label || ""}
        />
      );
    } else if (fileType === "application/pdf") {
      return (
        <embed src={file} type="application/pdf" width="100%" height="500px" />
      );
    } else if (fileType === "video/mp4") {
      return (
        <video
          src={file}
          controls
          className="object-contain max-h-28 md:max-h-[155px] border"
        />
      );
    } else {
      return null;
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <Label
          htmlFor={label}
        >
          {label}
        </Label>
      )}

      <div className="inline-flex flex-col">
        <label
          htmlFor={label}
          className="flex items-center justify-center px-5 py-1.5 border bg-amber-50 rounded-sm cursor-pointer text-amber-950 hover:bg-amber-100 transition-all"
        >
          <FaUpload className="mr-2 text-amber-950" />
          <span>Unggah File</span>
        </label>

        <input
          onChange={handleFileChange}
          id={label}
          type="file"
          accept={acceptFormat}
          className="hidden"
        />
      </div>

      {file && (
        <div className="flex">
          <div className="relative">
            <span className="absolute right-1 top-1">
              <FaTrash
                className="text-red-500 cursor-pointer"
                onClick={() => setFile("")}
              />
            </span>
            {renderPreview()}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileInput;
