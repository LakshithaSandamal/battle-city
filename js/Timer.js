export default class Timer{
    static #instance;
    #FPS = 1/60;
    #accumulatedTime;
    #lastTime;
    #initAnimetion;
    #updateFn = new Map();
    #drawFn = new Map();
    #running;

    constructor(){
        if(Timer.#instance){
            return Timer.#instance;
        }
        this.#accumulatedTime = 0;
        return Timer.#instance = this;
    }

    setUpdate(name,fn){
        this.#updateFn.set(name,fn);
    }
    removeUpdate(name){
        this.#updateFn.delete(name);
    }

    setDraw(name,fn){
        this.#drawFn.set(name,fn);
    }
    removeDraw(name){
        this.#drawFn.delete(name);
    }

    #init(dt){
        if(this.#lastTime){
            this.#accumulatedTime += (dt - this.#lastTime)/1000;
            while(this.#accumulatedTime > this.#FPS){
                this.#updateFn.forEach(fn=> fn());
                this.#accumulatedTime -= this.#FPS;
            }
            this.#drawFn.forEach(fn=> fn());
        }
        this.#lastTime = dt;
        this.#initAnimetion = requestAnimationFrame(this.#init.bind(this));
    }

    start(){
        this.#running = true;
        this.#init();
    }
    stop(){
        this.#running = false;
        cancelAnimationFrame(this.#initAnimetion);
        this.#lastTime = 0;
    }
    hasRunning(){
        return this.#running;
    }
    clearAll(){
        this.#updateFn.clear();
        this.#drawFn.clear();
    }
}


