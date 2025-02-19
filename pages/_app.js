import '../global.css'
import { Theme } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css" // Ensure styles are imported
import themeManager from '../lib/themeManager';
import { useTheme } from '../lib/useTheme';
import { useEffect } from 'react';


export default function MyApp({ Component, pageProps }) {
  const { accentColor, darkMode } = useTheme();
  // Apply theme on initial load
  useEffect(() => {
    themeManager.applyTheme();
  }, []);

  return (
    <Theme 
      accentColor={accentColor}
      appearance={darkMode ? 'dark' : 'light'}
      radius="medium"
      scaling="100%"
    >
      <Component {...pageProps} />
    </Theme>
  );
  
}
