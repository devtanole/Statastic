import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export function Header() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  function handleLogout(): void {
    handleSignOut();
    navigate('/');
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0b0b0b',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: '#0E0E0E', boxShadow: 'none' }}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ textDecoration: 'none', color: '#c9a24d' }}>
              Statastic
            </Typography>
            <Button component={Link} to="/fighters" sx={{ color: '#c9a24d' }}>
              Roster
            </Button>
            <Button
              component={Link}
              to="/fighters/new"
              sx={{ color: '#c9a24d' }}>
              Add Fighter
            </Button>
          </Box>
          <Box>
            {user ? (
              <Button
                component={Link}
                onClick={handleLogout}
                to="/auth/sign-in"
                sx={{ color: '#ffffff' }}>
                Sign In
              </Button>
            ) : (
              <Button
                component={Link}
                onClick={handleLogout}
                to="/auth/sign-up"
                sx={{ color: '#ffffff' }}>
                Create Account
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Outlet />
    </Box>
  );
}
//   return (
//     <>
//       <header className="bg-purple-700 w-full">
//         <nav className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
//           <h1 className="text-white text-2xl font-bold">
//             <Link to="/" className="text-white hover:underline">
//               Statastic
//             </Link>
//           </h1>

//           <div className="flex items-center space-x-6">
//             <Link to="/fighters" className="text-#d4af37 hover:underline">
//               Fighters
//             </Link>

//             {user ? (
//               <button
//                 onClick={handleLogout}
//                 className="text-purple hover:underline"
//                 type="button">
//                 Sign Out
//               </button>
//             ) : (
//               <Link to="/auth/sign-in" className="text-#d4af37 hover:underline">
//                 Sign In
//               </Link>
//             )}
//           </div>
//         </nav>
//       </header>

//       <Outlet />
//     </>
//   );
// }
