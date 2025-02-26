const Utils = {
  randomIntFromRange: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  randomColor: (colors) => {
    return colors[Math.floor(Math.random() * colors.length)]
  },

  distance: (x1, y1, x2, y2) => {
    const xDist = x2 - x1
    const yDist = y2 - y1
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
  },

  lerp: (a, b, t) => a + (b - a) * t,

  clamp: (n, min, max) => Math.max(min, Math.min(n, max)),

  mapRange: (value, inMin, inMax, outMin, outMax) =>
    outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin),

  clamp01: (n) => Utils.clamp(n, 0, 1),

  sign: (n) => (n < 0 ? -1 : 1),

  ease: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  easeInOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
}

export default Utils
