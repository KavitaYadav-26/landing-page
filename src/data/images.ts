/**
 * Real-world photography (Unsplash & Pexels, both free for commercial use).
 * For production, download these into /public/images and point the paths here —
 * or swap in the client's own fleet and warehouse photos.
 */
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&w=${w}`
const pexels = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

export const images = {
  hero: unsplash('1682033239487-30f076c82232', 1920),
  fleet: unsplash('1682033240184-262fdb8234cb', 1400),
  warehouse: pexels(4483862, 1400),
  warehouseWide: pexels(4483610, 1920),
  warehouseAisle: pexels(8377802, 1400),
}
