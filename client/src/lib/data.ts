export type Fighter = {
  fighterId: number;
  firstName: string;
  lastName: string;
  dob: string;
  finishes?: number;
  weightMisses?: number;
  pullOuts?: number;
  notes?: string;
};

export type User = {
  userId: number;
  fullName: string;
  username: string;
};

type Auth = {
  user: User;
  token: string;
};

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
