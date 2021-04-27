import Player from "./Player";
import {
  createElement,
  randomInteger,
  getRandomPlayer,
  generateLogs,
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
    this.playersForGame = [];
    this.playersForGameDOM = [];

    Game.createAudio({
      src: randomInteger(1, 3),
      allow: "autoplay 'src'",
      loop: "loop",
    });

    this.generatePlayers(false, 0, heroes);
    this.renderPlayers();

    generateLogs("start", this.myPlayer, this.enemyPlayer, $chat);

    $formFight.addEventListener("submit", (event) => this.onFormSubmit(event));
  };

  onFormSubmit(event) {
    event.preventDefault();

    const $btnSubmit = $formFight.querySelector("button[type='submit']");
    const myPlayerRaundStep = this.myPlayer.attack("player");
    const enemyPlayerRaundStep = this.enemyPlayer.attack("enemy");
    const actors = [
      {
        hit: myPlayerRaundStep.hit,
        defence: enemyPlayerRaundStep.defence,
        value: myPlayerRaundStep.value,
        players: {
          hit: this.myPlayer,
          defence: this.enemyPlayer,
        },
      },
      {
        hit: enemyPlayerRaundStep.hit,
        defence: myPlayerRaundStep.defence,
        value: enemyPlayerRaundStep.value,
        players: {
          hit: this.enemyPlayer,
          defence: this.myPlayer,
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
      this.playerStep(item.hit, item.defence, item.value, item.players)
    );

    this.showResults($btnSubmit, [this.myPlayer, this.enemyPlayer]);
  }

  generatePlayers = (hardMode = false, myPlayer = 0, _heroes = heroes) => {
    Array(2)
      .fill(0)
      .forEach((item, index) => {
        const key = getRandomPlayer(Object.keys(_heroes));
        const hero = heroes[key];
        const randomHP = randomInteger(1, 100);

        this.playersForGame.push(
          new Player({
            name: hero.name,
            hp: hardMode ? randomHP : hero.hp,
            img: hero.img,
            weapon: hero.weapon,
            number: index + 1,
            isEnemy: myPlayer === index ? false : true,
          })
        );
      });
  };

  renderPlayers = () => {
    if (this.playersForGame.length !== 2) return;

    this.playersForGame.forEach((player) => {
      const $player = player.createPlayer();

      if (player.isEnemy) {
        this.enemyPlayer = player;
      } else {
        this.myPlayer = player;
      }

      $arena.appendChild($player);
    });
  };

  showResults = ($btnSubmit, players) => {
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

        $arena.appendChild(Game.playerWin(playersStatus.win.name));
        $arena.removeChild($formFight);

        Game.createReloadButton();
      }
    });
  };

  playerStep(hit, defence, value, players) {
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

  static playerWin(name) {
    const $winTitle = createElement("div", "winTitle");

    $winTitle.innerText = name + " win!";

    Game.changeAudio({ src: "19" });

    return $winTitle;
  }
  
  static createReloadButton() {
    const $wrap = createElement("div", "reloadWrap");
    const $button = createElement("button", "button");

    $button.innerText = "Restart";
    $wrap.appendChild($button);
    $arena.appendChild($wrap);

    $wrap.addEventListener("click", () => location.reload());
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
      $audio.volume = 0.02;
    }

    $root.appendChild($audio);
  }

  static changeAudio = (...attr) => {
    window.$audio.remove();

    Game.createAudio(...attr);
  };
}
