export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'privilege' | 'activity';
  status: 'pending' | 'approved' | 'denied';
  recommendedBy?: string;
  recommendedAt?: string;
  reviewedAt?: string;
  claimedBy?: string;
  claimedAt?: string;
  isNew?: boolean;
  forParents?: boolean;
}