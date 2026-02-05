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
            {user && (
              <>
                <Button
                  component={Link}
                  to="/fighters"
                  className="header-link"
                  sx={{ color: '#c9a24d' }}>
                  Roster
                </Button>
                <Button
                  component={Link}
                  to="/fighters/new"
                  sx={{ color: '#c9a24d' }}
                  className="header-link">
                  Add Fighter
                </Button>
              </>
            )}
          </Box>
          <Box>
            {user ? (
              <Button
                component={Link}
                onClick={handleLogout}
                to="/auth/sign-up"
                sx={{ color: '#ffffff' }}>
                Sign Out
              </Button>
            ) : (
              <Button
                component={Link}
                onClick={handleLogout}
                to="/auth/sign-in"
                sx={{ color: '#ffffff' }}>
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Outlet />
    </Box>
  );
}
