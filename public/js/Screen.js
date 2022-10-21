export default class Screen{
    #canvas;
    #ctx;
    constructor(parentElement = document.body){
        this.#canvas = document.createElement('canvas');
        this.#ctx = this.#canvas.getContext('2d');
        this.#canvas.width = 336;
        this.#canvas.height = 336;
        parentElement.append(this.#canvas);
    }
    getContext(){
        return this.#ctx;
    }
    clear(){
        this.#ctx.clearRect(0,0,336,336);
    }
}