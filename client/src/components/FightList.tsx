import { FightRow } from './FightRow';
import { Fight } from '../lib/data';

type Props = {
  fights: Fight[];
  fighterId: number;
  onDelete: (fightId: number) => void;
};

export function FightList({ fights, fighterId, onDelete }: Props) {
  return (
    <ul>
      {fights.map((f) => (
        <FightRow
          key={f.fightId}
          fighterId={Number(fighterId)}
          onDelete={onDelete}
          fight={f}
        />
      ))}
    </ul>
  );
}
