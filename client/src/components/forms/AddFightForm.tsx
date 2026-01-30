import { FormEvent, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addFight, NewFight, updateFight, readFight } from '../../lib/data';

export function FightForm() {
  const { fighterId, fightId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(fightId);
  const [date, setDate] = useState('');
  const [outcome, setOutcome] = useState('');
  const [method, setMethod] = useState('');
  const [promotion, setPromotion] = useState('');
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) return;

    async function load() {
      try {
        if (!fighterId || !fightId) return;

        const f = await readFight(Number(fighterId), Number(fightId));

        setDate(f.date?.slice(0, 10) ?? '');
        setOutcome(f.outcome);
        setMethod(f.method ?? '');
        setPromotion(f.promotion ?? '');
      } catch (err) {
        setError('Failed to load fight');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isEditing, fighterId, fightId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!fighterId) return;

    try {
      setIsSubmitting(true);

      const payload: NewFight = {
        date,
        outcome,
        method,
        promotion,
      };

      if (isEditing && fightId) {
        await updateFight(Number(fightId), payload, Number(fighterId));
      } else {
        await addFight(Number(fighterId), payload);
      }

      navigate(`/fighters/${fighterId}/fights`);
    } catch (err) {
      setError('Save failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <div>Loading…</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Edit Fight' : 'Add Fight'}</h3>

      {error && <div className="error">{error}</div>}

      <label>
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label>
        Outcome
        <input
          type="text"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          required
        />
      </label>

      <label>
        Method
        <input
          type="text"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />
      </label>

      <label>
        Promotion
        <input
          type="text"
          value={promotion}
          onChange={(e) => setPromotion(e.target.value)}
        />
      </label>

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : isEditing ? 'Update Fight' : 'Create Fight'}
      </button>
    </form>
  );
}
