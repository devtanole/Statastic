import { FormEvent, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addFighter, NewFighter } from '../../lib/data';

export function FighterForm() {
  const { fighterId } = useParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fighterId) {
      setError('fighterId missing');
      return;
    }

    try {
      setIsSubmitting(true);

      const newFighter: NewFighter = {
        firstName,
        lastName,
        dob,
        notes,
      };

      const fighter = await addFighter(newFighter);
      navigate(`/fighters/${fighter.fighterId}`);

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
        Notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Add Fighter'}
      </button>
    </form>
  );
}
