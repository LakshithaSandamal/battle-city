import { fetchBattleData} from "./loader.js";
import { loadAssetsSuccess } from "./anime.js";
import { setClientData , progressStyle } from "./anime.js";
import { loadLevel } from "./loader.js";
import { createAllBuffer, createPlayGround } from "./createBattleCity.js";
import Timer from "./Timer.js";
import BattleScreen from "./BattleScreen.js";
import AudioBoard from "./AudioBoard.js";
import GamePanel from "./GamePanel.js";

const chooser_box = document.getElementById('chooser');
const exite_btn = document.querySelector('.apply_button button:nth-child(1)');
const apply_btn = document.querySelector('.apply_button button:nth-child(2)');


const createBattleCity = async() => {
    const timer = new Timer();
    chooser_box.style.display = 'none';
    setClientData();
    document.getElementById('loading').style.display = 'block'; //---- animation
    progressStyle('pending','10s steps(48) forwards'); //---- animation
    const levelData =  await loadLevel();
    await createAllBuffer(levelData);
    progressStyle('success','1.5s forwards'); //---- animation
    await new Promise(resolve=> setTimeout(()=>resolve(),2000)); //---- animation
    document.getElementById('loading').style.display = 'none'; //---- animation
    createPlayGround(levelData.play_ground);
    timer.setDraw('clear_battle',()=>new BattleScreen().clear());
    AudioBoard.playAudio('stage_music');
    new GamePanel(levelData,()=>createBattleCity());
    timer.start();
}; 

await fetchBattleData();
loadAssetsSuccess();
apply_btn.addEventListener('click',createBattleCity);