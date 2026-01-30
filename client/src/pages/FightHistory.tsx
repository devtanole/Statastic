import { useParams, Link } from 'react-router-dom';
import { Fighter, Fight, readFighter, readFights } from '../lib/data';
import { useEffect, useState } from 'react';
import { FightList } from '../components/FightList';

export function FightHistory() {
  const { fighterId } = useParams();
  const [fighter, setFighter] = useState<Fighter | null>(null);
  const [fights, setFights] = useState<Fight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFighterAndData = async () => {
      try {
        if (!fighterId) throw new Error('fighterId missing');

        const fighter = await readFighter(Number(fighterId));
        setFighter(fighter);

        const fights = await readFights(Number(fighterId));
        setFights(fights);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading fights');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFighterAndData();
  }, [fighterId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!fighter) return <div>Fighter not found</div>;

  return (
    <div className="fights">
      <h2>
        {fighter.firstName} {fighter.lastName}
      </h2>
      <Link to={`/fighters/${fighterId}/fights/new`}>+ Add Fight</Link>
      {fights.length === 0 ? (
        <p>No fights recorded yet.</p>
      ) : (
        <FightList fights={fights} fighterId={Number(fighterId)} />
      )}
    </div>
  );
}
