import { useParams } from 'react-router-dom';
import { Fighter, readFighter } from '../lib/data';
import { useEffect, useState } from 'react';

export function FighterPage() {
  const { fighterId } = useParams();
  const [fighter, setFighter] = useState<Fighter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const fighter = await readFighter(Number(fighterId));
        setFighter(fighter);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [fighterId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading fighter</div>;
  if (!fighter) return null;

  return (
    <div className="container">
      <h1>
        {fighter.firstName} {fighter.lastName}
      </h1>
      <p>DOB: {fighter.dob}</p>
      <p>Finishes: {fighter.finishes ?? 0}</p>
      <p>Weight Misses: {fighter.weightMisses ?? 0}</p>
      <p>Pull Outs: {fighter.pullOuts ?? 0}</p>
    </div>
  );
}
