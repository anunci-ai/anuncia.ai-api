export interface FetchListingsAnalyticsResponse {
  analytics: {
    listings: {
      total: number;
      lastMonth: {
        date: string;
        count: number;
      }[];
    };
  };
}
