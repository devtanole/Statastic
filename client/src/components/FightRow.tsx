import { Fight } from '../lib/data';

type Props = {
  fight: Fight;
};

export function FightRow({ fight }: Props) {
  return (
    <li>
      {fight.date}: {fight.outcome} | {fight.method} | {fight.promotion}
    </li>
  );
}
