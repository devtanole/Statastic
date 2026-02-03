import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { FaPencilAlt } from 'react-icons/FaPencilAlt';
import { Fighter, readFighters } from '../lib/data';
import { FighterCard } from '../components/FighterCard';
import { CircularProgress } from '@mui/material';

export function Roster() {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const fighters = await readFighters();
        setFighters(fighters);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);
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
  if (error) {
    return (
      <div>
        Error Loading Fighters:{''}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }
  function handleDelete(fighterId: number) {
    setFighters((prev) => prev.filter((f) => f.fighterId !== fighterId));
  }

  return (
    <div className="container roster">
      <div className="roster-header">
        <h1>Fighters</h1>

        <Link to="/fighters/new" className="button">
          + New Fighter
        </Link>
      </div>

      <div className="fighter-grid">
        {fighters.map((fighter) => (
          <FighterCard
            key={fighter.fighterId}
            fighter={fighter}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
