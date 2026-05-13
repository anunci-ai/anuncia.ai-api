export interface ProfileData {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
  subscription?: {
    isActive: boolean;
    tokensTotal: number;
    tokensRemaining: number;
    plan: {
      id: string;
      name: string;
    };
  };
}
