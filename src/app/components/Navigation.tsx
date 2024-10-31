"use client";

import { useRef } from "react";

import { FiDownload, FiUpload } from "react-icons/fi";
import IconButton from "./IconButton";

interface Props {
  mode: string;
  onUpload?: (blob: string) => void;
  onDownload?: () => void;
  onCrop?: () => void;
}

export default function Navigation({
  mode,
  onDownload,
  onUpload,
  onCrop,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onUploadButtonClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const onLoadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      if (onUpload) {
        const firstItem = files.item(0);
        if (firstItem) onUpload(URL.createObjectURL(firstItem));
      }
    }

    e.target.value = "";
  };

  return (
    <div className="flex justify-between p-5 bg-slate-900">
      <IconButton title="Upload image" onClick={onUploadButtonClick}>
        <FiUpload />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onLoadImage}
          className="hidden"
        />
      </IconButton>
      <div className="flex items-center justify-center gap-2 mx-20 grow">
        {mode === "crop" && (
          <button onClick={onCrop} className="text-slate-400">
            Crop
          </button>
        )}
      </div>
      <IconButton title="Download image" onClick={onDownload}>
        <FiDownload />
      </IconButton>
    </div>
  );
}
