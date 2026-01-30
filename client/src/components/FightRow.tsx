import { Fight } from '../lib/data';
import { Link } from 'react-router-dom';

type Props = {
  fight: Fight;
  fighterId: number;
};

export function FightRow({ fight, fighterId }: Props) {
  return (
    <>
      <li>
        {fight.date?.slice(0, 10)}: {fight.outcome} | {fight.method} |{' '}
        {fight.promotion}
      </li>
      <Link to={`/fighters/${fighterId}/fights/${fight.fightId}/edit`}>
        Edit
      </Link>
    </>
  );
}
