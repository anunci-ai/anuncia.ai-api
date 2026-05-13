export interface GetGeneratedImagesResponse {
  images: {
    id: string;
    url: string;
    createdAt: Date;
  }[];
}
