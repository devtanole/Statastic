import './App.css';
import { Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { Roster } from './pages/Roster';
import { FighterPage } from './pages/FighterPage';
import { MeasurementsPage } from './pages/MeasurementsPage';
import { FightHistory } from './pages/FightHistory';
import { FighterLayout } from './pages/FightLayout';
import { MeasurementForm } from './components/forms/AddMeasurementForm';
import { FightForm } from './components/forms/AddFightForm';
import { FighterForm } from './components/forms/AddFighterForm';

export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Header />}> */}
      <Route path="/auth/sign-up" element={<AuthPage mode="sign-up" />} />
      <Route path="/auth/sign-in" element={<AuthPage mode="sign-in" />} />

      <Route path="/" element={<Roster />} />

      <Route path="/fighters/new" element={<FighterForm />} />

      <Route path="/fighters/:fighterId" element={<FighterLayout />}>
        <Route index element={<FighterPage />} />
        <Route
          path="/fighters/:fighterId/measurements"
          element={<MeasurementsPage />}
        />
        <Route path="/fighters/:fighterId/fights" element={<FightHistory />} />

        <Route
          path="/fighters/:fighterId/measurements/new"
          element={<MeasurementForm />}
        />
        <Route path="/fighters/:fighterId/fights/new" element={<FightForm />} />
      </Route>
      {/* </Route> */}
    </Routes>
  );
}
