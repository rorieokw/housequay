'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return {
        url: data.url,
        publicId: data.publicId,
      };
    } catch (err) {
      console.error('Upload error:', err);
      return null;
    }
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);
    setError('');

    const uploadPromises = filesToUpload.map(uploadFile);
    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((r): r is UploadedImage => r !== null);

    if (successfulUploads.length > 0) {
      onImagesChange([...images, ...successfulUploads]);
    }

    if (successfulUploads.length < filesToUpload.length) {
      setError('Some images failed to upload');
    }

    setUploading(false);
  }, [images, maxImages, onImagesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-[var(--primary)] bg-[var(--primary)]/5'
            : 'border-[var(--border)] hover:border-[var(--primary)]/50'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <svg className="animate-spin h-10 w-10 text-[var(--primary)]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-[var(--foreground)]/60">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-[var(--muted)] rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-[var(--foreground)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Drop images here or click to upload</p>
                <p className="text-sm text-[var(--foreground)]/60 mt-1">
                  JPEG, PNG, WebP or GIF (max 10MB each)
                </p>
              </div>
              <p className="text-xs text-[var(--foreground)]/40">
                {images.length} / {maxImages} images uploaded
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.publicId}
              className="relative aspect-video rounded-lg overflow-hidden group"
            >
              <Image
                src={image.url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Cover badge for first image */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                  Cover
                </div>
              )}

              {/* Controls overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Move left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* Move right */}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Move right"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      <p className="text-xs text-[var(--foreground)]/40">
        Tip: The first image will be your cover photo. Drag to reorder.
      </p>
    </div>
  );
}
