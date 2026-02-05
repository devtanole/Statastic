import { FormEvent, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addFight, NewFight, updateFight, readFight } from '../../lib/data';

export function FightForm() {
  const { fighterId, fightId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(fightId);
  const [date, setDate] = useState('');
  const [outcome, setOutcome] = useState('win');
  const [method, setMethod] = useState('');
  const [promotion, setPromotion] = useState('');
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const outcomeOptions = [
    { value: '', label: 'Select outcome' },
    { value: 'win', label: 'Win' },
    { value: 'loss', label: 'Loss' },
    { value: 'draw', label: 'Draw' },
    { value: 'nc', label: 'No Contest' },
  ];

  const methodOptions = [
    { value: '', label: 'Select method' },
    { value: 'KO', label: 'KO' },
    { value: 'TKO', label: 'TKO' },
    { value: 'Decision', label: 'Decision' },
  ];

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
    <div className="min-h-screen flex flex-col items-center pt-12 px-4 bg-black text-white">
      <div className="w-full max-w-md p-6 border border-neutral-800 rounded-md shadow-lg bg-neutral-900">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4 text-center text-[#D4AF37]">
            {isEditing ? 'Edit Fight' : 'Add Fight'}
          </h2>

          {error && <div className="error">{error}</div>}

          <label className="block mb-3 text-sm">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>

          <label className="block mb-3 text-sm">
            Outcome
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              required
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]">
              {outcomeOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]">
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-3 text-sm">
            Method
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]">
              {methodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-3 text-sm">
            Promotion
            <input
              type="text"
              value={promotion}
              onChange={(e) => setPromotion(e.target.value)}
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>

          <button
            disabled={isSubmitting}
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
              ? 'Update Fight'
              : 'Create Fight'}
          </button>
        </form>
      </div>
    </div>
  );
}
