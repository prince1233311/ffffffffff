
export enum ViewType {
  LANDING = 'landing',
  CHAT = 'chat',
  IMAGE = 'image',
  VOICE = 'voice',
  WEBSITE = 'website',
  REWARDS = 'rewards',
  PRICING = 'pricing'
}

export type PlanType = 'free' | 'daily200' | 'unlimited';

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  previewColor: string;
}

export interface WebProject {
  title: string;
  description: string;
  primaryColor: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
}

export interface UserState {
  diamonds: number;
  lastRewardClaim: number | null;
  plan: PlanType;
  lastDailyRefresh: number | null;
}
