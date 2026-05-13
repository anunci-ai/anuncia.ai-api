export interface FetchRecentListingsResponse {
  listings: {
    id: string;
    inputDescription: string;
    marketplace: string;
    createdAt: Date;
    originalImageUrl: string | null;
  }[];
}
