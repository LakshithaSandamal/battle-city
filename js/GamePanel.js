import AudioBoard from "./AudioBoard.js";
import BattleMatrix from "./BattleMatrix.js";
import BattleScreen from "./BattleScreen.js";
import Client from "./Client.js";
import Enemy from "./Enemy.js";
import Falcon from "./Falcon.js";
import PatchScreen from "./PatchScreen.js";
import Player from "./Player.js";
import TileMatrix from "./TileMatrix.js";
import Timer from "./Timer.js";

export default class GamePanel{
    static #instance;

    #data;
    #round;
    #currentRound;
    #enemy;
    #destroyEnemys;
    #player;
    #playerHealth;
    #falcon;
    constructor(data){
        if(GamePanel.#instance){
            return GamePanel.#instance;
        }
        this.#data = data;
        this.#playerHealth = 2;
        this.#round = 1;
        this.#currentRound = 1;
        this.#enemy = 0;
        this.#defineFalcon();
        this.#definePlayer();
        setTimeout(()=>this.#defineRoundEnemy(),2000);

        return GamePanel.#instance = this;
    }
    #defineRoundEnemy(){
        this.#destroyEnemys = undefined;
        this.#destroyEnemys = this.#data.enemys_data.map(enemy =>{
            if(this.#currentRound == enemy.round){
                this.#enemy ++;
                if(enemy.effect != null){
                    if(enemy.effect.type == 'battle_bonus'){
                        if(enemy.effect.other == 'grenade'){
                            return new Enemy(enemy,()=>this.#destroyMe("enemy"),()=>this.#destroyRoundEnemys());
                        }
                    }
                }
                return new Enemy(enemy,()=>this.#destroyMe("enemy"));
            } else{
                if(this.#round < enemy.round){
                    this.#round = enemy.round;
                }
            }
        });
        this.#destroyEnemys = this.#destroyEnemys.filter(value=> value !== undefined);
    }
    #destroyRoundEnemys(){
        this.#destroyEnemys.forEach(fn=> fn());
    }
    #defineFalcon(){
        this.#falcon = new Falcon(this.#data.play_ground[this.#data.play_ground.length - 4],()=>this.#battleFail());
    }
    #definePlayer(){
        this.#player = new Player(this.#data.player_data , ()=>this.#destroyMe("player"));
    }
    #destroyMe(data){
        if(data == "player"){
            --this.#playerHealth;
            if(this.#playerHealth){
                this.#definePlayer();
            }else{
                setTimeout(()=>this.#battleFail(),1000);
            }
        }else if(data == "falcon"){
            ()=>this.#battleFail();
        }else{
            this.#enemy --;
            if(this.#enemy == 0){
                if(this.#currentRound == this.#round){
                    setTimeout(()=>this.#battleSuccess(),1000);
                }else{
                    this.#currentRound ++;
                    setTimeout(()=>this.#defineRoundEnemy(),2000);
                }
            }
        }
    }
    #battleSuccess(){
        AudioBoard.playAudio('success');
        this.#player();
        this.#falcon();
        Client.setCompliteLevel();
        this.#gameNotification('battle-win');
        setTimeout(()=>{
            this.#resetGamePanel();
            this.#gameNotification('battle-win');
        },6000);
        const timer = new Timer();
        setTimeout(()=>timer.stop(),500);
    }
    #battleFail(){
        AudioBoard.playAudio('fail');
        this.#player();
        this.#falcon();
        this.#gameNotification('game-over');
        setTimeout(()=>{
            this.#resetGamePanel();
            this.#gameNotification('game-over');
        },3500);
        const timer = new Timer();
        setTimeout(()=>timer.stop(),500);
    }
    #gameNotification(notifi){
        document.getElementById('notification').classList.toggle('d-none');
        document.querySelector('#notification div').classList.toggle(notifi);
    }
    #resetGamePanel(){
        GamePanel.#instance = undefined;

        let element1 = document.getElementById('screen_01');
        element1.removeChild(element1.firstChild);
        let element2 = document.getElementById('screen_04');
        element2.removeChild(element2.firstChild);
        document.getElementById('game-pause').classList.toggle('d-none');

        new Timer().clearAll();
        new BattleScreen().clear();
        new PatchScreen().clear();
        new BattleMatrix().clear();
        new TileMatrix().clear();

        for(let i = 1 ; i <= Client.getCompliteLevel() ; i++){
            document.getElementById(`level_${i}`).removeAttribute('disabled');
        }
        document.getElementById('chooser').style.display = 'grid';
    }
}