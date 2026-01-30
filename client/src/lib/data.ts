export type Fighter = {
  fighterId: number;
  firstName: string;
  lastName: string;
  dob: string;
  finishes: number | null;
  weightMisses: number | null;
  pullOuts: number | null;
  notes: string | null;
};

export interface NewFighter {
  firstName: string;
  lastName: string;
  dob: string;
  finishes?: number;
  weightMisses?: number;
  pullOuts?: number;
  notes?: string;
}

export type User = {
  userId: number;
  fullName: string;
  username: string;
};

type Auth = {
  user: User;
  token: string;
};

export type Measurement = {
  measurementId: number;
  fighterId: number;
  height: number;
  weight: number;
  dateRecorded: string;
};

export interface NewMeasurement {
  height: number;
  weight: number;
  dateRecorded: string;
}

export type Fight = {
  fightId: number;
  fighterId: number;
  date?: string;
  outcome: string;
  method?: string;
  promotion?: string;
};

export interface NewFight {
  date?: string;
  outcome: string;
  method?: string;
  promotion?: string;
}

const authKey = 'um.auth';

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) {
    return undefined;
  }
  return (JSON.parse(auth) as Auth).token;
}

export async function readFighters(): Promise<Fighter[]> {
  const token = readToken();
  const req = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`/api/fighters`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Fighter[];
}

export async function readFighter(fighterId: number): Promise<Fighter> {
  const token = readToken();
  const req = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`/api/fighters/${fighterId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Fighter;
}

export async function readMeasurements(
  fighterId: number
): Promise<Measurement[]> {
  const token = readToken();
  const req = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`/api/fighters/${fighterId}/measurements`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);

  return (await res.json()) as Measurement[];
}

export async function readFights(fighterId: number): Promise<Fight[]> {
  const token = readToken();
  const req = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`/api/fighters/${fighterId}/fights`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);

  return (await res.json()) as Fight[];
}

export async function addFighter(fighter: NewFighter): Promise<Fighter> {
  const token = readToken();
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fighter),
  };
  const res = await fetch('/api/fighters', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Fighter;
}

export async function addMeasurement(
  fighterId: number,
  measurement: NewMeasurement
): Promise<Measurement> {
  const token = readToken();

  const res = await fetch(`/api/fighters/${fighterId}/measurements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(measurement),
  });

  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Measurement;
}

export async function addFight(
  fighterId: number,
  fight: Omit<Fight, 'fightId' | 'fighterId'>
): Promise<Fight> {
  const token = readToken();

  const res = await fetch(`/api/fighters/${fighterId}/fights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fight),
  });

  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Fight;
}

export async function updateFight(
  fightId: number,
  fight: NewFight,
  fighterId: number
): Promise<Fight> {
  const token = readToken();
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fight),
  };
  const res = await fetch(`/api/fighters/${fighterId}/fights/${fightId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Fight;
}

export async function updateMeasurement(
  measurementId: number,
  measurement: NewMeasurement,
  fighterId: number
): Promise<Measurement> {
  const token = readToken();
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(measurement),
  };
  const res = await fetch(
    `/api/fighters/${fighterId}/measurements/${measurementId}`,
    req
  );
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Measurement;
}

export async function updateFighter(
  fighterId: number,
  fighter: NewFighter
): Promise<Fighter> {
  const token = readToken();
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fighter),
  };
  const res = await fetch(`/api/fighters/${fighterId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Fighter;
}
