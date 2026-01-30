import { MeasurementRow } from './MeasurementRow';
import { Measurement } from '../lib/data';

type Props = {
  measurements: Measurement[];
  fighterId: number;
};

export function MeasurementsList({ measurements, fighterId }: Props) {
  return (
    <ul>
      {measurements.map((m) => (
        <MeasurementRow
          key={m.measurementId}
          fighterId={Number(fighterId)}
          measurement={m}
        />
      ))}
    </ul>
  );
}
