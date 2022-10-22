export default class SpriteSheet{
    static #spriteData = new Map();
    static #spriteBuffer = new Map();

    static setSpriteData(name,spriteData){
        this.#spriteData.set(name,spriteData);
    }
    static getSpriteData(name){
        return this.#spriteData.get(name);
    }

    static hasSpriteBuffer(name){
        return this.#spriteBuffer.has(name);
    }
    static setSpriteBuffer(name,buffer){
        this.#spriteBuffer.set(name,buffer);
    }
    static getSpriteBuffer(name){
        return this.#spriteBuffer.get(name);
    }
}