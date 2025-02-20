import { Work_Sans, Inclusive_Sans, Labrada, Fira_Code, Inria_Sans, Source_Serif_4, Fredoka, Roboto, Open_Sans, Reddit_Mono, } from '@next/font/google'

const workSans = Work_Sans({ subsets: ['latin'] })
const inclusiveSans = Inclusive_Sans({
  subsets: ['latin'],
  style: 'normal',
  weight: "400"
})
const labrada = Labrada({ subsets: ['latin'] })
const firaCode = Fira_Code({ subsets: ['latin'] })
const inriaSans = Inria_Sans({
  subsets: ['latin'],
  weight: "400"
})
const sourceSerif4 = Source_Serif_4({ subsets: ['latin'] })
const fredoka = Fredoka({ subsets: ['latin'] })
const roboto = Roboto({
  subsets: ['latin'],
  weight: "400"
})
const openSans = Open_Sans({ subsets: ['latin'] })
const redditMono = Reddit_Mono({
  subsets: ['latin'],
  weight: "400"
})

const fontOptions = [
  { value: workSans.className, label: "Work Sans" },
  { value: inclusiveSans.className, label: "Inclusive Sans" },
  { value: labrada.className, label: "Labrada" },
  { value: firaCode.className, label: "Fira Code" },
  { value: inriaSans.className, label: "Inria Sans" },
  { value: sourceSerif4.className, label: "Source Serif 4" },
  { value: fredoka.className, label: "Fredoka" },
  { value: roboto.className, label: "Roboto" },
  { value: openSans.className, label: "Open Sans" },
  { value: redditMono.className, label: "Reddit Mono" },
]

export function useFontOptions() {
  return fontOptions
}