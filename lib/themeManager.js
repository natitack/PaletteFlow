// List of valid theme colors
const VALID_THEMES = [
    'tomato', 'red', 'ruby', 'crimson', 'pink', 'plum', 'purple',
    'violet', 'iris', 'indigo', 'blue', 'cyan', 'teal', 'jade',
    'green', 'grass', 'lime', 'yellow', 'amber', 'orange', 'brown',
    'gray', 'mauve', 'slate', 'sage', 'olive', 'sand', 'sepia', 'brown',
    'bronze', 'gold','sky', 'mint',
  ];
  
  // Theme observer for React components to subscribe to changes
  const observers = new Set();
  
  const themeManager = {
    VALID_THEMES,
    
    /**
     * Set theme color and persist to localStorage
     * @param {string} color - Theme color to set
     * @returns {boolean} Success status
     */
    setTheme(color) {
      if (!VALID_THEMES.includes(color)) {
        console.error(`Invalid theme color: ${color}. Valid options are: ${VALID_THEMES.join(', ')}`);
        return false;
      }
      
      if (typeof window === 'undefined') return false;
      
      // Update localStorage
      localStorage.setItem('radix-theme-accent', color);
      
      // Update document attributes
      document.documentElement.setAttribute('data-theme', color);
      document.documentElement.style.setProperty('--accent-color', `var(--${color}-9)`);
      
      // Notify observers
      this._notifyObservers();
      
      return true;
    },
    
    /**
     * Toggle dark/light mode and persist to localStorage
     * @param {boolean} [forceDark] - Optional boolean to force specific mode
     * @returns {boolean} New dark mode state
     */
    toggleDarkMode(forceDark) {
      if (typeof window === 'undefined') return false;
      
      const currentMode = localStorage.getItem('radix-dark-mode') === 'dark';
      const newDarkMode = forceDark !== undefined ? forceDark : !currentMode;
      
      // Update localStorage
      localStorage.setItem('radix-dark-mode', newDarkMode ? 'dark' : 'light');
      
      // Update document classes
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Update color-scheme meta
      const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
      if (metaColorScheme) {
        metaColorScheme.setAttribute('content', newDarkMode ? 'dark' : 'light');
      }
      
      // Notify observers
      this._notifyObservers();
      
      return newDarkMode;
    },
    
    /**
     * Get current theme settings
     * @returns {Object} Current theme settings
     */
    getCurrentTheme() {
      if (typeof window === 'undefined') {
        return { color: 'blue', darkMode: false };
      }
      
      return {
        color: localStorage.getItem('radix-theme-accent') || 'blue',
        darkMode: localStorage.getItem('radix-dark-mode') === 'dark'
      };
    },
    
    /**
     * Apply the saved theme on page load
     */
    applyTheme() {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('radix-theme-accent');
        const savedMode = localStorage.getItem('radix-dark-mode') === 'dark';
        
        if (savedTheme) this.setTheme(savedTheme);
        this.toggleDarkMode(savedMode);
      }
    },
    
    /**
     * Subscribe to theme changes
     * @param {Function} callback - Function to call when theme changes
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
      observers.add(callback);
      
      // Return unsubscribe function
      return () => {
        observers.delete(callback);
      };
    },
    
    /**
     * Notify all observers of theme change
     * @private
     */
    _notifyObservers() {
      const currentTheme = this.getCurrentTheme();
      observers.forEach(callback => callback(currentTheme));
    }
  };
  
  export default themeManager;