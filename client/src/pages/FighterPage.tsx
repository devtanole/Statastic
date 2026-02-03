import { useParams } from 'react-router-dom';
import { Fighter, readFighter, readFights, Fight } from '../lib/data';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

export function FighterPage() {
  const { fighterId } = useParams();
  const [fighter, setFighter] = useState<Fighter | null>(null);
  const [fights, setFights] = useState<Fight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const fighter = await readFighter(Number(fighterId));
        setFighter(fighter);

        const fights = await readFights(Number(fighterId));
        setFights(fights);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
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
  if (error) return <div>Error loading fighter</div>;
  if (!fighter) return null;

  let wins = 0;
  let losses = 0;
  let draws = 0;
  let finishes = 0;

  fights.forEach((fight) => {
    switch (fight.outcome.toLowerCase()) {
      case 'w':
      case 'win':
      case 'W':
      case 'WIN':
        wins++;
        // count finishes
        if (fight.method) {
          switch (fight.method.toLowerCase()) {
            case 'ko':
            case 'tko':
            case 'KO':
            case 'TKO':
              finishes++;
              break;
          }
        }
        break;
      case 'l':
      case 'loss':
      case 'LOSS':
      case 'L':
        losses++;
        break;
      case 'd':
      case 'draw':
      case 'nc':
      case 'D':
      case 'NC':
      case 'DRAW':
      case 't':
      case 'T':
      case 'TIE':
      case 'tie':
        draws++;
        break;
    }
  });

  return (
    <div className="container">
      <h1>
        {fighter.firstName} {fighter.lastName}
      </h1>
      <Link to={`/fighters/${fighterId}/edit`}>Edit</Link>
      <section className="fighter-summary">
        <p>
          <strong>Record:</strong> {wins}–{losses}
          {draws > 0 && `–${draws}`}
        </p>
        <p>
          <strong>Recorded Finishes:</strong> {finishes}
        </p>

        <p>
          <strong>DOB:</strong> {fighter.dob.slice(0, 10)}
        </p>

        <p>
          <strong>Finishes:</strong> {fighter.finishes ?? 0}
        </p>

        <p>
          <strong>Weight Misses:</strong> {fighter.weightMisses ?? 0}
        </p>

        <p>
          <strong>Pull Outs:</strong> {fighter.pullOuts ?? 0}
        </p>
      </section>
    </div>
  );
}
