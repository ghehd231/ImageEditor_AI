"use client";

import { useRef, useState } from "react";

import {
  FixedCropperRef,
  FixedCropper,
  ImageRestriction,
  Coordinates,
  CropperRef,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

import Navigation from "./Navigation";
import ImageSelector from "./ImageSelector";

const ImageEditor = () => {
  const cropperRef = useRef<FixedCropperRef>(null);

  const [src, setSrc] = useState("");
  const [mode, setMode] = useState("crop");

  const [selectionRect, setSelectionRect] = useState<Coordinates | null>();

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

  const onSelectionChange = (cropper: CropperRef) => {
    setSelectionRect(cropper.getCoordinates());
  };

  const getImageData = async () => {
    if (!src) return;

    const canvas = document.createElement("canvas");
    await drawImage(canvas, src);

    return getCanvasData(canvas);
  };

  const getMaskData = async () => {
    if (!src || !selectionRect) return;

    const canvas = document.createElement("canvas");

    await drawImage(canvas, src);
    drawMask(canvas, selectionRect);

    return getCanvasData(canvas);
  };

  const drawImage = (canvas: HTMLCanvasElement | null, src: string) => {
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const width = img.width;
        const height = img.height;

        canvas.width = width;
        canvas.height = height;

        context.drawImage(img, 0, 0, width, height);
        resolve(context);
      };
      img.src = src;
    });
  };

  const drawMask = (
    canvas: HTMLCanvasElement | null,
    rect: Coordinates | null
  ) => {
    const context = canvas?.getContext("2d");
    if (!context || !rect) return;

    context.globalCompositeOperation = "destination-out";
    context.fillRect(rect.left, rect.top, rect.width, rect.height);
  };
  return (
    <div className="w-full overflow-hidden rounded-lg bg-slate-950">
      {isGenerating ? (
        <ImageSelector
          src={src}
          selectionRect={selectionRect}
          onSelectionChange={onSelectionChange}
        />
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
        getImageData={getImageData}
        getMaskData={getMaskData}
      />
    </div>
  );
};

export default ImageEditor;
