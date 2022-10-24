import AudioBoard from "./AudioBoard.js";
import Battle from "./Battle.js";
import BattleMatrix from "./BattleMatrix.js";
import BattleScreen from "./BattleScreen.js";
import SpriteSheet from "./SpriteSheet.js";
import TileMatrix from "./TileMatrix.js";
import Vec2 from "./Vec2.js";

export default class Effect extends Battle{
    #data;
    #time;
    #display;
    #pos;
    #buffer;
    #battleGrid;
    #tileGrid;
    #ctx;
    constructor(effect_data,bonus_fn = null){
        super();

        effect_data["about"] = "effect";
        effect_data["fn"] = bonus_fn;
        effect_data["destroy"] = ()=>this.#destroy();
        this.#pos = new Vec2();
        this.#data = effect_data;
        this.#time = 600;
        this.#display = true;
        this.#buffer = SpriteSheet.getSpriteBuffer(`effect_${this.#data.other}`);
        this.#battleGrid = new BattleMatrix();
        this.#tileGrid = new TileMatrix();
        this.#ctx = new BattleScreen().getContext();
        this.update = ()=> this.#update();
        this.draw = ()=>this.#draw();
        this.#define();

    }
    #define(){
        if(this.#data.type == "level_up"){
            if(this.#data.other == 1){
                this.#data.other = [2,["wall"]];
            }else if(this.#data.other == 2){
                this.#data.other = [1,["wall","siment"]]; 
            }else if(this.#data.other == 3){
                this.#data.other = [2,["wall","siment"]];
            }
        }
        while(true){
            this.#pos.x = 10 + (Math.random() < 0.5 ? -1 : 1)*Math.floor(Math.random()*10);
            this.#pos.y = 10 + (Math.random() < 0.5 ? -1 : 1)*Math.floor(Math.random()*10);
            if(["road","wall","grass"].includes(this.#tileGrid.getTile(this.#pos.x,this.#pos.y))){
                break;
            }
        }
        AudioBoard.playAudio('drop_effect');
    }
    #update(){
        this.#battleGrid.setTile(this.#pos.x,this.#pos.y,this.#data);
        this.#time --;
        if(!this.#time){
            this.#destroy();
        }
        if(this.#time < 180){
            if([20,50,80,110,140,170].includes(this.#time)){
                this.#display = !this.#display;
            }
        }
    }
    #draw(){
        if(this.#display){
            this.#ctx.drawImage(this.#buffer,this.#pos.x*16,this.#pos.y*16);
        }
    }
    #destroy(){
        this.#battleGrid.setTile(this.#pos.x,this.#pos.y,undefined);
        this.destroy();
        this.animationEnd();
    }
}