import { useParams, Link } from 'react-router-dom';
import { Fighter, Fight, readFighter, readFights } from '../lib/data';
import { useEffect, useState } from 'react';
import { FightList } from '../components/FightList';
import { CircularProgress } from '@mui/material';

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
  if (error) return <div>{error}</div>;
  if (!fighter) return <div>Fighter not found</div>;

  function handleDelete(fightId: number) {
    setFights((prev) => prev.filter((f) => f.fightId !== fightId));
  }

  return (
    <div className="measurements">
      <div className="fights-header">
        <h2 className="fighter-name">
          {fighter.firstName} {fighter.lastName}
        </h2>

        <Link to={`/fighters/${fighterId}/fights/new`} className="add-link">
          + Add Fight
        </Link>
      </div>

      {fights.length === 0 ? (
        <p className="empty-state">No fights recorded yet.</p>
      ) : (
        <FightList
          fights={fights}
          fighterId={Number(fighterId)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
