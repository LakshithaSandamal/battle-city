export default class KeyBoard{
    static #instance;
    #eventHandler;
    #event;
    #UP;
    #DOWN;
    #LEFT;
    #RIGHT;
    #SHOOT;
    constructor(){
        if(KeyBoard.#instance){
            return KeyBoard.#instance;
        }
        this.#UP = [87, 38]; // W / ARROW UP
        this.#DOWN = [83, 40]; // S / ARROW DOWN
        this.#LEFT = [65, 37]; // A / ARROW LEFT
        this.#RIGHT = [68, 39]; // D / ARROW RIGHT
        this.#SHOOT = [67, 79]; // C / O
        this.#event = new Map();
        this.#eventHandler = e => this.#trigger(e);
        return KeyBoard.#instance = this;
    }
    define(listen){
        this.#event.set('default',listen.default);
        this.#UP.forEach(code => this.#event.set(code,listen.up));
        this.#DOWN.forEach(code => this.#event.set(code,listen.down));
        this.#LEFT.forEach(code => this.#event.set(code,listen.left));
        this.#RIGHT.forEach(code => this.#event.set(code,listen.right));
        this.#SHOOT.forEach(code => this.#event.set(code,listen.shoot));
        this.#listenTo();
        return ()=>this.#destroy();
    }
    #trigger({keyCode,type}){
        if(this.#event.has(keyCode)){
            if(type == 'keydown'){
                this.#event.get(keyCode)();
            }else{
                this.#event.get('default')();
            }
        }
    }
    #listenTo(){
        ['keydown', 'keyup'].forEach(keyType=> window.addEventListener(keyType,this.#eventHandler));
    }
    #destroy(){
        ['keydown', 'keyup'].forEach(keyType=> window.removeEventListener(keyType,this.#eventHandler));
        KeyBoard.#instance = undefined;
    }
}