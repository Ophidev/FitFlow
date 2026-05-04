// AuthLoader.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../redux/userSlice";
import AppRouter from "./AppRouter";
import Loading from "../pages/Loading";
import { checkUserProfileData } from "../utils/checkUserData";
import { useNavigate, useLocation } from "react-router";
import { getProfileRedirectPath } from "../utils/getProfileRedirectPath";

const AuthLoader = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });

        const isProfileComplete = checkUserProfileData(res.data);

        dispatch(addUser(res.data));

        if (location.pathname === "/login") {
          navigate(getProfileRedirectPath(res.data), {replace: true});
        }
      } catch (err) {
        dispatch(removeUser());
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [dispatch, navigate, location.pathname]);

  if (loading) {
    return <Loading message="Loading your page..." />;
  }

  return <AppRouter />;
};

export default AuthLoader;
