import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addMeasurement, NewMeasurement } from '../../lib/data';

export function MeasurementForm() {
  const { fighterId } = useParams();

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dateRecorded, setDateRecorded] = useState('');
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

      // optional: reset form
      setHeight('');
      setWeight('');
      setDateRecorded('');
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
