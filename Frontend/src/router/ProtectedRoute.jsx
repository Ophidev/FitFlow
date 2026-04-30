import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.user);

  return user ? <Outlet /> : <Navigate to="/login" replace/>;
  // replace is simply a boolean prop of Navigate component.
  // replace prevents browser back button from returning to blocked protected page
};

export default ProtectedRoute;