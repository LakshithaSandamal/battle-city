import Screen from "./Screen.js";

export default class BattleScreen extends Screen{
    static #instance;
    constructor(){
        if(BattleScreen.#instance){
            return BattleScreen.#instance;
        }
        super(document.getElementById('screen_03'));
        return BattleScreen.#instance = this;
    }
}