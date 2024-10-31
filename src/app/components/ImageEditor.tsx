"use client";

import { useRef, useState } from "react";

import {
  FixedCropperRef,
  FixedCropper,
  ImageRestriction,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

import Navigation from "./Navigation";

const ImageEditor = () => {
  const cropperRef = useRef<FixedCropperRef>(null);

  const [src, setSrc] = useState("");
  const [mode, setMode] = useState("crop");

  const isGenerating = mode === "generate";

  //crop 버튼 클릭시
  const crop = async () => {
    const imageSrc = await getCroppedImageSrc();

    if (imageSrc) {
      setSrc(imageSrc); //canvas의 crop된 이미지로 src 변경
      setMode("generate");
    }
  };

  const onUpload = (objectUrl: string) => {
    setSrc(objectUrl);
    setMode("crop"); // crop 모드로 변경
  };

  const onDownload = async () => {
    if (isGenerating) {
      downloadImage(src);
      return;
    }

    const imageSrc = await getCroppedImageSrc();

    if (imageSrc) downloadImage(imageSrc);
  };

  const downloadImage = (objectUrl: string) => {
    const linkElement = document.createElement("a");
    linkElement.download = "image.png";
    linkElement.href = objectUrl;
    linkElement.click();
  };

  //canvas 에서 결과를 읽어 src 반환
  const getCroppedImageSrc = async () => {
    if (!cropperRef.current) return;

    const canvas = cropperRef.current.getCanvas({ height: 1024, width: 1024 });

    if (!canvas) return;
    const blob = (await getCanvasData(canvas)) as Blob;

    return blob ? URL.createObjectURL(blob) : null;
  };

  const getCanvasData = async (canvas: HTMLCanvasElement | null) => {
    return new Promise((resolve) => {
      canvas?.toBlob(resolve);
    });
  };

  return (
    <div className="w-full overflow-hidden rounded-lg bg-slate-950">
      {isGenerating ? (
        <img src={src} />
      ) : (
        <FixedCropper
          src={src}
          ref={cropperRef}
          className={"h-[600px]"}
          stencilProps={{
            movable: false,
            resizable: false,
            lines: false,
            handlers: false,
          }}
          stencilSize={{ width: 600, height: 600 }}
          imageRestriction={ImageRestriction.stencil}
        />
      )}
      <Navigation
        mode={mode}
        onUpload={onUpload}
        onDownload={onDownload}
        onCrop={crop}
      />
    </div>
  );
};

export default ImageEditor;
