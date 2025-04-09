"use client";

interface DisplayDataProps {
  title: string;
  data: string;
}

const DisplayData = ({ title, data }: DisplayDataProps) => {
  return (
    <div className="flex justify-between border-b pb-1">
      <span className="font-medium">{title}</span>
      <span className="text-gray-700">{data}</span>
    </div>
  );
};

export default DisplayData;
