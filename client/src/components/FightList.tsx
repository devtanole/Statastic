import { FightRow } from './FightRow';
import { Fight } from '../lib/data';

type Props = {
  fights: Fight[];
};

export function FightList({ fights }: Props) {
  return (
    <ul>
      {fights.map((f) => (
        <FightRow key={f.fightId} fight={f} />
      ))}
    </ul>
  );
}
