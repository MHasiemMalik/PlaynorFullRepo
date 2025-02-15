import Ball from './Ball.js';
import Pad from './pad.js';
const ball = new Ball(document.getElementById('ball'))
const playerPad=new Pad(document.getElementById('player-pad'))
const computerPad=new Pad(document.getElementById('computer-pad'))

const playScore = document.getElementById('player-score')
const compScore = document.getElementById('computer-score')
let lastTime;
function update(time){


    if(lastTime!=null){
        const delta=time-lastTime
        ball.update(delta,[playerPad.rect(),computerPad.rect()])
        computerPad.update(delta,ball.y)

      const bgClr=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hue'))
      
      document.documentElement.style.setProperty('--hue',bgClr + delta * 0.006)

        if(isLost()){
       handleLost()
        }
    }

    lastTime=time
    window.requestAnimationFrame(update)

}

function isLost(){
    const rect=ball.rect()
    return rect.right >=window.innerWidth|| rect.left<=0
}

function handleLost(){
    const rect=ball.rect()
    if(rect.right>=window.innerWidth){
    playScore.textContent=parseInt(playScore.textContent)+1
    }else{
       compScore.textContent=parseInt(compScore.textContent)+1
        }
    ball.reset()
    computerPad.reset()
}

document.addEventListener("mousemove", e => {
    playerPad.position=(e.y/window.innerHeight)*100
})

window.requestAnimationFrame(update)
