import AudioBoard from "./AudioBoard.js";
import Client from "./Client.js";
import { recreateDataImage } from "./createBattleCity.js";

const progress = document.querySelector('#loading div');
const percentage = document.querySelector('#loading p');
const chooser_box = document.getElementById('chooser');
const colorInputs = [document.getElementById('c1'),document.getElementById('c2'),document.getElementById('c3')];
const sound = document.getElementById('sound');
const charactor = document.getElementById('charactor');

export function loadAssetsSuccess(){

    progressStyle('success','2s steps(52) forwards');

    charactor.style.backgroundImage = `url("data:image/svg+xml,${Client.getCharactorImgData()}")`;

    colorInputs.forEach((input,index)=>input.addEventListener('change',()=>recreateCharactor(input.value,index)));

    setTimeout(()=>displayChooser() , 2500);
}
export function progressStyle(situation,style = '0s forwards'){
    progress.style.animation = `${situation}_progress ${style}`;
    percentage.style.animation = `${situation}_percentage ${style}`;
}
function displayChooser(){
    document.getElementById('loading').style.display = 'none';
    progressStyle('reset');
    chooser_box.style.display = 'grid';
}
function recreateCharactor(colorElement , index){
    const colorCode = colorElement.split('#')[1];
    Client.setCharactorImgData(recreateDataImage(Client.getCharactorImgData(),[Client.getColor(index)],[colorCode]));
    Client.setColor(colorCode,index);
    charactor.style.backgroundImage = `url("data:image/svg+xml,${Client.getCharactorImgData()}")`;
}
export function setClientData(){
    colorInputs.forEach((element,index)=> Client.setColor(element.value.split('#')[1],index));
    AudioBoard.setSoundPass(sound.checked);
    Client.setCurrentLevel(`./level/${document.querySelector('input[name="group"]:checked').value}.json`);
}