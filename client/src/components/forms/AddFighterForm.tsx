import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  addFighter,
  NewFighter,
  Fighter,
  updateFighter,
  readFighter,
} from '../../lib/data';

type Props = {
  initialData?: Fighter;
};

export function FighterForm({ initialData }: Props) {
  const { fighterId } = useParams();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [dob, setDob] = useState(initialData?.dob || '');
  const [finishes, setFinishes] = useState(initialData?.finishes || '');
  const [weightMisses, setWeightMisses] = useState(
    initialData?.weightMisses || ''
  );
  const [pullOuts, setPullOuts] = useState(initialData?.pullOuts || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!initialData && fighterId) {
        try {
          const fighter = await readFighter(Number(fighterId));
          setFirstName(fighter.firstName);
          setLastName(fighter.lastName);
          setDob(fighter.dob);
          setFinishes(fighter.finishes?.toString() || '');
          setWeightMisses(fighter.weightMisses?.toString() || '');
          setPullOuts(fighter.pullOuts?.toString() || '');
          setNotes(fighter.notes || '');
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Error loading fighter'
          );
        }
      }
    }
    load();
  }, [fighterId, initialData]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fighterId && !initialData) {
      setError('fighterId missing');
      return;
    }

    const newFighter: NewFighter = {
      firstName,
      lastName,
      dob,
      finishes: Number(finishes),
      weightMisses: Number(weightMisses),
      pullOuts: Number(pullOuts),
      notes,
    };

    try {
      setIsSubmitting(true);

      if (initialData) {
        // Edit mode
        await updateFighter(Number(fighterId), newFighter);
      } else {
        // Create mode
        const created = await addFighter(newFighter);
        navigate(`/fighters/${created.fighterId}`);
        return;
      }

      // optional: reset form
      // setFirstName('');
      // setLastName('');
      // setDob('');
      // setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add fight');
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Fighter</h3>

      {error && <div className="error">{error}</div>}

      <label>
        First Name
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>

      <label>
        Last Name
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
        {isSubmitting ? 'Saving…' : 'Add Fighter'}
      </button>
    </form>
  );
}
