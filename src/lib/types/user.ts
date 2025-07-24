export interface UserProfile {
  id: string;
  username: string | null;
  wallet_address: string | null;
  profile_image_url: string | null;
  messages_sent: number;
  messages_received: number;
  pending_messages: number;
  vibz_balance: number;
  created_at: string;
  updated_at: string;
  email: string | null;
  last_sign_in_at: string | null;
  raw_app_meta_data: Record<string, any>;
  raw_user_meta_data: Record<string, any>;
  is_super_admin: boolean;
  rewardpoints: number;
  latest_reward_amount: number;
}