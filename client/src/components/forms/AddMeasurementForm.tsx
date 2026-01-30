import { FormEvent, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  addMeasurement,
  NewMeasurement,
  Measurement,
  // updateMeasurement,
  // readMeasurements,
} from '../../lib/data';

type Props = {
  initialData?: Measurement;
};

export function MeasurementForm({ initialData }: Props) {
  const { fighterId } = useParams();
  const navigate = useNavigate();
  const [height, setHeight] = useState(initialData?.height || '');
  const [weight, setWeight] = useState(initialData?.weight || '');
  const [dateRecorded, setDateRecorded] = useState(
    initialData?.dateRecorded || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fighterId) {
      setError('fighterId missing');
      return;
    }

    try {
      setIsSubmitting(true);

      const newMeasurement: NewMeasurement = {
        height: Number(height),
        weight: Number(weight),
        dateRecorded,
      };

      await addMeasurement(Number(fighterId), newMeasurement);

      navigate(`/fighters/${fighterId}/measurements`);

      // optional: reset form
      // setHeight('');
      // setWeight('');
      // setDateRecorded('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to add measurement'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Measurement</h3>

      {error && <div className="error">{error}</div>}

      <label>
        Height
        <input
          type="number"
          step="0.1"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
        />
      </label>

      <label>
        Weight
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </label>

      <label>
        Date Recorded
        <input
          type="date"
          value={dateRecorded}
          onChange={(e) => setDateRecorded(e.target.value)}
          required
        />
      </label>

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Add Measurement'}
      </button>
    </form>
  );
}
