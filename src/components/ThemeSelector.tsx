import React from 'react';
import { useTheme, Theme } from '../context/ThemeProvider';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value as Theme;
    setTheme(selectedTheme);
  };

  return (
    <div className="theme-selector">
      <label htmlFor="theme-select">Select Theme: </label>
      <select id="theme-select" value={theme} onChange={handleChange}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
};

export default ThemeSelector;
