export interface Fighter {
  fighterId: number;
  firstName: string;
  lastName: string;
  dob: string;
  finishes: number | null;
  weightMisses: number | null;
  pullOuts: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewFighter {
  firstName: string;
  lastName: string;
  dob: string;
  notes?: string;
}

export interface FightRecord {
  fightId: number;
  fighterId: number;
  date: string;
  outcome: string;
  method?: string;
  promotion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewFightRecord {
  fighterId: number;
  date: string;
  outcome: string;
  method?: string;
  promotion?: string;
}
