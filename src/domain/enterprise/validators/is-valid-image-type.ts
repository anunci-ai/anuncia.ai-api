const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export function isValidImageType(fileType: string): fileType is AllowedImageType {
  return ALLOWED_IMAGE_TYPES.includes(fileType as AllowedImageType);
}
