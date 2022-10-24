import AudioBoard from "./AudioBoard.js";
import Battle from "./Battle.js";
import BattleMatrix from "./BattleMatrix.js";
import BattleScreen from "./BattleScreen.js";
import Bullet from "./Bullet.js";
import Effect from "./Effect.js";
import EnemyControlar from "./EnemyControlar.js";
import SpriteSheet from "./SpriteSheet.js";
import TileMatrix from "./TileMatrix.js";
import Vec2 from "./Vec2.js";

export default class Enemy extends Battle{
    #size;
    #about;
    #level;
    #color;
    #ctx;
    #pos;
    #move;
    #moveSpeed;
    #disableTile;
    #bulletRate;
    #bulletRateCount;
    #bulletSpeed;
    #bulletDisableTile;
    #bulletDistroy;
    #direction;
    #directionBuffer;
    #defaultFrameRate;
    #frame = 1;
    #frameRate;
    #battleGrid;
    #currentBattleTile;
    #tileGrid;
    #controlar;
    #destroyCallBack;
    #destroySound;
    #effect;
    #effect_bonus;
    constructor(data,destroyCallBack,effect_bonus = null){
        data["about"] = "enemy";

        super();

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
        this.#battleGrid = new BattleMatrix();
        this.#tileGrid = new TileMatrix(); 
        this.#controlar = new EnemyControlar();
        this.#destroyCallBack = destroyCallBack;
        this.#effect = data.effect;
        this.#effect_bonus = effect_bonus;
        this.#define();
        this.draw = ()=> this.#draw();
        return ()=>this.#destroyMe();
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
    }
    #moveUp(){
        this.#move.y = -this.#moveSpeed;
        this.#defaultFrameRate = 1;
        if(this.#direction !== "up"){
            this.#idle();
            this.#direction = "up";
            this.#directionBuffer = SpriteSheet.getSpriteBuffer(`${this.#about}_${this.#color}_${this.#level}_up`);            
        }
    }
    #moveRight(){
        this.#move.x = +this.#moveSpeed;
        this.#defaultFrameRate = 1;
        if(this.#direction !== "right"){
            this.#idle();
            this.#direction = "right";
            this.#directionBuffer = SpriteSheet.getSpriteBuffer(`${this.#about}_${this.#color}_${this.#level}_right`);
        }
    }
    #moveDown(){
        this.#move.y = +this.#moveSpeed;
        this.#defaultFrameRate = 1;
        if(this.#direction !== "down"){
            this.#idle();
            this.#direction = "down";
            this.#directionBuffer = SpriteSheet.getSpriteBuffer(`${this.#about}_${this.#color}_${this.#level}_down`);
        }
    }
    #moveLeft(){
        this.#move.x = -this.#moveSpeed;
        this.#defaultFrameRate = 1;
        if(this.#direction !== "left"){
            this.#idle();
            this.#direction = "left";
            this.#directionBuffer = SpriteSheet.getSpriteBuffer(`${this.#about}_${this.#color}_${this.#level}_left`);
        }
    }
    #shoot(){
        if(this.#bulletRateCount == this.#bulletRate){
            this.#bulletRateCount = 0;
            new Bullet(this.#pos.x, this.#pos.y,this.#bulletSpeed,this.#bulletDistroy,this.#bulletDisableTile,this.#direction,this.#size,false,"enemy");
        } 
    }
    #update(){
        this.#currentBattleTile = this.#battleGrid.getTile(Math.floor((this.#pos.x+this.#size/2)/this.#size),Math.floor((this.#pos.y + this.#size/2)/this.#size));
        if(this.#currentBattleTile.about == "bullet"){
            if(this.#currentBattleTile.shooter != this.#about){
                this.#currentBattleTile.destroy();
                this.#destroyMe();
                return;
            }
        }
        this.#bulletRateCount < this.#bulletRate ? ++this.#bulletRateCount : '';
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
    #destroyMe(){
        this.#controlar();
        this.destroy();
        this.#frameRate = 0;
        this.draw = ()=> this.#destroy();
    }
    #destroy(){
        this.#frameRate == 8 ? this.animationEnd() : this.#frameRate ++;
        if(!this.#destroySound){
            if(this.#effect != null){
                new Effect(this.#effect,this.#effect_bonus);
            }
            this.#destroyCallBack();
            AudioBoard.playAudio('destroy');
            this.#destroySound = true;
        }
        this.#ctx.drawImage(SpriteSheet.getSpriteBuffer(`score_${this.#level*100}`),this.#pos.x,this.#pos.y-this.#frameRate);
    }
}