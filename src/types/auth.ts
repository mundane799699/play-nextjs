export interface User {
  userId: number;
  userName: string;
  nickName: string;
  email: string;
  avatar: string;
  memberExpireTime?: string;
  memberType?: string;
  // Add other user properties as needed
}
