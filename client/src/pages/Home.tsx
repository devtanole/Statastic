import { Link } from 'react-router-dom';
import { useUser } from '../components/useUser';

export function HomePage() {
  const { user } = useUser();

  return (
    <div className="home">
      <h1>Fighter Management System</h1>
      <p className="home-subtitle">
        Track fighters, records and record measurements in one place
      </p>
      <p>First, create a fighter. Then add fight history and measurements.</p>
      {user ? (
        <div className="actions">
          <p>Review your current team or add new fighters.</p>
          <Link to="/fighters" className="button">
            View Roster
          </Link>

          <Link to="/fighters/new" className="button secondary">
            Add Fighter
          </Link>
        </div>
      ) : (
        <div className="actions">
          <p>Sign in or register to manage your team.</p>
          <Link to="/auth/sign-in" className="button">
            Sign In
          </Link>

          <Link to="/auth/sign-up" className="button secondary">
            Create Account
          </Link>
        </div>
      )}
    </div>
  );
}
