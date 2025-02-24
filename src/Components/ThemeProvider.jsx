import React, { useEffect } from "react";
import { useSelector } from "react-redux";

// ThemeProvider component
const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const modalRoot = document.querySelector("body");
    if (modalRoot) {
      if (theme === "dark") {
        // Apply the dark class to the body based on the selected theme
        modalRoot.classList.add("dark");
      } else {
        modalRoot.classList.remove("dark");
      }
      // Set the background color based on the theme
      modalRoot.style.backgroundColor = theme === "dark" ? "black" : "white";
    }
  }, [theme]);

  return (
    <div className={theme}>
      <div className="bg-white  text-black dark:text-white dark:bg-gray-900 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
