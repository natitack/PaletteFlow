# PaletteFlow
PaletteFlow is a tool developed by students at OSU-Cascades in collaboration with fare*well, designed to streamline the client onboarding process for customers building a website. Its primary objective is to provide an intuitive platform that assists clients in establishing a preliminary brand identity, enabling a faster start to site development. PaletteFlow guides users through the selection of an initial color and brand archetype, leveraging this information to generate an accessible color palette and site theme. Users can further customize their theme, and PaletteFlow produces a branding document that can be exported as a PDF.

## How to Deploy

This project is built on Next.JS 14, and can be easily deployed to Vercel. To deploy PaletteFlow, refer to the [Vercel deployment guide](https://vercel.com/docs/getting-started-with-vercel/import). This resource provides step-by-step instructions for importing your project, configuring settings, and launching your application on Vercel.

## Architecture Overview

## Adding New Relume Components

PaletteFlow supports modular addition of new Relume hero and feature components. Code for these components can be copied directly from the Relume website. To add a new Relume component (such as a hero or feature layout), follow these steps:

1. **Create the Component**

   - Copy the component code from the Relume website and save it as a `.tsx` file.
   - Place your new component file in the appropriate directory:
     - Hero components: `/components/heroelements/`
     - Feature components: `/components/featureelelemts/`

2. **Register the Component**

   - For hero components, edit `/components/heroelements/RelumeHeroWrapper.tsx` and add your new component to the `heroLayouts` map.
   - For feature components, edit `/components/featureelelemts/RelumeFeatureWrapper.tsx` and add your new component to the `featureLayouts` map.


3. **Add Preview Images**

   - Remember to add a PNG preview image of your layout to the associated public directory:
     - Hero: `/public/images/previews/hero/`
     - Feature: `/public/images/previews/feature/`
   - Name the image file to match your layout key (e.g., `header99.png`).
   - Preview images are required for all new layouts to ensure they appear correctly in the deliverable export.

**Summary:**  
- Create your component in the correct folder (copy from Relume if needed).  
- Register it in the wrapper (`RelumeHeroWrapper` or `RelumeFeatureWrapper`).  
- Add a preview image for deliverables (required).

## Adding New Fonts

PaletteFlow allows you to easily add new Google Fonts for users to select. To add a new font option:

1. **Import the Font**

   - Open `/hooks/useFontOptions.ts`.
   - Import your desired font from `next/font/google`. For example:
     ```typescript
     import { Lato } from "next/font/google";
     ```

2. **Initialize the Font**

   - Create a font instance with the required options:
     ```typescript
     const lato = Lato({ subsets: ["latin"], weight: "400" });
     ```

3. **Add to Font Options**

   - Add your new font to the `fontOptions` array:
     ```typescript
     { value: lato.className, label: "Lato" },
     ```

4. **Use in the Font Picker**

   - The new font will automatically appear in the font selection dropdown in the UI (e.g., in the FontStep component).

**Summary:**  
- Import the font in `/hooks/useFontOptions.ts`.
- Initialize it and add it to the `fontOptions` array.
- The font will be available for users to select in the app.

## Updating the Mood Step

The Mood Step in PaletteFlow allows users to select a brand personality, which automatically sets related style options such as font, button style, and color mood. To update or add new moods, follow these steps:

1. **Open the MoodStep Component**

   - Edit the file: `/components/steps/MoodStep.tsx`.

2. **Modify the MOOD_CONFIG Object**

   - Locate the `MOOD_CONFIG` constant at the top of the file.
   - To **add a new mood**, add a new entry to the object with a unique key. Each mood should include:
     - `label`: Display name
     - `emoji`: Emoji icon
     - `description`: Short description
     - `styles`: An object with the following properties:
       - `font`: The label of a font from your font options (e.g., `"Nunito"`)
       - `buttonStyle`: Button style string (e.g., `"medium"`)
       - `heroLayout`: Hero layout key (e.g., `"header1"`)
       - `featureLayout`: Feature layout key (e.g., `"layout398"`)
       - `chroma`: Chroma value (number, e.g., `0.30`)
       - `lightness`: Lightness value (number, e.g., `0.90`)

   - Example:
     ```typescript
     newmood: {
       label: "New Mood",
       emoji: "🌟",
       description: "Energetic, fresh, unique",
       styles: {
         font: "Nunito",
         buttonStyle: "medium",
         heroLayout: "header1",
         featureLayout: "layout398",
         chroma: 0.50,
         lightness: 0.75
       }
     }
     ```

   - To **edit an existing mood**, update its properties as needed.

3. **Ensure Font Mapping**

   - The `font` property in each mood’s `styles` should match the `label` of a font in your `/hooks/useFontOptions.ts` file.

4. **Save and Test**

   - Save your changes. The new or updated mood will appear in the Mood Step UI, and selecting it will update the brand’s style settings accordingly.

**Summary:**  
- Edit `MOOD_CONFIG` in `/components/steps/MoodStep.tsx` to add or update moods.
- Use font labels that exist in your font options.
- Save and test the Mood Step in the app.