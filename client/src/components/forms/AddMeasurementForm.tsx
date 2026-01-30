import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addMeasurement,
  updateMeasurement,
  readMeasurement,
  NewMeasurement,
} from '../../lib/data';

export function MeasurementForm() {
  const { fighterId, measurementId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(measurementId);

  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [dateRecorded, setDateRecorded] = useState('');

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🧠 Prefill when editing
  useEffect(() => {
    if (!isEditing) return;

    async function load() {
      try {
        if (!fighterId || !measurementId) return;

        const m = await readMeasurement(
          Number(fighterId),
          Number(measurementId)
        );

        setHeight(m.height);
        setWeight(m.weight);
        setDateRecorded(m.dateRecorded.split('T')[0]); // YYYY-MM-DD
      } catch {
        setError('Failed to load measurement');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isEditing, fighterId, measurementId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fighterId) return;

    try {
      setIsSubmitting(true);

      const payload: NewMeasurement = {
        height: Number(height),
        weight: Number(weight),
        dateRecorded,
      };

      if (isEditing && measurementId) {
        await updateMeasurement(
          Number(measurementId),
          payload,
          Number(fighterId)
        );
      } else {
        await addMeasurement(Number(fighterId), payload);
      }

      navigate(`/fighters/${fighterId}/measurements`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <div>Loading…</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Edit Measurement' : 'Add Measurement'}</h3>

      {error && <div className="error">{error}</div>}

      <label>
        Height (inches)
        <input
          type="number"
          value={height}
          onChange={(e) =>
            setHeight(e.target.value ? Number(e.target.value) : '')
          }
          required
        />
      </label>

      <label>
        Weight (lbs)
        <input
          type="number"
          value={weight}
          onChange={(e) =>
            setWeight(e.target.value ? Number(e.target.value) : '')
          }
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
        {isSubmitting
          ? 'Saving…'
          : isEditing
          ? 'Update Measurement'
          : 'Add Measurement'}
      </button>
    </form>
  );
}
