import { useEffect, useState } from "react";

export const themItem = {
  Light: "light",
  Dark: "dark",
};

const useTheme = () => {
  const [mode, setMode] = useState(themItem.Light);

  const handleMode = () => {
    const html = document.documentElement;
    if (mode === themItem.Light) {
      html.classList.remove(themItem.Light);
      html.classList.add(themItem.Dark);
      setMode(themItem.Dark);
      localStorage.setItem("theme", themItem.Dark);
    } else {
      html.classList.remove(themItem.Dark);
      html.classList.add(themItem.Light);
      setMode(themItem.Light);
      localStorage.setItem("theme", themItem.Light);
    }
  };

  useEffect(() => {
    const html = document.documentElement;
    const localTheme = localStorage.getItem("theme") || themItem.Light;
    setMode(localTheme);

    html.classList.add(localTheme);
    html.setAttribute("data-theme", localTheme);
  }, [mode]);

  return { mode, handleMode };
};

export default useTheme;
