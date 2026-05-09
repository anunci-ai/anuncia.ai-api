export interface GetProfileResponse {
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    email: string;
  };
}
