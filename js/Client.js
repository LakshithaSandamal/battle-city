export default class Client{
    static #charactorColor = ["E7E794","E79C21","6B6B00"];
    static #charactorImgData;
    static #currentLevel;
    static #compliteLevel = 1;

    static setColor(code,index){
        this.#charactorColor[index] = code;
    }
    static getColor(index){
        return this.#charactorColor[index];
    }
    static getColorArray(){
        return this.#charactorColor;
    }

    static setCharactorImgData(data){
        this.#charactorImgData = data;
    }
    static getCharactorImgData(){
        return this.#charactorImgData;
    }

    static setCurrentLevel(level){
        this.#currentLevel = level;
    }
    static getCurrentLevel(){
        return this.#currentLevel;
    }

    static setCompliteLevel(){
        this.#compliteLevel = Number(this.#currentLevel.split('_')[1].split('.')[0]) + 1;
    }
    static getCompliteLevel(){
        return this.#compliteLevel;
    }
}