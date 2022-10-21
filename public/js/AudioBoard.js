export default class AudioBoard{
    static #arrayBuffer = new Map();
    static #arrayBufferName = [];
    static #audioBuffer = new Map();
    static #audioContext;
    static pass;

    static setArrayBuffer(name , arrayBuffer){
        this.#arrayBuffer.set(name , arrayBuffer);
        this.#arrayBufferName.push(name);
    }
    static getArrayBuffer(name){
        return this.#arrayBuffer.get(name);
    }

    static getArrayBufferName(){
        return this.#arrayBufferName;
    }

    static setAudioBuffer(name,audioBuffer){
        this.#audioBuffer.set(name,audioBuffer);
    }
    static getAudioBuffer(name){
        return this.#audioBuffer.get(name);
    }
    static hasAudioBuffer(){
        return this.#audioBuffer.size == 0 ? false : true;
    }

    static setContext(audioContext){
        if(this.#audioContext == undefined){
            this.#audioContext = audioContext;
        }
    }

    static setSoundPass(pass){
        this.pass = pass;
    }

    static playAudio(name){
        if(!this.pass){
            return;
        }
        const source = this.#audioContext.createBufferSource();
        source.buffer = this.#audioBuffer.get(name);
        source.connect(this.#audioContext.destination);
        source.start(0);
        return source;
    }
}