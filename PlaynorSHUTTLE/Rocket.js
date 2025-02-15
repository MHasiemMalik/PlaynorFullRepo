const rocElem = document.querySelector("[data-rocket]")
const ROC_SPEED = 0.5
const JUMP_DURATION = 125
let timeSinceLastJump = Number.POSITIVE_INFINITY

export function setuproc() {
  setTop(window.innerHeight / 2)
  document.removeEventListener("keydown", handleJump)
  document.addEventListener("keydown", handleJump)
}

export function updateRoc(delta) {
  if (timeSinceLastJump < JUMP_DURATION) {
    setTop(getTop() - ROC_SPEED * delta)
  } else {
    setTop(getTop() + ROC_SPEED * delta)
  }

  timeSinceLastJump += delta
}

export function getRocRect() {
  return rocElem.getBoundingClientRect()
}

function setTop(top) {
  rocElem.style.setProperty("--rocet-top", top)
}

function getTop() {
  return parseFloat(getComputedStyle(rocElem).getPropertyValue("--rocet-top"))
}

function handleJump(e) {
  if (e.code === "Space" || e.key === " " || e.key === "u") {
    timeSinceLastJump = 0;
  }
}

// Function to handle button click event
export function handleButtonJump() {
  timeSinceLastJump = 0;
}