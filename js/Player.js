import AudioBoard from "./AudioBoard.js";
import Battle from "./Battle.js";
import BattleMatrix from "./BattleMatrix.js";
import BattleScreen from "./BattleScreen.js";
import Bullet from "./Bullet.js";
import Client from "./Client.js";
import KeyBoard from "./KeyBoard.js";
import SpriteSheet from "./SpriteSheet.js";
import TileMatrix from "./TileMatrix.js";
import Vec2 from "./Vec2.js";

export default class Player extends Battle{
    static #instance;
    //-----
    #size;
    #about;
    #level;
    #color;
    #ctx;
    #pos;
    #move;
    #moveSpeed;
    #disableTile;
    #moveSound;
    #bulletRate;
    #bulletRateCount;
    #bulletSpeed;
    #bulletDisableTile;
    #bulletDistroy;
    #currentBattleTile;
    #direction;
    #directionBuffer;
    #defaultFrameRate;
    #frame = 1;
    #frameRate;
    #tileGrid;
    #battleGrid;
    #controlar;
    #destroyMe;
    constructor(data,destroyMe){
        if(Player.#instance){
            return ()=>this.#resetPlayer();
        }
        data["color"] = Client.getColorArray();
        data["about"] = "player";
        super();
        //-----
        this.#size = 16;
        this.#about = data.about;
        this.#level = data.move_speed+(data.bullet_distroy_tile.length - 1)*2;
        this.#color = data.color;
        this.#ctx = new BattleScreen().getContext();
        this.#pos = new Vec2([(data.spawn_poin[0]-1)*this.#size,(data.spawn_poin[1]-1)*this.#size]);
        this.#move = new Vec2();
        this.#moveSpeed = data.move_speed;
        this.#disableTile = data.move_disable;
        this.#bulletRate = 60/data.bullet_rate; //Number of bullets fired per second
        this.#bulletRateCount = 0;
        this.#bulletSpeed = data.bullet_speed;
        this.#bulletDistroy = data.bullet_distroy_tile;
        this.#bulletDisableTile = data.bullet_disable_tile;
        this.#direction = data.spawn_direction;
        this.#tileGrid = new TileMatrix(); 
        this.#battleGrid = new BattleMatrix();
        this.#controlar = new KeyBoard();
        this.#destroyMe = destroyMe;
        this.#define();
        this.draw = ()=> this.#draw();

        return ()=>this.#resetPlayer();
    }
    #define(){
        this.#directionBuffer = new Array();
        this.#directionBuffer.push(SpriteSheet.getSpriteBuffer(`${this.#about}_spawn_01`));
        this.#directionBuffer.push(SpriteSheet.getSpriteBuffer(`${this.#about}_${this.#color}_${this.#level}_${this.#direction}`)[0]);
        this.#directionBuffer.push(SpriteSheet.getSpriteBuffer(`${this.#about}_spawn_02`));

        this.#spawn();
    }
    #spawn(){
        this.#frame = this.#directionBuffer.length;
        this.#defaultFrameRate = 2;
        this.#frameRate = 0.125;
        setTimeout(()=>this.#spawnEnd(),1500);
    }
    #spawnEnd(){
        this.#directionBuffer = SpriteSheet.getSpriteBuffer(`${this.#about}_${this.#color}_${this.#level}_${this.#direction}`);
        this.#controlar = this.#controlar.define({
            default:()=>this.#idle(),
            up: ()=>this.#moveUp(),
            right: ()=>this.#moveRight(),
            down: ()=>this.#moveDown(),
            left: ()=>this.#moveLeft(),
            shoot:()=>this.#shoot()
        });
        this.#frame = this.#directionBuffer.length;
        this.#defaultFrameRate = 0;
        this.#frameRate = 0.125;
        this.update = ()=> this.#update();
    }
    #idle(){
        this.#defaultFrameRate = 0;
        this.#move.x = 0;
        this.#move.y = 0;
        if(AudioBoard.pass){
            if(this.#moveSound){
                this.#moveSound.stop();
                this.#moveSound = undefined;
            }
        }
    }
    #moveUp(){
        this.#move.y = -this.#moveSpeed;
        this.#defaultFrameRate = 1;

        if(AudioBoard.pass){
            if (this.#moveSound != undefined) {
                if (this.#moveSound.buffer != AudioBoard.getAudioBuffer('move')) {
                    this.#moveSound = AudioBoard.playAudio('move');
                }
            } else {
                this.#moveSound = AudioBoard.playAudio('move');
            }
        }

        if(this.#direction !== "up"){
            this.#idle();
            this.#direction = "up";
            this.#directionBuffer = SpriteSheet.getSpriteBuffer(`${this.#about}_${this.#color}_${this.#level}_up`);            
        }
    }
    #moveRight(){
        this.#move.x = +this.#moveSpeed;
        this.#defaultFrameRate = 1;

        if(AudioBoard.pass){
            if (this.#moveSound != undefined) {
                if (this.#moveSound.buffer != AudioBoard.getAudioBuffer('move')) {
                    this.#moveSound = AudioBoard.playAudio('move');
                }
            } else {
                this.#moveSound = AudioBoard.playAudio('move');
            }
        }

        if(this.#direction !== "right"){
            this.#idle();
            this.#direction = "right";
            this.#directionBuffer = SpriteSheet.getSpriteBuffer(`${this.#about}_${this.#color}_${this.#level}_right`);
        }
    }
    #moveDown(){
        this.#move.y = +this.#moveSpeed;
        this.#defaultFrameRate = 1;

        if(AudioBoard.pass){
            if (this.#moveSound != undefined) {
                if (this.#moveSound.buffer != AudioBoard.getAudioBuffer('move')) {
                    this.#moveSound = AudioBoard.playAudio('move');
                }
            } else {
                this.#moveSound = AudioBoard.playAudio('move');
            }
        }

        if(this.#direction !== "down"){
            this.#idle();
            this.#direction = "down";
            this.#directionBuffer = SpriteSheet.getSpriteBuffer(`${this.#about}_${this.#color}_${this.#level}_down`);
        }
    }
    #moveLeft(){
        this.#move.x = -this.#moveSpeed;
        this.#defaultFrameRate = 1;

        if(AudioBoard.pass){
            if (this.#moveSound != undefined) {
                if (this.#moveSound.buffer != AudioBoard.getAudioBuffer('move')) {
                    this.#moveSound = AudioBoard.playAudio('move');
                }
            } else {
                this.#moveSound = AudioBoard.playAudio('move');
            }
        }

        if(this.#direction !== "left"){
            this.#idle();
            this.#direction = "left";
            this.#directionBuffer = SpriteSheet.getSpriteBuffer(`${this.#about}_${this.#color}_${this.#level}_left`);
        }
    }
    #shoot(){
        if(this.#bulletRateCount == this.#bulletRate){
            this.#bulletRateCount = 0;
            new Bullet(this.#pos.x, this.#pos.y,this.#bulletSpeed,this.#bulletDistroy,this.#bulletDisableTile,this.#direction,this.#size,true,"player");
            AudioBoard.playAudio('shoot');
        }
    }
    #update(){
        this.#bulletRateCount < this.#bulletRate ? ++this.#bulletRateCount : '';
        this.#currentBattleTile = this.#battleGrid.getTile(Math.floor((this.#pos.x+this.#size/2)/this.#size),Math.floor((this.#pos.y + this.#size/2)/this.#size));
        if(this.#currentBattleTile.about != undefined){
            if(this.#currentBattleTile.about == "bullet"){
                if(this.#currentBattleTile.shooter != this.#about){
                    this.#currentBattleTile.destroy();
                    this.#resetPlayer();
                    this.destroy();
                    this.draw = ()=> this.#destroy();
                    return;
                }
            }else if(this.#currentBattleTile.about == "effect"){
                this.#currentBattleTile.destroy();
                if(this.#currentBattleTile.type == "level_up"){
                    if(this.#currentBattleTile.other != "sea"){
                        this.#levelUp(this.#currentBattleTile.other);
                    }else{
                        this.#removeDisableTile(this.#currentBattleTile.other);
                    }
                }else{
                    this.#currentBattleTile.fn();
                }
                AudioBoard.playAudio('take_effect');
            }
        }
        if(this.#move.x !== this.#move.y){
            //MOVE UP DOWN
            if(this.#pos.x%this.#size == 0){
                if(this.#move.y == -this.#moveSpeed){
                    if(!this.#disableTile.includes(this.#tileGrid.getTile(this.#pos.x/this.#size,Math.floor((this.#pos.y - 0.1)/this.#size)))){
                        this.#pos.y += this.#move.y;
                    }
                }else{
                    if(!this.#disableTile.includes(this.#tileGrid.getTile(this.#pos.x/this.#size,Math.floor((this.#pos.y + 0.1)/this.#size+1)))){
                        this.#pos.y += this.#move.y;
                    }
                }
            }else{
                if(this.#move.y == -this.#moveSpeed){
                    if(!this.#disableTile.includes(this.#tileGrid.getTile(Math.floor(this.#pos.x/this.#size),Math.floor((this.#pos.y - 0.1)/this.#size))) && !this.#disableTile.includes(this.#tileGrid.getTile(Math.floor(this.#pos.x/this.#size)+1,Math.floor((this.#pos.y - 0.1)/this.#size)))){
                        this.#pos.y += this.#move.y;
                    }
                }else{
                    if(!this.#disableTile.includes(this.#tileGrid.getTile(Math.floor(this.#pos.x/this.#size),Math.floor((this.#pos.y + 0.1)/this.#size)+1)) && !this.#disableTile.includes(this.#tileGrid.getTile(Math.floor(this.#pos.x/this.#size)+1,Math.floor((this.#pos.y + 0.1)/this.#size)+1))){
                        this.#pos.y += this.#move.y;
                    } 
                }
            }
            //MOVE LEFT RIGHT
            if(this.#pos.y%this.#size == 0){
                if(this.#move.x == -this.#moveSpeed){
                    if(!this.#disableTile.includes(this.#tileGrid.getTile(Math.floor((this.#pos.x - 0.1)/this.#size),this.#pos.y/this.#size))){
                        this.#pos.x += this.#move.x;
                    }
                }else{
                    if(!this.#disableTile.includes(this.#tileGrid.getTile(Math.floor((this.#pos.x + 0.1)/this.#size)+1,this.#pos.y/this.#size))){
                        this.#pos.x += this.#move.x;
                    }
                }
            }else{
                if(this.#move.x == -this.#moveSpeed){
                    if(!this.#disableTile.includes(this.#tileGrid.getTile(Math.floor((this.#pos.x - 0.1)/this.#size),Math.floor(this.#pos.y/this.#size))) && !this.#disableTile.includes(this.#tileGrid.getTile(Math.floor((this.#pos.x - 0.1)/this.#size),Math.floor(this.#pos.y/this.#size)+1))){
                        this.#pos.x += this.#move.x;
                    }
                }else{
                    if(!this.#disableTile.includes(this.#tileGrid.getTile(Math.floor((this.#pos.x + 0.1)/this.#size)+1,Math.floor(this.#pos.y/this.#size))) && !this.#disableTile.includes(this.#tileGrid.getTile(Math.floor((this.#pos.x + 0.1)/this.#size)+1,Math.floor(this.#pos.y/this.#size)+1))){
                        this.#pos.x += this.#move.x;
                    } 
                }
            }
        }
    }
    #draw(){
        this.#frame > this.#defaultFrameRate ? this.#frame = 0 : '';
        this.#ctx.drawImage(this.#directionBuffer[Math.floor(this.#frame)],this.#pos.x,this.#pos.y);
        this.#frame += this.#frameRate;
    }
    #destroy(){
        this.animationEnd();
        AudioBoard.playAudio('dead');
        setTimeout(()=>this.#destroyMe(),1000);
    }
    #resetPlayer(){
        Player.#instance = undefined;
        this.#controlar();
        this.#idle();
    }
    #removeDisableTile(removeTile){
        this.#disableTile = this.#disableTile.filter(tile=> tile !== removeTile);
    }
    #levelUp(data){
        this.#idle();
        this.#moveSpeed = data[0];
        this.#pos.x = Math.floor(this.#pos.x/2)*2;
        this.#pos.y = Math.floor(this.#pos.y/2)*2;
        this.#bulletDistroy = data[1];
        this.#level = this.#moveSpeed + (this.#bulletDistroy.length - 1)*2;
        this.#directionBuffer = SpriteSheet.getSpriteBuffer(`${this.#about}_${this.#color}_${this.#level}_${this.#direction}`);
        
    }
}