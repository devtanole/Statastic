import { useContext } from 'react';
import { UserContextValues, userContext } from './UserContext';
export type { User } from '../lib/data';

export function useUser(): UserContextValues {
  const values = useContext(userContext);
  if (!values) throw new Error('useUser must be used inside a UserProvider');
  return values;
}
