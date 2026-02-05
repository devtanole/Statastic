import { Link } from 'react-router-dom';
import { Fighter } from '../lib/data';
import { removeFighter } from '../lib/data';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

type Props = {
  fighter: Fighter;
  onDelete: (fighterId: number) => void;
};

export function FighterCard({ fighter, onDelete }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    await removeFighter(fighter.fighterId);
    onDelete(fighter.fighterId);
    setShowConfirm(false);
  }
  return (
    <li className="fighter-card">
      <Link to={`/fighters/${fighter.fighterId}`}>
        <strong>
          {fighter.firstName} {fighter.lastName}
        </strong>
      </Link>
      <button onClick={() => setShowConfirm(true)} className="delete-button">
        x
      </button>
      <ConfirmDialog
        open={showConfirm}
        message="Delete this fighter permanently?"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </li>
  );
}
