import { Measurement } from '../lib/data';
import { Link } from 'react-router-dom';
import { removeMeasurement } from '../lib/data';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

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
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    await removeMeasurement(measurement.measurementId, fighterId);
    onDelete(measurement.measurementId);
    setShowConfirm(false);
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

          <button
            onClick={() => setShowConfirm(true)}
            className="delete-button">
            x
          </button>
          <ConfirmDialog
            open={showConfirm}
            message="Delete this measurement permanently?"
            onConfirm={handleDelete}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      </li>
    </>
  );
}
