export default class BattleMatrix{
    static #instance;
    #undefinedTile;
    #grid;

    constructor(){
        if(BattleMatrix.#instance){
           return BattleMatrix.#instance; 
        }
        this.#undefinedTile = {about:"undefined"};
        this.#grid = [];
        return BattleMatrix.#instance = this;
    }
    setTile(x,y,tileData){
        if(!this.#grid[x]){
            this.#grid[x] = [];
        }
        this.#grid[x][y] = tileData;
    }
    getTile(x,y){
        if(this.#grid[x] && this.#grid[x][y]){
            return this.#grid[x][y];
        }
        return this.#undefinedTile;
    } 

    getGrid(){
        return this.#grid;
    }
    clear(){
        BattleMatrix.#instance = undefined;
        this.#grid = undefined;
    }
}