import { Link } from 'react-router-dom';
import { Fighter } from '../lib/data';

type Props = {
  fighter: Fighter;
};

export function FighterCard({ fighter }: Props) {
  return (
    <li className="fighter-card">
      <Link to={`/fighters/${fighter.fighterId}`}>
        <strong>
          {fighter.firstName} {fighter.lastName}
        </strong>
      </Link>
    </li>
  );
}
