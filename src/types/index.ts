export interface Participant {
  id: string;
  msnv: string;
  fullName: string;
  taiwanName: string;
  department: string;
  isWon?: boolean;
  wonAt?: string;
  prizeId?: string;
  prizeName?: string;
}

export type LanguageMode = 'bilingual' | 'vi' | 'tw';

export type DrawCountMode = 1 | 3 | 5;

export type AppView = 'stage' | 'list' | 'upload';

export interface PrizeConfig {
  id: string;
  nameVi: string;
  nameTw: string;
  color: string;
}

export interface DrawWinnerResult {
  participant: Participant;
  prizeNameVi: string;
  prizeNameTw: string;
  slotIndex: number;
}
