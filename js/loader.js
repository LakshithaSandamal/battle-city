import AudioBoard from "./AudioBoard.js";
import Client from "./Client.js";
import SpriteSheet from "./SpriteSheet.js";

export async function fetchBattleData(url = './assets/assets.json'){
    const res = await fetchJson(url);
    SpriteSheet.setSpriteData("player",res.player_img_data);
    SpriteSheet.setSpriteData("enemy",res.enemy_img_data);
    SpriteSheet.setSpriteData("playGround",res.play_ground_img_data);
    SpriteSheet.setSpriteData("assetsName",res.play_ground_assets);
    Client.setCharactorImgData(res.sample_tank_img_data);

    //audio
    const audios = res.audio.map(({url})=> fetchAudioBuffer(url));

    const audioBuffers = await Promise.all(audios);
    res.audio.forEach(({name} , index) => AudioBoard.setArrayBuffer(name, audioBuffers[index]));
}

export async function loadLevel(){
    return  await fetchJson(Client.getCurrentLevel());   
}

export async function fetchAudioBuffer(url){
    return await (await fetch(url)).arrayBuffer();
}
export async function fetchJson(url){
    return await (await fetch(url)).json();
}