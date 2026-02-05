import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addFighter,
  updateFighter,
  readFighter,
  NewFighter,
} from '../../lib/data';
import { CircularProgress } from '@mui/material';

export function FighterForm() {
  const { fighterId } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(fighterId);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [finishes, setFinishes] = useState('');
  const [weightMisses, setWeightMisses] = useState('');
  const [pullOuts, setPullOuts] = useState('');
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 PREFILL FOR EDIT
  useEffect(() => {
    if (!isEditing) return;

    async function load() {
      try {
        const fighter = await readFighter(Number(fighterId));

        setFirstName(fighter.firstName);
        setLastName(fighter.lastName);
        setDob(fighter.dob.split('T')[0]);
        setFinishes(fighter.finishes?.toString() ?? '');
        setWeightMisses(fighter.weightMisses?.toString() ?? '');
        setPullOuts(fighter.pullOuts?.toString() ?? '');
        setNotes(fighter.notes ?? '');
      } catch {
        setError('Failed to load fighter');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [fighterId, isEditing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      const payload: NewFighter = {
        firstName,
        lastName,
        dob,
        finishes: finishes ? Number(finishes) : null,
        weightMisses: weightMisses ? Number(weightMisses) : null,
        pullOuts: pullOuts ? Number(pullOuts) : null,
        notes: notes || null,
      };

      if (isEditing) {
        await updateFighter(Number(fighterId), payload);
        navigate(`/fighters/${fighterId}`);
      } else {
        const created = await addFighter(payload);
        navigate(`/fighters/${created.fighterId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // full viewport height
          color: '#d4af37',
        }}>
        <CircularProgress />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 px-4 bg-black text-white">
      <div className="w-full max-w-md p-6 border border-neutral-800 rounded-md shadow-lg bg-neutral-900">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4 text-center text-[#D4AF37]">
            {isEditing ? 'Edit Fighter' : 'Add Fighter'}
          </h2>

          {error && <div className="error">{error}</div>}

          <label className="block mb-3 text-sm">
            First Name
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </label>

          <label className="block mb-3 text-sm">
            Last Name
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>

          <label className="block mb-3 text-sm">
            Date of Birth
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
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

          <label className="block mb-3 text-sm">
            Finishes
            <input
              type="number"
              value={finishes}
              onChange={(e) => setFinishes(e.target.value)}
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>

          <label className="block mb-3 text-sm">
            Weight Misses
            <input
              type="number"
              value={weightMisses}
              onChange={(e) => setWeightMisses(e.target.value)}
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>

          <label className="block mb-3 text-sm">
            Pull Outs
            <input
              type="number"
              value={pullOuts}
              onChange={(e) => setPullOuts(e.target.value)}
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>

          <label className="block mb-3 text-sm">
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
          "
            style={{ marginTop: '1rem' }}>
            {isSubmitting
              ? 'Saving…'
              : isEditing
              ? 'Update Fighter'
              : 'Create Fighter'}
          </button>
        </form>
      </div>
    </div>
  );
}
