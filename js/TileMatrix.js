export default class TileMatrix{
    static #instance;
    #undefinedTile;
    #grid;

    constructor(){
        if(TileMatrix.#instance){
           return TileMatrix.#instance; 
        }
        this.#undefinedTile = "undefined";
        this.#grid = [];
        return TileMatrix.#instance = this;
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
    clear(){
        TileMatrix.#instance = undefined;
        this.#grid = undefined;
    }
}