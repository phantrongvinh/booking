import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PublicOnlyRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  if (isLoggedIn) return <Navigate to="/" replace />;
  return children;
};

export const PrivateRoute = ({ children, roles }) => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
};
