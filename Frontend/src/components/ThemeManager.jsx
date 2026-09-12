import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/themeSlice";
import { THEME_OPTIONS } from "../utils/themeOptions";

const ThemeManager = () => {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  // Restore the saved theme (if any) once when the app first loads.
  useEffect(() => {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem("fitflow-theme");
    } catch (err) {
      console.warn("Could not read saved theme from localStorage:", err.message);
    }

    if (savedTheme && THEME_OPTIONS.includes(savedTheme)) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  // Apply the current theme to the app and persist it whenever it changes.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("fitflow-theme", theme);
    } catch (err) {
      console.warn("Could not save theme to localStorage:", err.message);
    }
  }, [theme]);

  return null;
};

export default ThemeManager;
