
# Software Bill of Materials (SBOM)

**Project Name:** PaletteFlow  
**Team:** Nathan Nelson, Kameron Beamer, Bennett Hamilton  
**Client:** farewell  
**Last Updated:** 05-14-2025  

## Overview

This SBOM documents all 3rd-party software packages, libraries, tools, and dependencies used in the PaletteFlow project. It includes the version, license type, usage notes, maintenance requirements, and compliance status for each component. This ensures transparency, licensing compliance, and long-term maintainability of the system.

## Component Inventory

| Name | Version | License | Type | Usage | Compliance |
|------|---------|---------|------|--------|------------|
| Next.js | ^14.2.21 | MIT | Framework | React-based SSR frontend framework | MIT license allows commercial use, distribution, modification |
| React | ^18.2.0 | MIT | Library | Core UI library | MIT-compliant |
| React DOM | ^18.2.0 | MIT | Library | DOM bindings for React | MIT-compliant |
| TypeScript | 5.7.3 | Apache-2.0 | Dev Tool | Static typing for JavaScript | Apache-2.0 is permissive |
| Tailwind CSS | ^4.0.6 | MIT | CSS Framework | Utility-first CSS styling | MIT-compliant |
| PostCSS | ^8.5.2 | MIT | Build Tool | CSS transformation pipeline | MIT-compliant |
| @tailwindcss/postcss | ^4.0.6 | MIT | Plugin | Tailwind + PostCSS integration | MIT-compliant |
| Framer Motion | ^12.4.2 | MIT | Animation Library | UI animation for components | MIT-compliant |
| @relume_io/relume-tailwind | ^1.3.0 | Custom/Proprietary | Design System | Relume’s Tailwind theming for components | Covered under team’s Relume license |
| @relume_io/relume-ui | ^1.3.0 | Custom/Proprietary | Component Library | Component library used throughout app | Covered under team’s Relume license |
| @radix-ui/themes | ^3.2.0 | MIT | Design System | Themeable UI primitives | MIT-compliant |
| radix-ui | ^1.1.3 | MIT | UI Library | Low-level unstyled UI components | MIT-compliant |
| html2canvas-pro | ^1.5.8 | GPL-3.0 | Screenshot utility | Used to render HTML to canvas (PDF export) | GPL license requires source disclosure if distributed |
| jsPDF | ^3.0.0 | MIT | PDF Generator | Used with html2canvas to generate PDFs | MIT-compliant |
| @types/node | 22.13.1 | MIT | Dev Types | Type definitions for Node.js | MIT-compliant |
| @types/react | 19.0.8 | MIT | Dev Types | Type definitions for React | MIT-compliant |

## Hosting & Infrastructure

| Service | Use | License/Terms | Cost | Compliance |
|---------|-----|----------------|------|------------|
| Vercel | Hosting the production build of the Next.js app with GitHub CI/CD integration | Proprietary | Free Tier | Compliant with Vercel’s terms of use |

## Noteworthy Considerations

- html2canvas-pro uses the GPL-3.0 license, which may introduce legal obligations if you distribute the software commercially. Consider replacing it with an MIT-licensed alternative like `html2canvas` if necessary.

- Relume Components are covered under a proprietary license; ongoing access depends on subscription status. Verify ongoing support and updates if this is a production system.

## Maintenance Notes

- Packages should be monitored for security vulnerabilities using tools like:
  - `npm audit`
  - GitHub Dependabot
  - Open Source Review Toolkit (ORT)

- Schedule regular updates for dependencies, particularly Next.js, React, and TailwindCSS to ensure compatibility and security.

## License Compliance Summary

All components have been vetted for license compatibility with commercial and educational use. No packages with restrictive or incompatible licenses (e.g., AGPL) are used. html2canvas-pro requires attention for redistribution scenarios.

## Client Sign-Off

The client has reviewed and approved the SBOM via Slack. A screenshot of their approval is stored in the repository.

**Approval Screenshot:** [Screenshot Link]  
**Date of Approval:** [Date]  
**Client Name:** [Client Name]  
**Statement:** "I, [Client Name], approve the SBOM for the PaletteFlow project on [Date]."

## Repository

SBOM Location: [https://github.com/YOUR_REPO_NAME/docs/SBOM.md](#)
