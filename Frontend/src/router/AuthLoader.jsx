// AuthLoader.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../redux/userSlice";
import AppRouter from "./AppRouter";
import Loading from "../pages/Loading";
import { checkUserProfileData } from "../utils/checkUserData";
import { useNavigate, useLocation } from "react-router";

const AuthLoader = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // 1. Session Restore Effect (runs only once)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });

        dispatch(addUser(res.data));
      } catch (err) {
        dispatch(removeUser());
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [dispatch]);

  // 2. Lightweight Redirect Effect (runs on path/user change)
  useEffect(() => {
    if (!user) return;

    if (location.pathname === "/login") {
      const isProfileComplete = checkUserProfileData(user);

      if (isProfileComplete) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  // 3. Show Loader only while auth fetch is pending
  if (loading) {
    return <Loading message="Loading your page..." />;
  }

  return <AppRouter />;
};

export default AuthLoader;