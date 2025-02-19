import { useState, useEffect } from 'react';
import themeManager from './themeManager';

/**
 * React hook for using theme manager
 * @returns {Object} Theme state and methods
 */
export function useTheme() {
  const [theme, setTheme] = useState(themeManager.getCurrentTheme());
  
  useEffect(() => {
    // Subscribe to theme changes
    const unsubscribe = themeManager.subscribe(newTheme => {
      setTheme(newTheme);
    });
    
    // Apply theme on mount
    themeManager.applyTheme();
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);
  
  return {
    accentColor: theme.color,
    darkMode: theme.darkMode,
    availableThemes: themeManager.VALID_THEMES,
    setTheme: themeManager.setTheme.bind(themeManager),
    toggleDarkMode: themeManager.toggleDarkMode.bind(themeManager)
  };
}