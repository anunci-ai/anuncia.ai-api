export interface UploadReferenceImageDTO {
  userId: string;
  listingId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}
