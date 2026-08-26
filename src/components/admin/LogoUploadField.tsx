"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";

export default function LogoUploadField({ 
  initialUrl = "", 
  name = "logo_url",
  label = "Upload Logo"
}: { 
  initialUrl?: string,
  name?: string,
  label?: string
}) {
  const [url, setUrl] = useState(initialUrl);

  return (
    <>
      <ImageUploader value={url} onChange={setUrl} label={label} />
      <input type="hidden" name={name} value={url} />
    </>
  );
}
