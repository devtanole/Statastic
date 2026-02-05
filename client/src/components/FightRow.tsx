import { Fight } from '../lib/data';
import { Link } from 'react-router-dom';
import { removeFight } from '../lib/data';
import { ConfirmDialog } from './ConfirmDialog';
import { useState } from 'react';

type Props = {
  fight: Fight;
  fighterId: number;
  onDelete: (fightId: number) => void;
};

export function FightRow({ fight, fighterId, onDelete }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    await removeFight(fight.fightId, fighterId);
    onDelete(fight.fightId);
    setShowConfirm(false);
  }
  return (
    <li className="fight-row">
      <span className="fight-text">
        {fight.date?.slice(0, 10)} — {fight.outcome}
        {fight.method && ` | ${fight.method}`}
        {fight.promotion && ` | ${fight.promotion}`}
      </span>

      <div className="fight-actions">
        <Link to={`/fighters/${fighterId}/fights/${fight.fightId}/edit`}>
          Edit
        </Link>

        <button onClick={() => setShowConfirm(true)} className="delete-button">
          x
        </button>
        <ConfirmDialog
          open={showConfirm}
          message="Delete this fight permanently?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </li>
  );
}
