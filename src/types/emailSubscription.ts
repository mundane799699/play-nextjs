export interface EmailSubscription {
  id?: number;
  userId?: number;
  email: string;
  sendTime: string;
  subscriptionStatus: number;
}
