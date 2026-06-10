import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ child }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return isLoggedIn ? child : <Navigate to="/" />;
};

export default ProtectedRoute;
