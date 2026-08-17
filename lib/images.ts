// Real visuals per project. Projects without an entry fall back to the
// typographic placeholder. Swap or add files under public/images/.
export interface ProjectImages {
  cover: string
  grid: string[]
}

export const PROJECT_IMAGES: Record<string, ProjectImages> = {
  'atelier-why': {
    cover: '/images/atelier-why-desktop.jpg',
    grid: [
      '/images/atelier-why-section-1.jpg',
      '/images/atelier-why-section-2.jpg',
      '/images/atelier-why-mobile.jpg',
    ],
  },
  'food-school': {
    cover: '/images/food-school-desktop.jpg',
    grid: [
      '/images/food-school-section-1.jpg',
      '/images/food-school-reel.png',
      '/images/food-school-mobile.jpg',
    ],
  },
}
