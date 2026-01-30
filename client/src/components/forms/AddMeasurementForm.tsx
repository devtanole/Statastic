import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  NewMeasurement,
  readMeasurement,
  addMeasurement,
  updateMeasurement,
} from '../../lib/data';

export function MeasurementForm() {
  const { fighterId, measurementId } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(measurementId);

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dateRecorded, setDateRecorded] = useState('');
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Prefill ONLY when editing
  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      try {
        if (!fighterId || !measurementId) return;

        const m = await readMeasurement(
          Number(fighterId),
          Number(measurementId)
        );

        setHeight(String(m.height));
        setWeight(String(m.weight));
        setDateRecorded(m.dateRecorded.slice(0, 10));
      } catch (err) {
        setError('Failed to load measurement');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isEdit, fighterId, measurementId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!fighterId) return;

    try {
      setIsSubmitting(true);

      const payload: NewMeasurement = {
        height: Number(height),
        weight: Number(weight),
        dateRecorded,
      };

      if (isEdit && measurementId) {
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
      setError('Save failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <div>Loading…</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEdit ? 'Edit Measurement' : 'Add Measurement'}</h3>

      {error && <div className="error">{error}</div>}

      <label>
        Height
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
        />
      </label>

      <label>
        Weight
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </label>

      <label>
        Date
        <input
          type="date"
          value={dateRecorded}
          onChange={(e) => setDateRecorded(e.target.value)}
          required
        />
      </label>

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}
