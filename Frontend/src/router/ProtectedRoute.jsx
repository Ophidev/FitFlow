import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { checkUserProfileData } from "../utils/checkUserData";
import { LocateOff } from "lucide-react";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const isProfileCompleted = checkUserProfileData(user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if ( !isProfileCompleted && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  // replace is simply a boolean prop of Navigate component.
  // replace prevents browser back button from returning to blocked protected page

  return <Outlet/>
};

export default ProtectedRoute;