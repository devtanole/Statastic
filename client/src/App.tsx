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
import { UserProvider } from './components/UserContext';
import { HomePage } from './pages/Home';
import { Header } from './components/Header';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header />}>
          {/* auth page */}
          <Route path="/auth/sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="/auth/sign-in" element={<AuthPage mode="sign-in" />} />

          {/* Main roster page */}
          <Route index element={<HomePage />} />
          <Route path="/fighters" element={<Roster />} />

          <Route path="/fighters/new" element={<FighterForm />} />
          {/* Fighter routes with nested tabs */}
          <Route path="/fighters/:fighterId" element={<FighterLayout />}>
            {/* Overview tab */}
            <Route index element={<FighterPage />} />

            {/* Measurements tab */}
            <Route path="measurements" element={<MeasurementsPage />} />
            <Route path="measurements/new" element={<MeasurementForm />} />
            <Route
              path="measurements/:measurementId/edit"
              element={<MeasurementForm />}
            />

            {/* Fight history tab */}
            <Route path="fights" element={<FightHistory />} />
            <Route path="fights/new" element={<FightForm />} />
            <Route path="fights/:fightId/edit" element={<FightForm />} />

            {/* Edit fighter form */}
            <Route path="edit" element={<FighterForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
