import Player from "./modules/CreatePlayer";
import {
  createElement,
  randomInteger,
  getRandomPlayer,
  generateLogs,
} from "./utils";
import { $root, $arena, $chat, $formFight } from "./domEls";

// src
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

// Global State
let players = [];
let playersDOM = [];
let myPlayer;
let enemyPlayer;

const createReloadButton = () => {
  const $wrap = createElement("div", "reloadWrap");
  const $button = createElement("button", "button");

  $button.innerText = "Restart";
  $wrap.appendChild($button);
  $arena.appendChild($wrap);

  $wrap.addEventListener("click", () => location.reload());
};

const createPlayer = (player) => {
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

const generatePlayers = (hardMode = false, myPlayer = 0, _heroes = heroes) => {
  Array(2)
    .fill(0)
    .forEach((item, index) => {
      const key = getRandomPlayer(Object.keys(_heroes));
      const hero = heroes[key];
      const randomHP = randomInteger(1, 100);

      players.push(
        new Player(
          hero.name,
          hardMode ? randomHP : hero.hp,
          hero.img,
          hero.weapon,
          index + 1,
          myPlayer === index ? false : true
        )
      );
    });
};

const renderPlayers = () => {
  if (players.length !== 2) return;

  players.forEach((player, index) => {
    playersDOM.push(createPlayer(player));

    if (player.isEnemy) {
      enemyPlayer = player;
    } else {
      myPlayer = player;
    }

    $arena.appendChild(playersDOM[index]);
  });
};

function playerWin(name) {
  const $winTitle = createElement("div", "winTitle");
  $winTitle.innerText = name + " win!";

  changeAudio({ src: "19" });

  return $winTitle;
}

function createAudio(...attr) {
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

function changeAudio(...attr) {
  window.$audio.remove();

  createAudio(...attr);
}

function showResults($btnSubmit) {
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

      $arena.appendChild(playerWin(playersStatus.win.name));
      $arena.removeChild($formFight);

      createReloadButton();
    }
  });
}

// ----------------------------
function playerStep(hit, defence, value, players) {
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

document.addEventListener("DOMContentLoaded", function () {
  createAudio({
    src: randomInteger(1, 3),
    allow: "autoplay 'src'",
    loop: "loop",
  });
  generatePlayers(JSON.parse(localStorage.getItem("gameMod")));
  renderPlayers();

  generateLogs("start", myPlayer, enemyPlayer, $chat);

  // listeners
  $formFight.addEventListener("submit", (event) => {
    event.preventDefault();
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
      playerStep(item.hit, item.defence, item.value, item.players)
    );

    showResults($btnSubmit);
  });

  const playPromise = $audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(function () {
        console.log("Automatic playback started!");
      })
      .catch(function (error) {
        console.error(error + "\nZar! How i can resolse this problem?");
      });
  }
});
