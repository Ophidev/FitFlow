// AuthLoader.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../redux/userSlice";
import AppRouter from "./AppRouter";
import Loading from "../pages/Loading";

const AuthLoader = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slowDown = setTimeout(() => {
      setLoading(false);
    }, 1200); // Show loading for at least 1.2 seconds

    // Fetch user data
    axios
      .get(BASE_URL + "/profile/view", {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(addUser(res.data));
      })
      .catch(() => {
        dispatch(removeUser());
      });

    return () => clearTimeout(slowDown); // cleanup timer
  }, [dispatch]);

  if (loading) {
    return <Loading message="Loading your page..." />;
  }

  return <AppRouter />;
};

export default AuthLoader;