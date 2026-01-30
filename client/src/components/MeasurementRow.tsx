import { Measurement } from '../lib/data';
import { Link } from 'react-router-dom';

type Props = {
  measurement: Measurement;
  fighterId: number;
};

function formatHeight(heightInInches: number): string {
  const feet = Math.floor(heightInInches / 12);
  const inches = heightInInches % 12;
  return `${feet}' ${inches}"`;
}

// Example:
formatHeight(70); // "5' 10""

export function MeasurementRow({ measurement, fighterId }: Props) {
  return (
    <>
      <li>
        {measurement.dateRecorded.slice(0, 10)}:{' '}
        {formatHeight(measurement.height)} / {measurement.weight} lbs
      </li>
      <Link
        to={`/fighters/${fighterId}/measurements/${measurement.measurementId}/edit`}>
        Edit
      </Link>
    </>
  );
}
