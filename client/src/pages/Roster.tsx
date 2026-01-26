import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { FaPencilAlt } from 'react-icons/FaPencilAlt';
import { Fighter, readFighters } from '../lib/data';
import { FighterCard } from '../components/FighterCard';

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
  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Fighters:{''}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <div className="row">
        <div
          className="column-full d-flex justify-between align-center"
          style={{ paddingBottom: '1rem' }}>
          <h1> Fighters </h1>
          <h3>
            <Link to="/details/new" className="white-text form-link">
              NEW
            </Link>
          </h3>
        </div>
      </div>
      <div className="row">
        <div className="column-full">
          <ul className="fighter-ul">
            {fighters.map((fighter) => (
              <FighterCard key={fighter.fighterId} fighter={fighter} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
