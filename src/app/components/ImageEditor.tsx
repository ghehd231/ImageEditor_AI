"use client";

import { useState } from "react";
import Navigation from "./Navigation";

const ImageEditor = () => {
  const [src, setSrc] = useState("");

  const onUpload = (objectUrl: string) => {
    setSrc(objectUrl);
  };

  const onDownload = () => {
    if (src) {
      downloadImage(src);
    }
  };

  const downloadImage = (objectUrl: string) => {
    const linkElement = document.createElement("a");
    linkElement.download = "image.png";
    linkElement.href = objectUrl;
    linkElement.click();
  };

  return (
    <div>
      {src && <img src={src} alt="Image" />}
      <Navigation onUpload={onUpload} onDownload={onDownload} />
    </div>
  );
};

export default ImageEditor;
