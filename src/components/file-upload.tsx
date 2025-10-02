/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  currentImage?: string;
  onImageRemove?: () => void;
}

const FileUpload = ({ onFileSelect, currentImage, onImageRemove }: FileUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasNewFile, setHasNewFile] = useState(false);

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB 이하여야 합니다.");
      return;
    }

    // 부모에게 파일 전달
    onFileSelect(file);
    setHasNewFile(true);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setHasNewFile(false);
    onFileSelect(null);
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const displayImage = imagePreview ?? (currentImage && !hasNewFile ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ""}/${currentImage}` : null);

  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-gray-700">
        표지/포스터 이미지
      </label>
      <div
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          displayImage
            ? "border-primary bg-gray-50"
            : "hover:border-primary border-gray-300"
        }`}
        onClick={() => document.getElementById("imageInput")?.click()}
      >
        {displayImage ? (
          <div>
            <img
              src={displayImage}
              alt="Preview"
              className="mx-auto mb-3 max-h-48 max-w-48 rounded-lg"
            />
            <div className="text-sm text-gray-600">클릭하여 이미지 변경</div>
            {(currentImage ?? hasNewFile) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="mt-2 rounded px-3 py-1 text-sm text-white bg-primary"
              >
                이미지 제거
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-3 text-4xl text-gray-400">📷</div>
            <div className="text-gray-600">
              클릭하여 이미지 업로드
              <br />
              <small>이미지 파일 (최대 10MB)</small>
            </div>
          </>
        )}
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          className="hidden"
          onChange={handleChangeFile}
        />
      </div>
    </div>
  );
};

export default FileUpload;
