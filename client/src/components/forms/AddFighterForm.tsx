import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addFighter,
  updateFighter,
  readFighter,
  NewFighter,
} from '../../lib/data';

export function FighterForm() {
  const { fighterId } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(fighterId);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [finishes, setFinishes] = useState('');
  const [weightMisses, setWeightMisses] = useState('');
  const [pullOuts, setPullOuts] = useState('');
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 PREFILL FOR EDIT
  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      try {
        const fighter = await readFighter(Number(fighterId));

        setFirstName(fighter.firstName);
        setLastName(fighter.lastName);
        setDob(fighter.dob);
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
  }, [fighterId, isEdit]);

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

      if (isEdit) {
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

  if (isLoading) return <div>Loading…</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit Fighter' : 'Add Fighter'}</h2>

      {error && <div className="error">{error}</div>}

      <label>
        First Name
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </label>

      <label>
        Last Name
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </label>

      <label>
        Date of Birth
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
      </label>

      <label>
        Finishes
        <input
          type="number"
          value={finishes}
          onChange={(e) => setFinishes(e.target.value)}
        />
      </label>

      <label>
        Weight Misses
        <input
          type="number"
          value={weightMisses}
          onChange={(e) => setWeightMisses(e.target.value)}
        />
      </label>

      <label>
        Pull Outs
        <input
          type="number"
          value={pullOuts}
          onChange={(e) => setPullOuts(e.target.value)}
        />
      </label>

      <label>
        Notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>

      <button disabled={isSubmitting}>
        {isSubmitting
          ? 'Saving…'
          : isEdit
          ? 'Update Fighter'
          : 'Create Fighter'}
      </button>
    </form>
  );
}
