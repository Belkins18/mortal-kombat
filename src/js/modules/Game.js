import Player from "./Player";
import FetchApi from "./FetchApi";
import { createElement, randomInteger, generateLogs } from "../utils";
import { $root, $arena, $chat, $formFight } from "../domEls";

const _api = new FetchApi();

export default class Game {
  constructor(payload) {
    Object.assign(this, payload);
  }

  async init() {
    Game.createAudio({
      src: randomInteger(1, 3),
      allow: "autoplay 'src'",
      loop: "loop",
    });
    this.playersForGame = [];
    this.playersForGameDOM = [];
    await this.renderPlayers();

    console.log("Me: ", this.myPlayer);
    console.log("Enemy: ", this.enemyPlayer);

    generateLogs("start", this.myPlayer, this.enemyPlayer, $chat);

    $formFight.addEventListener("submit", (event) => this.onFormSubmit(event));
  }

  async setEnemyPlayer() {
    const enemyPlayer = await _api.getEnemyPlayer();
    console.log(enemyPlayer);

    this.enemyPlayer = new Player({
      ...enemyPlayer,
      weapon: [],
      number: 2,
      isEnemy: true,
    });

    $arena.appendChild(this.enemyPlayer.createPlayer());
  }

  setMyPlayer(payload) {
    this.myPlayer = new Player({
      ...payload,
      weapon: [],
      number: 1,
    });

    $arena.appendChild(this.myPlayer.createPlayer());
  }
  async renderPlayers() {
    this.setMyPlayer(JSON.parse(localStorage.getItem('player1')));
    await this.setEnemyPlayer();
  }

  async onFormSubmit(event) {
    event.preventDefault();

    const $btnSubmit = $formFight.querySelector("button[type='submit']");
    const raundResults = await _api.getFightStats(this.myPlayer.attackPlayer());

    const { player1, player2 } = raundResults;
    const actors = [
      {
        hit: player1.hit,
        defence: player2.defence,
        value: player1.value,
        players: {
          hit: this.myPlayer,
          defence: this.enemyPlayer,
        },
      },
      {
        hit: player2.hit,
        defence: player1.defence,
        value: player2.value,
        players: {
          hit: this.enemyPlayer,
          defence: this.myPlayer,
        },
      },
    ];
    console.log("myPlayer", {
      ...player1,
    });
    console.log("enemyPlayer", {
      ...player2,
    });

    actors.forEach((item) =>
      this.playerStep(item.hit, item.defence, item.value, item.players)
    );

    this.showResults($btnSubmit, [this.myPlayer, this.enemyPlayer]);
  }

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

    $wrap.addEventListener("click", () => location.pathname = '/');
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
