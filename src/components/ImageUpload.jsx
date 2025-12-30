"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageUpload({ value, onChange, label = "Product Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size too large. Maximum size is 5MB.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        onChange(data.url);
      } else {
        setError(data.message || "Failed to upload image");
      }
    } catch (err) {
      setError("An error occurred while uploading the image");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    onChange(null);
    setError("");
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm mb-1 text-zinc-300">{label}</label>

      {value ? (
        <div className="relative">
          <div className="relative w-full h-48 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
            <Image
              src={value}
              alt="Product preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="mt-2 text-sm text-red-400 hover:text-red-300"
          >
            Remove image
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6">
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-zinc-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-zinc-500">
                PNG, JPG, WEBP (MAX. 5MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {uploading && (
        <p className="text-sm text-blue-400">Uploading image...</p>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

