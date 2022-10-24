import AudioBoard from "./AudioBoard.js";
import Client from "./Client.js";
import SpriteSheet from "./SpriteSheet.js";
import GroundScreen from "./GroundScreen.js";
import TileMatrix from "./TileMatrix.js";
import PatchScreen from "./PatchScreen.js";

export function recreateDataImage(dataImage,lastColorArray,newColorArray){
    lastColorArray.forEach((color , index) => dataImage = dataImage.replace(new RegExp(color,'gi'),newColorArray[index]));
    return dataImage;
}
export async function createBuffer(dataImage){
    const img = new Image();
    img.src = `data:image/svg+xml,${dataImage}`;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img,0,0);
    return canvas;
}
export async function createAllBuffer(data){
    let enemyColor = data.enemys_data.map(({color})=>color.toString());
    enemyColor = [...new Set(enemyColor)];
    enemyColor = enemyColor.map(color=> [...color.split(',')]);
    enemyColor = enemyColor.filter(color=> SpriteSheet.hasSpriteBuffer(`enemy_${color}_1_up`) ? '' : color); //name_colorArray_level_direction
    const [audio,enemySprites,playerSprite,groundSprite] = await Promise.all([!AudioBoard.hasAudioBuffer() ? Promise.all(await createAudioBuffer()) : '',enemyColor.length != 0 ? Promise.all(await createSpriteBuffer('enemy',enemyColor)) : '',!SpriteSheet.hasSpriteBuffer(`player_${Client.getColorArray()}_1_up`) ? Promise.all(await createSpriteBuffer('player',[Client.getColorArray()])) : '',!SpriteSheet.hasSpriteBuffer(`wall`) ? await createBuffer(SpriteSheet.getSpriteData("playGround")) : '']);
    audio.length != 0 ? AudioBoard.getArrayBufferName().forEach((name,index)=> AudioBoard.setAudioBuffer(name,audio[index])) : '';
    enemySprites.length != 0 ? enemyColor.forEach((color,index)=> setTankSpriteBuffer(enemySprites[index],color,"enemy")) : '';
    playerSprite.length != 0 ? setTankSpriteBuffer(playerSprite[0],Client.getColorArray(),"player") : '';
    groundSprite.length != 0 ? setOtherSpriteBuffer(groundSprite,SpriteSheet.getSpriteData("assetsName")) : '';
}
async function createSpriteBuffer(name,dataArray){
    return dataArray.map(color=> createBuffer(recreateDataImage(SpriteSheet.getSpriteData(name),["E7E794","E79C21","6B6B00"],color)));
}
async function createAudioBuffer(){
    const audioContext = new AudioContext();
    AudioBoard.setContext(audioContext);
    return AudioBoard.getArrayBufferName().map(name=>createDecodeAudioData(AudioBoard.getArrayBuffer(name),audioContext));
}
async function createDecodeAudioData(arrayBuffer,audioContext){
    return await audioContext.decodeAudioData(arrayBuffer);
}
function setTankSpriteBuffer(buffer,colorArray,name){
    const round = buffer.height/16;
    for(let i = 0 ; i < round ; i++){
        ["up","left","down","right"].forEach((direction,index)=>{
            SpriteSheet.setSpriteBuffer(`${name}_${colorArray}_${i+1}_${direction}`,[bufferCutter(buffer,(index)*32,i*16),bufferCutter(buffer,(2*index+1)*16,i*16)]);
        });
    }
}
function setOtherSpriteBuffer(buffer,nameArray){
    nameArray.forEach((assetsArray,index_0)=>{
        assetsArray.forEach((name,index_1)=>{
            SpriteSheet.setSpriteBuffer(name,bufferCutter(buffer,index_1*16,index_0*16));
        });
    });
}
function bufferCutter(buffer, sourceX , sourceY){
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(buffer,sourceX,sourceY,16,16,0,0,16,16);
    return canvas;
}
export function createPlayGround(data){
    const ctx_01 = new GroundScreen(document.getElementById('screen_01')).getContext();
    const ctx_02 = new GroundScreen(document.getElementById('screen_04')).getContext();
    const gridSheet = new TileMatrix();
    new PatchScreen();

    data.forEach(tile=>{
        const screen = tile.screen;
        for(let x1 = tile.area[0] , x2 = tile.area[1] ; x1 <= x2 ; x1++){
            for(let y1 = tile.area[2] , y2 = tile.area[3] ; y1 <= y2 ; y1++){
                ["sea_01","sea_02","sea_03"].includes(tile.name) ? gridSheet.setTile(x1-1,y1-1,"sea") : gridSheet.setTile(x1-1,y1-1,tile.name); 
                tile.name !== "road" ? eval(`ctx_${screen}`).drawImage(SpriteSheet.getSpriteBuffer(tile.name),(x1-1)*16,(y1-1)*16) : '';
            }
        }
    });
}