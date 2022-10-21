import Battle from "./Battle.js";

export default class EnemyControlar extends Battle{
    #event;
    #UP;
    #DOWN;
    #LEFT;
    #RIGHT;
    #SHOOT;
    #keyCode;
    #timeRange;
    #callarray;
    constructor(){
        super();
        this.#UP = [0,5]; // UP
        this.#DOWN = [1,6]; // DOWN
        this.#LEFT = [2,7]; // LEFT
        this.#RIGHT = [3,8]; // RIGHT
        this.#SHOOT = [4,9]; // SHOOT
        this.#event = new Map();
        this.#keyCode = 1;
        this.#timeRange = 60;
        this.#callarray = [5,10];
    }
    define(listen){
        this.#event.set('default',listen.default);
        this.#UP.forEach(code => this.#event.set(code,listen.up));
        this.#DOWN.forEach(code => this.#event.set(code,listen.down));
        this.#LEFT.forEach(code => this.#event.set(code,listen.left));
        this.#RIGHT.forEach(code => this.#event.set(code,listen.right));
        this.#SHOOT.forEach(code => this.#event.set(code,listen.shoot));
        this.#defineAction();
        this.animationEnd();
        this.update = ()=> this.#handler();
        return ()=>this.#destroy();
    }
    #defineAction(){
        this.#keyCode = Math.floor(Math.random()*10);
        this.#timeRange = Math.floor(Math.random()*10+1)*12;
    }
    #handler(){
        if(this.#timeRange == 0){
            this.#defineAction();
        }
        if(this.#callarray.includes(this.#timeRange)){
            this.#event.get(this.#keyCode)();
        }
        this.#timeRange -= 1;
    } 
    #destroy(){
        this.destroy();
    }   
}