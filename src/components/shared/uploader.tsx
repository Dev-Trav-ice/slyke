"use client";

import { CircleX, Images } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import FormStatus from "./FormStatus";

export default function Uploader() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    if (!file) return setPreviewUrl(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  // ✅ Listen for form submit and reset
  useEffect(() => {
    const handleFormData = () => {
      setFile(null);
      setPreviewUrl(null);
      if (inputRef.current) inputRef.current.value = "";
    };

    const form = inputRef.current?.closest("form");
    if (form) form.addEventListener("formdata", handleFormData);

    return () => {
      if (form) form.removeEventListener("formdata", handleFormData);
    };
  }, []);

  return (
    <>
      <input
        type="file"
        hidden
        onChange={handleChange}
        name="image"
        ref={inputRef}
        accept="image/*"
      />
      {file && previewUrl && (
        <div className="relative flex items-center justify-center">
          <Image
            src={previewUrl}
            width={150}
            height={150}
            alt="preview"
            className="rounded-md"
          />
          <CircleX
            onClick={() => {
              setFile(null);
              setPreviewUrl(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute cursor-pointer top-4 right-4 text-red-500"
          />
        </div>
      )}

      <div className="flex items-center gap-8 justify-end mt-2">
        <Images
          className="cursor-pointer"
          onClick={() => inputRef.current?.click()}
          size={16}
        />
        <FormStatus btnLabel="post" />
      </div>
    </>
  );
}
