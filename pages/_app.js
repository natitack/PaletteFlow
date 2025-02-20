import '../global.css'
import { Theme } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css" // Ensure styles are imported
import themeManager from '../lib/themeManager';
import { useTheme } from '../lib/useTheme';
import { useEffect } from 'react';
import { Work_Sans, Inclusive_Sans, Labrada, Fira_Code, Inria_Sans, Source_Serif_4, Fredoka, Roboto, Open_Sans, Reddit_Mono } from '@next/font/google'

const workSans = Work_Sans({ subsets: ['latin'] })
const inclusiveSans = Inclusive_Sans({ subsets: ['latin'], style: 'normal', weight: "400" })
const labrada = Labrada({ subsets: ['latin'] })
const firaCode = Fira_Code({ subsets: ['latin'] })
const inriaSans = Inria_Sans({ subsets: ['latin'], weight: "400" })
const sourceSerif4 = Source_Serif_4({ subsets: ['latin'] })
const fredoka = Fredoka({ subsets: ['latin'] })
const roboto = Roboto({ subsets: ['latin'], weight: "400" })
const openSans = Open_Sans({ subsets: ['latin'] })
const redditMono = Reddit_Mono({ subsets: ['latin'] })

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
      <style jsx global>{`
        :root {
          --font-work-sans: ${workSans.style.fontFamily};
          --font-inclusive-sans: ${inclusiveSans.style.fontFamily};
          --font-labrada: ${labrada.style.fontFamily};
          --font-fira-code: ${firaCode.style.fontFamily};
          --font-inria-sans: ${inriaSans.style.fontFamily};
          --font-source-serif-4: ${sourceSerif4.style.fontFamily};
          --font-fredoka: ${fredoka.style.fontFamily};
          --font-roboto: ${roboto.style.fontFamily};
          --font-open-sans: ${openSans.style.fontFamily};
          --font-reddit-mono: ${redditMono.style.fontFamily};
        }
        body {
          font-family: var(--font-work-sans), Arial, Helvetica, sans-serif;
        }
      `}</style>
      
      <Component {...pageProps} />
    </Theme>
  );
}