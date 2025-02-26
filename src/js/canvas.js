import Utils from './utils.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const settings = {
  animate: true,
  duration: 10,
  dimensions: [1080, 1920],
  fps: 5,
  loop: true,
}

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
}

const colors = ['#ffffff', '#000000', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Objects
class Line {
  constructor({ startPosition, finishPosition, color }) {
    this.startPosition = startPosition
    this.finishPosition = finishPosition
    this.angle = Math.random() * Math.PI * 2
    this.offset = Math.random()
    this.color = color
    this.progress = 0
  }

  draw() {
    c.save()
    c.rotate(this.angle)
    let opacity = 1
    if (this.progress < 0.4) {
      opacity = this.progress / 0.4
    }
    c.strokeStyle = 'rgba(255,255,255,' + opacity + ')'
    c.lineWidth = 2
    c.beginPath()
    c.moveTo(this.startPosition.x * this.progress, this.startPosition.y)
    c.lineTo(this.finishPosition.x * this.progress, this.finishPosition.y)
    c.stroke()
    c.closePath()
    c.restore()
  }

  update(playhead) {
    this.progress = (1 - playhead + this.offset) % 1
    this.progress = Utils.easeInOutQuint(this.progress)
    this.draw()
  }
}

// Objects
class Symbol {
  constructor({ x, y }) {
    this.x = x
    this.y = y
    this.progress = 0
    this.offset = Math.random()
    this.number = 3 + Math.floor(Math.random() * 4)
    this.coords = []

    for (let i = 0; i < this.number; i++) {
      let theta = (i * 2 * Math.PI) / this.number + this.offset * 2 * Math.PI
      let cx = this.x + 8 * Math.sin(theta)
      let cy = this.y + 8 * Math.cos(theta)
      this.coords.push([cx, cy])
    }
  }

  draw() {
    let realprogress = 1
    if (this.progress < 0.8) {
      realprogress = this.progress / 0.8
      realprogress = Utils.easeInOutQuint(realprogress)
    }

    c.strokeStyle = 'rgba(255,255,255,' + this.progress + ')'

    c.beginPath()
    // c.arc(this.x * this.progress, this.y * this.progress, 6, 0, 2 * Math.PI)
    c.moveTo(this.coords[0][0] * realprogress, this.coords[0][1] * realprogress)
    for (let i = 0; i < this.number; i++) {
      c.lineTo(
        this.coords[i][0] * realprogress,
        this.coords[i][1] * realprogress
      )
    }
    c.closePath()
    c.stroke()
  }

  update(playhead) {
    this.progress = (1 - playhead + this.offset) % 1
    this.draw()
  }
}

// Implementation
let lines
let symbols

let pres = 400
let image = Array.from(Array(pres), () => new Array(pres))
var img = new Image()
img.onload = function () {
  let canv = document.createElement('canvas')
  let ctx = canv.getContext('2d')

  // Set canvas size to match the image
  canv.width = pres
  canv.height = pres

  // Draw the image on the canvas
  ctx.drawImage(img, 0, 0, canv.width, canv.height)

  // Get image data
  let data = ctx.getImageData(0, 0, canv.width, canv.height)

  for (let i = 0; i < data.data.length; i = i + 4) {
    let x = (i / 4) % canv.width
    let y = Math.floor(i / 4 / canv.height)

    image[x][y] = data.data[i]

    // console.log(image)

    if (image[x][y] < 10 && Math.random() > 0.85) {
      symbols.push(
        new Symbol({
          x: (x - pres / 2) * 4,
          y: (y - pres / 2) * 4,
          color: colors[i],
        })
      )
    }
  }
}

img.src = '/test.jpg'
function init() {
  lines = []
  let lineNumber = 500
  symbols = []
  let symbolNumber = 100

  for (let i = 0; i < lineNumber; i++) {
    lines.push(
      new Line({
        startPosition: { x: innerWidth / 1.5, y: 0 },
        finishPosition: {
          x: innerWidth,
          y: 0,
        },
        color: colors[i],
      })
    )
  }
}

// Animation Loop
let startTime = null
const frameDuration = 1000 / settings.fps

function animate(time) {
  if (!startTime) startTime = time
  const elapsedTime = (time - startTime) / frameDuration

  let playhead = (elapsedTime % settings.duration) / settings.duration

  c.fillStyle = `rgba(0,0,0)`
  c.fillRect(0, 0, canvas.width, canvas.height)

  c.save()
  c.translate(innerWidth / 2, innerHeight / 2)

  lines.forEach((line, i) => {
    line.update(playhead)
  })

  symbols.forEach((symbol, i) => {
    symbol.update(playhead)
  })
  c.restore()

  if (settings.loop) {
    if (settings.animate) {
      requestAnimationFrame(animate) // Continue the animation
    }
  } else {
    if (settings.animate && elapsedTime < settings.duration) {
      requestAnimationFrame(animate) // Continue the animation
    }
  }
}

init()
animate(0)

function startCanvas() {}
export { startCanvas }
