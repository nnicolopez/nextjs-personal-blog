/** What the dashboard can upload to Vercel Blob. Shared by the upload route and the button. */

export const UPLOAD_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
  audio: ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "audio/ogg", "audio/webm"],
} as const;

export const UPLOAD_LIMITS = {
  image: 8 * 1024 * 1024,
  audio: 30 * 1024 * 1024,
} as const;

export type UploadKind = keyof typeof UPLOAD_TYPES;
