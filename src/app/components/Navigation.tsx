"use client";

import { useRef } from "react";

import { FiDownload, FiUpload } from "react-icons/fi";
import IconButton from "./IconButton";

interface Props {
  onUpload?: (blob: string) => void;
  onDownload?: () => void;
}

export default function Navigation({ onDownload, onUpload }: Props) {
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
    <div className="flex justify-between bg-slate-900 p-5">
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
      <IconButton title="DownLoad image" onClick={onDownload}>
        <FiDownload />
      </IconButton>
    </div>
  );
}
