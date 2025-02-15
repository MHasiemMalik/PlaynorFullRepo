import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js"

const dinoElem = document.querySelector("[data-dino]")
const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping
let dinoFrame
let currentFrameTime
let yVelocity
export function setupDino() {
  isJumping = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  setCustomProperty(dinoElem, "--bottom", 0)
  document.removeEventListener("keydown", onJump)
  document.addEventListener("keydown", onJump)
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale)
  handleJump(delta)
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect()
}

export function setDinoLose() {
  dinoElem.src = "imgs/Dino Lost.gif"
}

function handleRun(delta, speedScale) {
  
  if (isJumping) {
    // Set the dino image to jumping state
    dinoElem.src = `imgs/My dino.gif`
    return
  } 
    
  
  // Update the frame if needed
    if (currentFrameTime >= FRAME_TIME) {
      dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
      currentFrameTime -= FRAME_TIME
    }
    currentFrameTime += delta * speedScale
  }

function handleJump(delta) {
  //if (!isJumping) return

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0)
    isJumping = false
  }

  yVelocity -= GRAVITY * delta
}

/*function onJump(e) {
  if (e.code !== "Space" || isJumping) return

  yVelocity = JUMP_SPEED
  isJumping = true
}
*/

function onJump(e) {
  const jumpConditions = ["Space", "KeyU"]; // Define keys for jump action
  const isJumpKey = jumpConditions.includes(e.code); // Check if the pressed key is in the jump keys array
  const isInputFocused = document.activeElement.tagName === "INPUT"; // Check if an input element is focused
  
  if (!isJumpKey && !isInputFocused) return; // Exit if the pressed key is not for jump and input is not focused
  
  if (!isJumping) {
    yVelocity = JUMP_SPEED;
    isJumping = true;
  }
}