import '../global.css'
import { Theme } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css" // Ensure styles are imported

export default function MyApp({ Component, pageProps }) {
  return (
    <Theme>
      <Component {...pageProps} />
    </Theme>
  )
}
