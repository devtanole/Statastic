import { FightRow } from './FightRow';
import { Fight } from '../lib/data';

type Props = {
  fights: Fight[];
  fighterId: number;
};

export function FightList({ fights, fighterId }: Props) {
  return (
    <ul>
      {fights.map((f) => (
        <FightRow key={f.fightId} fighterId={Number(fighterId)} fight={f} />
      ))}
    </ul>
  );
}
