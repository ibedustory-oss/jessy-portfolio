// Real visuals per project. Projects without an entry fall back to the
// typographic placeholder. Swap or add files under public/images/.
export interface ProjectImages {
  cover: string
  grid: string[]
}

const BP = process.env.NEXT_PUBLIC_BASE_PATH || ''

// Set to a path like `${BP}/images/portrait.jpg` once a photo exists.
// While null, the About page simply runs the bio full-width.
export const PORTRAIT: string | null = null

export const PROJECT_IMAGES: Record<string, ProjectImages> = {
  'atelier-why': {
    cover: `${BP}/images/atelier-why-desktop.jpg`,
    grid: [
      `${BP}/images/atelier-why-section-1.jpg`,
      `${BP}/images/atelier-why-section-2.jpg`,
      `${BP}/images/atelier-why-mobile.jpg`,
    ],
  },
  'food-school': {
    cover: `${BP}/images/food-school-desktop.jpg`,
    grid: [
      `${BP}/images/food-school-section-1.jpg`,
      `${BP}/images/food-school-reel.png`,
      `${BP}/images/food-school-mobile.jpg`,
    ],
  },
}
