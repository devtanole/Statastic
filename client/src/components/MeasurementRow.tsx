import { Measurement } from '../lib/data';

type Props = {
  measurement: Measurement;
};

export function MeasurementRow({ measurement }: Props) {
  return (
    <li>
      {measurement.dateRecorded}: {measurement.height} / {measurement.weight}{' '}
      lbs
    </li>
  );
}
