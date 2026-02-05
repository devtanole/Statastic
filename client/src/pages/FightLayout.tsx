import { NavLink, Outlet, useParams } from 'react-router-dom';

export function FighterLayout() {
  const { fighterId } = useParams();

  return (
    <div className="container">
      <nav className="tabs">
        <NavLink to={`/fighters/${fighterId}`} end>
          Overview
        </NavLink>
        <NavLink to={`/fighters/${fighterId}/measurements`}>
          Measurements
        </NavLink>
        <NavLink to={`/fighters/${fighterId}/fights`}> Fight History</NavLink>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}
