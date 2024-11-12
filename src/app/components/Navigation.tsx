/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import { FiDownload, FiUpload } from "react-icons/fi";

import IconButton from "./IconButton";
import Button from "./Button";
import GenerateImage from "./GenerateImage";

interface Props {
  mode: string;
  onUpload?: (blob: string) => void;
  onDownload?: () => void;
  onCrop?: () => void;
  getImageData: () => Promise<any>;
  getMaskData: () => Promise<any>;
}

export default function Navigation({
  mode,
  onDownload,
  onUpload,
  onCrop,
  getImageData,
  getMaskData,
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

  const onGenerateImage = () => {
    console.log("test");
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
          <Button onClick={!!onCrop ? onCrop : () => {}}>Crop</Button>
        )}
        {mode === "generate" && (
          <GenerateImage
            getImageData={getImageData}
            getMaskData={getMaskData}
            onGenerate={onGenerateImage}
          />
        )}
      </div>
      <IconButton title="Download image" onClick={onDownload}>
        <FiDownload />
      </IconButton>
    </div>
  );
}
