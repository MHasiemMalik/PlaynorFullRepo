import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js"

//import { getDinoColor } from "./Dinocolor.js";


let dinoColor
const dinoElem = document.querySelector("[data-dino]")
const dinoElemType = document.querySelector("[data-dino-type]")
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
  // Use the selectedDinoColor variable here
  let dinoLoseSrc;
  console.log(window.selectedDinoColor);
  // Check the selected color and update the image source accordingly
  if (window.selectedDinoColor === "green") {
    dinoLoseSrc = "imgs/dino-lose - green.png";
  } else if (window.selectedDinoColor === "Orange") {
    dinoLoseSrc = "imgs/dino-lose - orange.png";
  } else if (window.selectedDinoColor === "Black") {
    dinoLoseSrc = "imgs/dino-lose - black.png";
  } else if (window.selectedDinoColor === "White") {
    dinoLoseSrc = "imgs/dino-lose - white.png";
  } else if (window.selectedDinoColor === "Red") {
    dinoLoseSrc = "imgs/dino-lose - red.png";
  } else if (window.selectedDinoColor === "Yellow") {
    dinoLoseSrc = "imgs/dino-lose - yellow.png";
  } else if (window.selectedDinoColor === "Pink") {
    dinoLoseSrc = "imgs/dino-lose - pink.png";
  } else if (window.selectedDinoColor === "Cyan") {
    dinoLoseSrc = "imgs/dino-lose - Cyan.png";
  } else if (window.selectedDinoColor === "Purple") {
    dinoLoseSrc = "imgs/dino-lose - purple.png";
  } else if (window.selectedDinoColor === "Teal") {
    dinoLoseSrc = "imgs/dino-lose - Teal.png";
  } else if (window.selectedDinoColor === "Gold") {
    dinoLoseSrc = "imgs/dino-lose - gold.png";
  } else if (window.selectedDinoColor === "Lime") {
    dinoLoseSrc = "imgs/dino-lose - Lime.png";
  } else if (window.selectedDinoColor === "Cream") {
    dinoLoseSrc = "imgs/dino-lose - Cream.png";
  } else if (window.selectedDinoColor === "Peach") {
    dinoLoseSrc = "imgs/dino-lose - Peach.png";
  } else {
    dinoLoseSrc = "imgs/dino-lose - classic.png";
  }

  dinoElem.src = dinoLoseSrc; // Update the image source
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = `imgs/dino-stationary - classic.png`
    
  console.log(window.selectedDinoColor);
  // Check the selected color and update the image source accordingly
  if (window.selectedDinoColor === "green") {
    dinoElem.src = "imgs/dino-stationary - green.png";
  } else if (window.selectedDinoColor === "Orange") {
    dinoElem.src = "imgs/dino-stationary - orange.png";
  } else if (window.selectedDinoColor === "Black") {
    dinoElem.src = "imgs/dino-stationary - black.png";
  } else if (window.selectedDinoColor === "White") {
    dinoElem.src = "imgs/dino-stationary - white.png";
  } else if (window.selectedDinoColor === "Red") {
    dinoElem.src = "imgs/dino-stationary - red.png";
  } else if (window.selectedDinoColor === "Yellow") {
    dinoElem.src = "imgs/dino-stationary - yellow.png";
  } else if (window.selectedDinoColor === "Pink") {
    dinoElem.src = "imgs/dino-stationary - pink.png";
  } else if (window.selectedDinoColor === "Cyan") {
    dinoElem.src = "imgs/dino-stationary - Cyan.png";
  } else if (window.selectedDinoColor === "Purple") {
    dinoElem.src = "imgs/dino-stationary - purple.png";
  } else if (window.selectedDinoColor === "Teal") {
    dinoElem.src = "imgs/dino-stationary - Teal.png";
  } else if (window.selectedDinoColor === "Gold") {
    dinoElem.src = "imgs/dino-stationary - gold.png";
  } else if (window.selectedDinoColor === "Lime") {
    dinoElem.src = "imgs/dino-stationary - Lime.png";
  } else if (window.selectedDinoColor === "Cream") {
    dinoElem.src = "imgs/dino-stationary - Cream.png";
  } else if (window.selectedDinoColor === "Peach") {
    dinoElem.src = "imgs/dino-stationary - Peach.png";
  } else {
    dinoElem.src = "imgs/dino-stationary - classic.png";
  }
    return
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
    //dinoElem.src = `imgs/dino-run-${dinoFrame} - classic.png`


    console.log(window.selectedDinoColor);
  // Check the selected color and update the image source accordingly
  if (window.selectedDinoColor === "green") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - green.png`;
  } else if (window.selectedDinoColor === "Orange") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - orange.png`;
  } else if (window.selectedDinoColor === "Black") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - black.png`;
  } else if (window.selectedDinoColor === "White") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - white.png`;
  } else if (window.selectedDinoColor === "Red") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - red.png`;
  } else if (window.selectedDinoColor === "Yellow") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - yellow.png`;
  } else if (window.selectedDinoColor === "Pink") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - pink.png`;
  } else if (window.selectedDinoColor === "Cyan") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - Cyan.png`;
  } else if (window.selectedDinoColor === "Purple") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - purple.png`;
  } else if (window.selectedDinoColor === "Teal") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - Teal.png`;
  } else if (window.selectedDinoColor === "Gold") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - gold.png`;
  } else if (window.selectedDinoColor === "Lime") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - Lime.png`;
  } else if (window.selectedDinoColor === "Cream") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - Cream.png`;
  } else if (window.selectedDinoColor === "Peach") {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - Peach.png`;
  } else {
    dinoElem.src = `imgs/dino-run-${dinoFrame} - classic.png`;
  }

    currentFrameTime -= FRAME_TIME
  }
  currentFrameTime += delta * speedScale
}

function handleJump(delta) {
  if (!isJumping) return

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0)
    isJumping = false
  }

  yVelocity -= GRAVITY * delta
}

/*function onJump(e) {
  if (e.code !== "Space"  ||  isJumping) return

  yVelocity = JUMP_SPEED
  isJumping = true
}*/

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


