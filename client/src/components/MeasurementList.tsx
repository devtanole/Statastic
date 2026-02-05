import { MeasurementRow } from './MeasurementRow';
import { Measurement } from '../lib/data';

type Props = {
  measurements: Measurement[];
  fighterId: number;
  onDelete: (measurementId: number) => void;
};

export function MeasurementsList({ measurements, fighterId, onDelete }: Props) {
  return (
    <ul>
      {measurements.map((m) => (
        <MeasurementRow
          key={m.measurementId}
          fighterId={Number(fighterId)}
          measurement={m}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
