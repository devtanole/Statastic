import { Measurement } from '../lib/data';
import { Link } from 'react-router-dom';
import { removeMeasurement } from '../lib/data';

type Props = {
  measurement: Measurement;
  fighterId: number;
  onDelete: (measurementId: number) => void;
};

function formatHeight(heightInInches: number): string {
  const feet = Math.floor(heightInInches / 12);
  const inches = heightInInches % 12;
  return `${feet}' ${inches}"`;
}

formatHeight(70);

export function MeasurementRow({ measurement, fighterId, onDelete }: Props) {
  async function handleDelete() {
    if (!confirm('Delete this measurement?')) return;

    await removeMeasurement(measurement.measurementId, fighterId);
    onDelete(measurement.measurementId);
  }
  return (
    <>
      <li className="measurement-row">
        <span className="measurement-text">
          {measurement.dateRecorded.slice(0, 10)}:{' '}
          {formatHeight(measurement.height)} / {measurement.weight} lbs
        </span>

        <div className="measurement-actions">
          <Link
            to={`/fighters/${fighterId}/measurements/${measurement.measurementId}/edit`}>
            Edit
          </Link>

          <button onClick={handleDelete} className="delete-button">
            x
          </button>
        </div>
      </li>
    </>
  );
}
