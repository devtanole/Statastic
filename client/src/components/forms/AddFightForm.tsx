import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addFight, NewFight } from '../../lib/data';

export function FightForm() {
  const { fighterId } = useParams();
  const [date, setDate] = useState('');
  const [outcome, setOutcome] = useState('');
  const [method, setMethod] = useState('');
  const [promotion, setPromotion] = useState('');
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

      const newFight: NewFight = {
        date,
        outcome,
        method,
        promotion,
      };

      await addFight(Number(fighterId), newFight);

      // optional: reset form
      setDate('');
      setOutcome('');
      setMethod('');
      setPromotion('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add fight');
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Fight</h3>

      {error && <div className="error">{error}</div>}

      <label>
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label>
        Outcome
        <input
          type="string"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          required
        />
      </label>

      <label>
        Method
        <input
          type="string"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          required
        />
      </label>

      <label>
        Promotion
        <input
          type="string"
          value={promotion}
          onChange={(e) => setPromotion(e.target.value)}
          required
        />
      </label>

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Add Fight'}
      </button>
    </form>
  );
}
