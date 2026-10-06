"use client";

import * as React from "react";
import Image from "next/image";
import { Camera, Trash2, UploadCloud, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { validateImageMagicBytes } from "@/lib/security/magic-bytes";

export interface AvatarUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  accentColor?: string;
  className?: string;
}

export function AvatarUploader({
  value,
  onChange,
  accentColor = "#6366F1",
  className,
}: AvatarUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    // 3MB limit check
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum size is 3MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file format. Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    // Binary magic byte signature verification (prevents MIME-type spoofing)
    const isAuthenticImage = await validateImageMagicBytes(file);
    if (!isAuthenticImage) {
      toast.error("File verification failed: corrupted or spoofed image binary.");
      return;
    }

    // Create a local blob preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        onChange(e.target.result);
        toast.success("Profile photo updated.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-center gap-5 text-left", className)}>
      {/* Avatar Preview with Glowing Accent Ring */}
      <div
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div
          className="w-24 h-24 rounded-full p-1 transition-all duration-300 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, transparent 70%)`,
            boxShadow: `0 0 25px ${accentColor}40`,
          }}
        >
          <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden relative flex items-center justify-center border-2 border-slate-800">
            {value ? (
              <Image
                src={value}
                alt="Profile Avatar"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <User className="w-10 h-10 text-slate-500" />
            )}

            {/* Hover Camera Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Upload & Dropzone info */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-heading">
            Profile Photo
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            JPG, PNG, or WebP. Max size 3MB.
          </p>
        </div>

        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 px-3 rounded-lg text-xs font-medium border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                toast.info("Profile photo removed.");
              }}
              className="h-8 px-2.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
}
