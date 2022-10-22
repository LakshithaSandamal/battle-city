import Screen from "./Screen.js";

export default class PatchScreen extends Screen{
    static #instance;
    constructor(){
        if(PatchScreen.#instance){
            return PatchScreen.#instance;
        }
        super(document.getElementById('screen_02'));
        return PatchScreen.#instance = this;
    }
}