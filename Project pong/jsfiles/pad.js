const speed=.04

export default class pad {
    constructor(padElem){
        this.padElem=padElem
        this.reset()
    }


    get position(){
        return parseFloat(getComputedStyle(this.padElem).getPropertyValue('--position'))
    }

    set position(value){
        this.padElem.style.setProperty('--position',value)
    }

    rect(){
        return this.padElem.getBoundingClientRect()
    }

    reset(){
        this.position=50
    }

    update(delta,ballHeight){
        this.position+=speed*delta*(ballHeight-this.position)
    }
}