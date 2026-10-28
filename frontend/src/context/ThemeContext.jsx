import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const THEMES = {
  IVORY: 'ivory',
  CANDLELIGHT: 'candlelight',
  MIDNIGHT: 'midnight',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pageturner_theme') || THEMES.IVORY;
  });

  useEffect(() => {
    localStorage.setItem('pageturner_theme', theme);
    const root = document.documentElement;

    // Remove any previous theme classes
    root.classList.remove('theme-ivory', 'theme-candlelight', 'theme-midnight');
    root.classList.add(`theme-${theme}`);

    // Update body background for smooth transitions
    if (theme === THEMES.MIDNIGHT) {
      document.body.style.backgroundColor = '#131114';
      document.body.style.color = '#F3EDE2';
    } else if (theme === THEMES.CANDLELIGHT) {
      document.body.style.backgroundColor = '#211914';
      document.body.style.color = '#F8EFE4';
    } else {
      document.body.style.backgroundColor = '#FAF7F2';
      document.body.style.color = '#1C1917';
    }
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === THEMES.IVORY) return THEMES.CANDLELIGHT;
      if (prev === THEMES.CANDLELIGHT) return THEMES.MIDNIGHT;
      return THEMES.IVORY;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};
