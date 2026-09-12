import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/themeSlice";

const ThemeManager = () => {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  // Restore the saved theme (if any) once when the app first loads.
  useEffect(() => {
    const savedTheme = localStorage.getItem("fitflow-theme");
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  // Apply the current theme to the app and persist it whenever it changes.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fitflow-theme", theme);
  }, [theme]);

  return null;
};

export default ThemeManager;
