import { updateRoc, setuproc, getRocRect } from "./Rocket.js"
import {
  updatePipes,
  setupPipes,
  getPassedPipesCount,
  getPipeRects,
} from "./pipe.js"

document.addEventListener("keypress", handleStart, { once: true })
const title = document.querySelector("[data-title]")
const subtitle = document.querySelector("[data-subtitle]")

let lastTime
function updateLoop(time) {
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(updateLoop)
    return
  }
  const delta = time - lastTime
  updateRoc(delta)
  updatePipes(delta)
  if (checkLose()) return handleLose()
  lastTime = time
  window.requestAnimationFrame(updateLoop)
}

function checkLose() {
  const RocketRect = getRocRect()
  const insidePipe = getPipeRects().some(rect => isCollision(RocketRect, rect))
  const outsideWorld = RocketRect.top < 0 || RocketRect.bottom > window.innerHeight
  return outsideWorld || insidePipe
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}

function handleStart() {
  title.classList.add("hide")
  setuproc()
  setupPipes()
  lastTime = null
  window.requestAnimationFrame(updateLoop)
}

function handleLose() {
  setTimeout(() => {
    title.classList.remove("hide")
    subtitle.classList.remove("hide")
    subtitle.textContent = `${getPassedPipesCount()} Pipes`
    document.addEventListener("keypress", handleStart, { once: true })
  }, 100)
}

// In script.js

// Import the necessary functions from Rocket.js
import { handleButtonJump } from "./Rocket.js";

// Add an event listener to the HTML input
document.addEventListener("DOMContentLoaded", () => {
  const controlInput = document.getElementById("controlButton");
  controlInput.addEventListener("input", handleButtonJump);
});
