import { Button } from "@radix-ui/themes"

type ImageProps = {
  src: string
  alt?: string
}

type Props = {
  heading: string
  description: string
  buttons: { title: string; variant?: "primary" | "secondary" }[]
  image: ImageProps
  buttonStyle?: "none" | "small" | "medium" | "large" | "full" 
  heroLayout?: "header1" | "header2" | "header3" | "header4"
}

export type RelumeHeaderProps = React.ComponentPropsWithoutRef<"section"> & Partial<Props>

export const RelumeHeader = ({ choices }: { choices: Partial<Props> }) => {
  const { heading, description, buttons, image, buttonStyle = "medium", heroLayout } = {
    ...RelumeHeaderDefaults,
    ...choices
  }

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        {heroLayout === "header1" && <Header1 heading={heading} description={description} buttons={buttons} image={image} buttonStyle={buttonStyle} />}
        {heroLayout === "header2" && <Header2 heading={heading} description={description} buttons={buttons} image={image} buttonStyle={buttonStyle} />}
        {heroLayout === "header3" && <Header3 heading={heading} description={description} buttons={buttons} image={image} buttonStyle={buttonStyle} />}
        {heroLayout === "header4" && <Header4 heading={heading} description={description} buttons={buttons} image={image} buttonStyle={buttonStyle} />}
      </div>
    </section>
  )
}

// Default fallback values
export const RelumeHeaderDefaults: Props = {
  heading: "Hero Section",
  description: "A branding experience tailored for you.",
  buttons: [
    { title: "Primary Button", variant: "primary" },
    { title: "Secondary Button", variant: "secondary" }
  ],
  image: { src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg", alt: "Relume placeholder image" },
  buttonStyle: "medium",
  heroLayout: "header1"
}

// Individual Hero Layout Components
const Header1 = ({ heading, description, buttons, image, buttonStyle }: Props) => (
  <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
    <div>
      <h1 className="mb-5 text-4xl font-bold md:mb-6 md:text-6xl lg:text-7xl">{heading}</h1>
      <p className="md:text-md">{description}</p>
      <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
        {buttons.map((button, index) => (
          <Button key={index} variant={button.variant === "primary" ? "solid" : "outline"} radius={buttonStyle}>
            {button.title}
          </Button>
        ))}
      </div>
    </div>
    <div>
      <img src={image.src} className="w-full object-cover" alt={image.alt} />
    </div>
  </div>
)

const Header2 = ({ heading, description, buttons, image, buttonStyle }: Props) => (
  <div className="flex flex-col items-center text-center">
    <h1 className="mb-5 text-4xl font-bold md:mb-6 md:text-6xl lg:text-7xl">{heading}</h1>
    <p className="md:text-md max-w-xl">{description}</p>
    <div className="mt-6 flex gap-4">
      {buttons.map((button, index) => (
        <Button key={index} variant={button.variant === "primary" ? "solid" : "outline"} radius={buttonStyle}>
          {button.title}
        </Button>
      ))}
    </div>
    <div className="mt-8">
      <img src={image.src} className="max-w-md object-cover" alt={image.alt} />
    </div>
  </div>
)

const Header3 = ({ heading, description, buttons, image, buttonStyle }: Props) => (
  <div className="flex flex-col-reverse lg:flex-row items-center lg:justify-between text-left">
    <div className="lg:w-1/2">
      <h1 className="mb-5 text-4xl font-bold md:mb-6 md:text-6xl lg:text-7xl">{heading}</h1>
      <p className="md:text-md">{description}</p>
      <div className="mt-6 flex gap-4">
        {buttons.map((button, index) => (
          <Button key={index} variant={button.variant === "primary" ? "solid" : "outline"} radius={buttonStyle}>
            {button.title}
          </Button>
        ))}
      </div>
    </div>
    <div className="lg:w-1/2">
      <img src={image.src} className="w-full object-cover" alt={image.alt} />
    </div>
  </div>
)

const Header4 = ({ heading, description, buttons, image, buttonStyle }: Props) => (
  <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white p-12 rounded-lg">
    <div className="container">
      <h1 className="mb-5 text-4xl font-bold md:mb-6 md:text-6xl lg:text-7xl">{heading}</h1>
      <p className="md:text-md">{description}</p>
      <div className="mt-6 flex gap-4">
        {buttons.map((button, index) => (
          <Button key={index} variant={button.variant === "primary" ? "solid" : "outline"} radius={buttonStyle}>
            {button.title}
          </Button>
        ))}
      </div>
    </div>
    <div className="absolute top-0 right-0 opacity-25">
      <img src={image.src} className="w-1/2 object-cover" alt={image.alt} />
    </div>
  </div>
)


