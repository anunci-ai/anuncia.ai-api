export interface ProfileData {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
  subscription?: {
    planId: string;
    isActive: boolean;
    tokensTotal: number;
    tokensRemaining: number;
  };
}
