import './App.css';
import { Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { Roster } from './pages/Roster';

export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Header />}> */}
      <Route index element={<AuthPage mode="sign-up" />} />
      <Route path="/auth/sign-in" element={<AuthPage mode="sign-in" />} />
      <Route path="/fighters" element={<Roster />} />
      {/* </Route> */}
    </Routes>
  );
}
