import './App.css';
import { Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { Roster } from './pages/Roster';
import { FighterPage } from './pages/FighterPage';
import { MeasurementsPage } from './pages/MeasurementsPage';
import { FightHistory } from './pages/FightHistory';
import { FighterLayout } from './pages/FightLayout';

export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Header />}> */}
      <Route path="/auth/sign-up" element={<AuthPage mode="sign-up" />} />
      <Route path="/auth/sign-in" element={<AuthPage mode="sign-in" />} />
      <Route path="/" element={<Roster />} />
      <Route path="/fighters/:fighterId" element={<FighterLayout />}>
        <Route index element={<FighterPage />} />
        <Route
          path="/fighters/:fighterId/measurements"
          element={<MeasurementsPage />}
        />
        <Route path="/fighters/:fighterId/fights" element={<FightHistory />} />
      </Route>
      {/* </Route> */}
    </Routes>
  );
}
