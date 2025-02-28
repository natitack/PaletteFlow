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
}

export type Header1Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>

export const Header1 = ({ choices }: { choices: Partial<Props> }) => {
  const { heading, description, buttons, image, buttonStyle = "medium" } = {
    ...Header1Defaults,
    ...choices
  }

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="mb-5 text-4xl font-bold md:mb-6 md:text-6xl lg:text-7xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button 
                  key={index} 
                  variant={button.variant === "primary" ? "solid" : button.variant === "secondary" ? "outline" : undefined}
                  radius={buttonStyle} 
                >
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <img src={image.src} className="w-full object-cover" alt={image.alt} />
          </div>
        </div>
      </div>
    </section>
  )
}

// Default fallback values
export const Header1Defaults: Props = {
  heading: "Hero 1",
  description: "A branding experience tailored for you.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  image: { src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg", alt: "Relume placeholder image" },
  buttonStyle: "medium" 
}

