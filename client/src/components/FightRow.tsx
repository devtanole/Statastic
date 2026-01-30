import { Fight } from '../lib/data';
import { Link } from 'react-router-dom';
import { removeFight } from '../lib/data';

type Props = {
  fight: Fight;
  fighterId: number;
  onDelete: (fightId: number) => void;
};

export function FightRow({ fight, fighterId, onDelete }: Props) {
  async function handleDelete() {
    if (!confirm('Delete this fight?')) return;

    await removeFight(fight.fightId, fighterId);
    onDelete(fight.fightId);
  }
  return (
    <>
      <li>
        {fight.date?.slice(0, 10)}: {fight.outcome} | {fight.method} |{' '}
        {fight.promotion}
      </li>
      <Link to={`/fighters/${fighterId}/fights/${fight.fightId}/edit`}>
        Edit
      </Link>
      <button onClick={handleDelete}>x</button>
    </>
  );
}
