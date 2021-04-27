import Player from "./CreatePlayer";
import {
    createElement,
    randomInteger,
    getRandomPlayer,
    generateLogs
} from "../utils";
import { $root, $arena, $chat, $formFight } from "../domEls";

const assets = "http://reactmarathon-api.herokuapp.com/assets/";
const heroes = {
  scorpion: {
    name: "SCORPION",
    img: `${assets}/scorpion.gif`,
    weapon: [],
    hp: 100,
  },
  kitana: {
    name: "KITANA",
    img: `${assets}/kitana.gif`,
    weapon: [],
    hp: 100,
  },
  liukang: {
    name: "LIU-KANG",
    img: `${assets}/liukang.gif`,
    weapon: [],
    hp: 100,
  },
  sonya: {
    name: "SONYA",
    img: `${assets}/sonya.gif`,
    weapon: [],
    hp: 100,
  },
  subzero: {
    name: "SUB-ZERO",
    img: `${assets}/subzero.gif`,
    weapon: [],
    hp: 100,
  },
};

export default class Game {
    constructor(payload) {
        Object.assign(this, payload);
    }

    init = () => {
        Game.createAudio({
            src: randomInteger(1, 3),
            allow: "autoplay 'src'",
            loop: "loop",
        });
        
        const players = Game.generatePlayers(false, 0, heroes);
        const {
            enemyPlayer, 
            myPlayer 
        } = Game.renderPlayers(players);
        
        generateLogs("start", myPlayer, enemyPlayer, $chat);

        $formFight.addEventListener("submit", (event) => 
            Game.onFormSubmit(event, { players, enemyPlayer, myPlayer }))
    }

    static onFormSubmit(event, payload) {
        event.preventDefault();

        const { myPlayer, enemyPlayer, players } = payload;

        const $btnSubmit = $formFight.querySelector("button[type='submit']");
        const myPlayerRaundStep = myPlayer.attack("player");
        const enemyPlayerRaundStep = enemyPlayer.attack("enemy");
        const actors = [
        {
            hit: myPlayerRaundStep.hit,
            defence: enemyPlayerRaundStep.defence,
            value: myPlayerRaundStep.value,
            players: {
                hit: myPlayer,
                defence: enemyPlayer,
            },
        },
        {
            hit: enemyPlayerRaundStep.hit,
            defence: myPlayerRaundStep.defence,
            value: enemyPlayerRaundStep.value,
            players: {
            hit: enemyPlayer,
            defence: myPlayer,
            },
        },
        ];
        console.log("myPlayer", {
        ...myPlayerRaundStep,
        });
        console.log("enemyPlayer", {
        ...enemyPlayerRaundStep,
        });

        actors.forEach((item) =>
        Game.playerStep(item.hit, item.defence, item.value, item.players)
        );

        Game.showResults($btnSubmit, players);
    }

    static createReloadButton() {
        const $wrap = createElement("div", "reloadWrap");
        const $button = createElement("button", "button");
      
        $button.innerText = "Restart";
        $wrap.appendChild($button);
        $arena.appendChild($wrap);
      
        $wrap.addEventListener("click", () => location.reload());
    };

    static createPlayer = (player) => {
        const { name, hp, img, playerNumber, isEnemy } = player;
        const $root = createElement("div", playerNumber);
        const $progressbar = createElement("div", "progressbar");
        const $life = createElement("div", "life");
        const $name = createElement("div", "name");
        const $isPlayer = createElement("div", "isPlayer");
        const $character = createElement("div", "character");
        const $img = createElement("img");
      
        $life.style.width = `${hp}%`;
        $name.innerText = name;
        $img.src = img;
      
        $progressbar.appendChild($life);
        $progressbar.appendChild($name);
        if (!isEnemy) {
          $progressbar.appendChild($isPlayer);
        }
      
        $character.appendChild($img);
      
        $root.appendChild($progressbar);
        $root.appendChild($character);
        return $root;
    };

    static generatePlayers = (hardMode = false, myPlayer = 0, _heroes = heroes) => {
        let players = [];
       
        Array(2).fill(0).forEach((item, index) => {
            const key = getRandomPlayer(Object.keys(_heroes));
            const hero = heroes[key];
            const randomHP = randomInteger(1, 100);
            
            players.push(
                new Player({
                    name: hero.name,
                    hp: hardMode ? randomHP : hero.hp,
                    img: hero.img,
                    weapon: hero.weapon,
                    number: index + 1,
                    isEnemy: myPlayer === index ? false : true
                })
            );
        });
        return players;
    };

    static renderPlayers = (players) => {
        if (players.length !== 2) return;

        let playersDOM = [];
        let enemyPlayer;
        let myPlayer;
      
        players.forEach((player, index) => {
            playersDOM.push(
                Game.createPlayer(player)
            );
      
            if (player.isEnemy) {
                enemyPlayer = player;
            } else {
                myPlayer = player;
            }
      
            $arena.appendChild(playersDOM[index]);
        });

        return {enemyPlayer, myPlayer};
    };

    static playerWin(name) {
        const $winTitle = createElement("div", "winTitle");
        
        $winTitle.innerText = name + " win!";
      
        Game.changeAudio({ src: "19" });
      
        return $winTitle;
    }

    static createAudio(...attr) {
        window.$audio = createElement("audio");
      
        const attributes = {
          preload: "auto",
          autoplay: "autoplay",
        };
      
        Object.assign(attributes, ...attr);
      
        for (var key in attributes) {
          $audio.setAttribute(`${key}`, `${attributes[key]}`);
          if (key === "src") {
            $audio.setAttribute("src", `./assets/audio/${attributes[key]}.mp3`);
          }
        }
      
        $root.appendChild($audio);
    }
      
    static changeAudio = (...attr) => {
        window.$audio.remove();
        
        Game.createAudio(...attr);
    }

    static showResults = ($btnSubmit, players) => {
        players.forEach((player) => {
          player.renderHP();
      
          if (player.hp <= 0) {
            $btnSubmit.disabled = true;
      
            const playersStatus = {};
      
            players.filter((item) => {
              if (item.playerNumber !== player.playerNumber) {
                playersStatus.win = item;
                return item;
              } else playersStatus.lose = item;
            });
            console.log(playersStatus);
      
            generateLogs("end", playersStatus.win, playersStatus.lose, $chat);
      
            $arena.appendChild(
                Game.playerWin(playersStatus.win.name));
            $arena.removeChild($formFight);
      
            Game.createReloadButton();
          }
        });
    }

    static playerStep(hit, defence, value, players) {
        const hitPlayer = players.hit;
        const defPlayer = players.defence;
      
        if (hitPlayer.hp > 0 && defPlayer.hp > 0) {
          if (hit !== defence) {
            defPlayer.changeHP(value);
            generateLogs("hit", hitPlayer, defPlayer, $chat);
          } else {
            generateLogs("defence", hitPlayer, defPlayer, $chat);
          }
        } else {
          console.error("HP < 0");
        }
    }
}