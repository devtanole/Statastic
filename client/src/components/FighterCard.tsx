import { Link } from 'react-router-dom';
import { Fighter } from '../lib/data';
import { removeFighter } from '../lib/data';

type Props = {
  fighter: Fighter;
  onDelete: (fighterId: number) => void;
};

export function FighterCard({ fighter, onDelete }: Props) {
  async function handleDelete() {
    if (!confirm('Delete this fighter?')) return;

    await removeFighter(fighter.fighterId);
    onDelete(fighter.fighterId);
  }
  return (
    <li className="fighter-card">
      <Link to={`/fighters/${fighter.fighterId}`}>
        <strong>
          {fighter.firstName} {fighter.lastName}
        </strong>
      </Link>
      <button
        onClick={handleDelete}
        style={{ color: 'gold', backgroundColor: 'black' }}>
        x
      </button>
    </li>
  );
}
