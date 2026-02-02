import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D4AF37', // gold
    },
    background: {
      default: '#0E0E0E',
      paper: '#151515',
    },
    text: {
      primary: '#FAFAFA',
      secondary: '#b5b5b5',
    },
  },
});
