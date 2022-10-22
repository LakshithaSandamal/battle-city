import AudioBoard from "./AudioBoard.js";
import Battle from "./Battle.js";
import BattleMatrix from "./BattleMatrix.js";
import PatchScreen from "./PatchScreen.js";
import SpriteSheet from "./SpriteSheet.js";
import Vec2 from './Vec2.js';

export default class Falcon extends Battle{
    static #instance;

    #data;
    #destroyCallBack;
    #size;
    #pos;
    #ctx;
    #battleGrid;
    #currentBattleTile;
    constructor(data,destroyCallback){
        if(Falcon.#instance){
            return ()=>this.#resetFalcon();
        }
        super();

        this.#data = data;
        this.#destroyCallBack = destroyCallback;
        this.#size = 16;
        this.#pos = new Vec2([(data.area[0]-1)*16,(data.area[2]-1)*16]);
        this.#ctx = new PatchScreen().getContext();
        this.#battleGrid = new BattleMatrix();
        this.update = ()=> this.#update();
        this.#define();
        return ()=>this.#resetFalcon();
    }
    #define(){

    }
    #update(){
        this.#currentBattleTile = this.#battleGrid.getTile(Math.floor((this.#pos.x+this.#size/2)/this.#size),Math.floor((this.#pos.y + this.#size/2)/this.#size));
        if(this.#currentBattleTile.about == "bullet"){
            this.#currentBattleTile.destroy();
            this.draw = ()=> this.#draw();
            this.destroy();
        }
    }
    #draw(){
        this.#ctx.fillRect(this.#pos.x,this.#pos.y,this.#size,this.#size);
        AudioBoard.playAudio('die_falcon');
        this.#ctx.drawImage(SpriteSheet.getSpriteBuffer('die_falcon'),this.#pos.x,this.#pos.y);
        this.animationEnd();
        setTimeout(()=>this.#destroyCallBack(),1000);
    }
    #resetFalcon(){
        Falcon.#instance = undefined;
    }
}