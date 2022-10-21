import Timer from "./Timer.js";

export default class Battle{
    #id;
    constructor(){
        this.#id = Date.now()*Math.random();
        this.#define(); 
    }
    #define(){
        const timer = new Timer();
        timer.setUpdate(this.#id,()=>this.update());
        timer.setDraw(this.#id,()=>this.draw());
    }
    update(){
        
    }
    draw(){

    }
    destroy(){
        new Timer().removeUpdate(this.#id);
    }
    animationEnd(){
        new Timer().removeDraw(this.#id);
    }
}