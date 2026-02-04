import { useParams, Link } from 'react-router-dom';
import {
  Fighter,
  Measurement,
  readFighter,
  readMeasurements,
} from '../lib/data';
import { useEffect, useState } from 'react';
import { MeasurementsList } from '../components/MeasurementList';
import { CircularProgress } from '@mui/material';

export function MeasurementsPage() {
  const { fighterId } = useParams();
  const [fighter, setFighter] = useState<Fighter | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFighterAndData = async () => {
      try {
        if (!fighterId) throw new Error('fighterId missing');

        const fighter = await readFighter(Number(fighterId));
        setFighter(fighter);

        const measurements = await readMeasurements(Number(fighterId));
        setMeasurements(measurements);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error loading measurements'
        );
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

  function handleDelete(measurementId: number) {
    setMeasurements((prev) =>
      prev.filter((m) => m.measurementId !== measurementId)
    );
  }

  return (
    <div className="measurements">
      <div className="measurements-header">
        <h2 className="fighter-name">
          {fighter.firstName} {fighter.lastName}
        </h2>

        <Link
          to={`/fighters/${fighterId}/measurements/new`}
          className="add-link">
          + Add Measurement
        </Link>
      </div>

      {measurements.length === 0 ? (
        <p className="empty-state">No measurements recorded yet.</p>
      ) : (
        <MeasurementsList
          measurements={measurements}
          fighterId={Number(fighterId)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
