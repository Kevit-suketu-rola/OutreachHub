import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute: React.FC<{ isAllowed: boolean }> = ({ isAllowed }) => {
  return isAllowed ? <Outlet /> : <Navigate to="/" replace />;
};
