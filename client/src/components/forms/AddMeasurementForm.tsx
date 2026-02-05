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
    <div className="min-h-screen flex flex-col items-center pt-12 px-4 bg-black text-white">
      <div className="w-full max-w-md p-6 border border-neutral-800 rounded-md shadow-lg bg-neutral-900">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4 text-center text-[#D4AF37]">
            {isEditing ? 'Edit Measurement' : 'Add Measurement'}
          </h2>

          {error && <div className="error">{error}</div>}

          <label className="block mb-3 text-sm">
            Height (inches)
            <input
              type="number"
              value={height}
              onChange={(e) =>
                setHeight(e.target.value ? Number(e.target.value) : '')
              }
              required
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>

          <label className="block mb-3 text-sm">
            Weight (lbs)
            <input
              type="number"
              value={weight}
              onChange={(e) =>
                setWeight(e.target.value ? Number(e.target.value) : '')
              }
              required
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>

          <label className="block mb-3 text-sm">
            Date Recorded
            <input
              type="date"
              value={dateRecorded}
              onChange={(e) => setDateRecorded(e.target.value)}
              required
              className="
    mt-1 w-full rounded
    bg-black border border-neutral-700
    p-2 text-white
    focus:outline-none focus:border-[#D4AF37]
    [color-scheme:dark]
  "
            />
          </label>

          <button
            disabled={isSubmitting}
            style={{ marginTop: '1rem' }}
            className="
            w-full py-2 rounded
            bg-[#D4AF37] text-black font-semibold
            hover:bg-[#c9a633]
            transition
            disabled:opacity-50
          ">
            {isSubmitting
              ? 'Saving…'
              : isEditing
              ? 'Update Measurement'
              : 'Add Measurement'}
          </button>
        </form>
      </div>
    </div>
  );
}
