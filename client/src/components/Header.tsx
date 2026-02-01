import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';

export function Header() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  function handleLogout(): void {
    handleSignOut();
    navigate('/');
  }
  return (
    <>
      <header className="bg-purple-700 w-full">
        <nav className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">
            <Link to="/" className="text-white hover:underline">
              Statastic
            </Link>
          </h1>

          <div className="flex items-center space-x-6">
            <Link to="/fighters" className="text-white hover:underline">
              Fighters
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="text-purple hover:underline"
                type="button">
                Sign Out
              </button>
            ) : (
              <Link to="/auth/sign-in" className="text-white hover:underline">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>

      <Outlet />
    </>
  );
}
