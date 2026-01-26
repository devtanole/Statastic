import { MeasurementRow } from './MeasurementRow';
import { Measurement } from '../lib/data';

type Props = {
  measurements: Measurement[];
};

export function MeasurementsList({ measurements }: Props) {
  return (
    <ul>
      {measurements.map((m) => (
        <MeasurementRow key={m.measurementId} measurement={m} />
      ))}
    </ul>
  );
}
