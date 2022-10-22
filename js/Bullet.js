import AudioBoard from "./AudioBoard.js";
import Battle from "./Battle.js";
import BattleMatrix from "./BattleMatrix.js";
import BattleScreen from "./BattleScreen.js";
import PatchScreen from "./PatchScreen.js";
import SpriteSheet from "./SpriteSheet.js";
import TileMatrix from "./TileMatrix.js";
import Vec2 from "./Vec2.js";

export default class Bullet extends Battle{
    #pos;
    #speed;
    #distroyTile;
    #distroyTilePos;
    #data;
    #move;
    #fixDitectVal;
    #direction;
    #size;
    #soundPass;
    #buffer;
    #battleCTX;
    #patchCTX;
    #patchDraw;
    #disableTile;
    #frameRate;
    #battleGrid;
    #tileGrid;
    constructor(x, y,speed,distroyTile,disableTile,direction,size,soundPass,shooter){
        super();

        this.#pos = new Vec2([direction == "right" ? x + size : direction == "left" ? x - size : x, direction == "up" ? y - size : direction == "down" ? y + size : y]);
        this.#speed = speed;
        this.#distroyTile = distroyTile;
        this.#disableTile = disableTile;
        this.#data = {about:"bullet" , shooter: shooter , destroy:()=>this.#destroyMe()};
        this.#direction = direction;
        this.#move = direction == "up" ? () => this.#up() : direction == "right" ? () => this.#right() : direction == "down" ? () => this.#down() : () => this.#left();     
        this.#size = size;
        this.#soundPass = soundPass;
        this.#fixDitectVal = direction == "right" ? Math.floor((y + size/2)/size) : direction == "left" ? Math.floor((y + size/2)/size) : direction == "up" ? Math.floor((x + size/2)/size) :  Math.floor((x + size/2)/size) ;
        this.#buffer = SpriteSheet.getSpriteBuffer(`bullet_${this.#direction}`);
        this.#frameRate = 0;
        this.#battleCTX = new BattleScreen().getContext();
        this.#patchCTX = new PatchScreen().getContext();
        this.#patchDraw = false;
        this.#battleGrid = new BattleMatrix();
        this.#tileGrid = new TileMatrix();
        this.update = ()=> this.#update();
        this.draw = ()=> this.#draw();
    }
    #up(){
        if(!this.#disableTile.includes(this.#tileGrid.getTile(this.#fixDitectVal,Math.floor((this.#pos.y + this.#size/2)/this.#size)))){
            this.#pos.y -= this.#speed;
            this.#battleGrid.setTile(Math.floor((this.#pos.x + this.#size/2)/this.#size),Math.floor((this.#pos.y + this.#size/2)/this.#size),this.#data);
        }else{
            this.#distroyTilePos = [this.#fixDitectVal,Math.floor(this.#pos.y/this.#size)];
            if(this.#distroyTile.includes(this.#tileGrid.getTile(this.#distroyTilePos[0],this.#distroyTilePos[1]))){
                this.#tileGrid.setTile(this.#distroyTilePos[0],this.#distroyTilePos[1],"road");
                this.destroy();
                this.draw = () => this.#destroy();
            }else{
                this.destroy();
                this.draw = () => this.#destroy();
                this.#patchDraw = true;
            }
        }
    }
    #right(){
        if(!this.#disableTile.includes(this.#tileGrid.getTile(Math.floor((this.#pos.x + this.#size/2)/this.#size),this.#fixDitectVal))){
            this.#pos.x += this.#speed;
            this.#battleGrid.setTile(Math.floor((this.#pos.x + this.#size/2)/this.#size),Math.floor((this.#pos.y + this.#size/2)/this.#size),this.#data);
        }else{
            this.#distroyTilePos = [Math.floor((this.#pos.x + this.#size/2)/this.#size),this.#fixDitectVal];
            if(this.#distroyTile.includes(this.#tileGrid.getTile(this.#distroyTilePos[0],this.#distroyTilePos[1]))){
                this.#tileGrid.setTile(this.#distroyTilePos[0],this.#distroyTilePos[1],"road");
                this.destroy();
                this.draw = () => this.#destroy();
            }else{
                this.destroy();
                this.draw = () => this.#destroy();
                this.#patchDraw = true;
            }
        }
    }
    #down(){
        if(!this.#disableTile.includes(this.#tileGrid.getTile(this.#fixDitectVal,Math.floor((this.#pos.y - this.#size/2)/this.#size+1)))){
            this.#pos.y += this.#speed;
            this.#battleGrid.setTile(Math.floor((this.#pos.x + this.#size/2)/this.#size),Math.floor((this.#pos.y + this.#size/2)/this.#size),this.#data);
        }else{
            this.#distroyTilePos = [this.#fixDitectVal,Math.floor((this.#pos.y - this.#size/2)/this.#size+1)];
            if(this.#distroyTile.includes(this.#tileGrid.getTile(this.#distroyTilePos[0],this.#distroyTilePos[1]))){
                this.#tileGrid.setTile(this.#distroyTilePos[0],this.#distroyTilePos[1],"road");
                this.destroy();
                this.draw = () => this.#destroy();
            }else{
                this.destroy();
                this.draw = () => this.#destroy();
                this.#patchDraw = true;
            }
        }
    }
    #left(){
        if(!this.#disableTile.includes(this.#tileGrid.getTile(Math.floor((this.#pos.x - this.#size/2)/this.#size)+1,this.#fixDitectVal))){
            this.#pos.x -= this.#speed;
            this.#battleGrid.setTile(Math.floor((this.#pos.x + this.#size/2)/this.#size),Math.floor((this.#pos.y + this.#size/2)/this.#size),this.#data);
        }else{
            this.#distroyTilePos = [Math.floor((this.#pos.x - this.#size/2)/this.#size)+1,this.#fixDitectVal];
            if(this.#distroyTile.includes(this.#tileGrid.getTile(this.#distroyTilePos[0],this.#distroyTilePos[1]))){
                this.#tileGrid.setTile(this.#distroyTilePos[0],this.#distroyTilePos[1],"road");
                this.destroy();
                this.draw = () => this.#destroy();
            }else{
                this.destroy();
                this.draw = () => this.#destroy();
                this.#patchDraw = true;
            }
        }
    }
    #update(){
        this.#battleGrid.setTile(Math.floor((this.#pos.x + this.#size/2)/this.#size),Math.floor((this.#pos.y + this.#size/2)/this.#size),undefined);
        this.#move();
    }
    #draw(){
        this.#battleCTX.drawImage(this.#buffer,this.#pos.x,this.#pos.y);
    }
    #destroy(){
        this.#frameRate >= 8 ? this.animationEnd() : this.#frameRate ++;
        if(this.#soundPass){
            AudioBoard.playAudio('collision_tile');
            this.#soundPass = false;
        }
        if(!this.#patchDraw){
            this.#patchCTX.fillRect(this.#distroyTilePos[0]*this.#size,this.#distroyTilePos[1]*this.#size,this.#size,this.#size);
            this.#patchDraw = true;
        }
        this.#battleCTX.drawImage(SpriteSheet.getSpriteBuffer(`destroy_${Math.floor(this.#frameRate/3)}`),this.#pos.x,this.#pos.y);
    }
    #destroyMe(){
        this.#battleGrid.setTile(Math.floor((this.#pos.x + this.#size/2)/this.#size),Math.floor((this.#pos.y + this.#size/2)/this.#size),undefined);
        this.#patchDraw = true;
        this.destroy();
        this.draw = () => this.#destroy();
    }
}