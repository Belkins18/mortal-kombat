import { randomInteger } from "../utils";
import { $formFight } from "../domEls";

const HIT = {
  head: 30,
  body: 25,
  foot: 20,
};
const ATTACK = ["head", "body", "foot"];

export default class Player {
  constructor(payload) {
    this.name = payload.name;
    this.hp = payload.hp;
    this.img = payload.img;
    this.weapon = payload.weapon;
    this.playerNumber = `player${payload.number}`;
    this.isEnemy = payload.isEnemy;
  }

  changeHP(value) {
    this.hp -= value;
  }

  renderHP() {
    const $playerLife = this.domHPElement();

    if (this.hp <= 0) {
      $playerLife.style.width = `0%`;
    } else {
      $playerLife.style.width = `${this.hp}%`;
    }
  }

  attack(player) {
    this.hitValue = 0;

    switch (player) {
      case "enemy":
        const hit = ATTACK[randomInteger(0, 2)];
        const defence = ATTACK[randomInteger(0, 2)];

        this.hitValue = randomInteger(0, HIT[hit]);

        return {
          value: this.hitValue,
          hit,
          defence,
        };
      case "player":
        const myPlayer = {};

        for (const item of $formFight) {
          if (item.checked && item.name === "hit") {
            myPlayer.value = randomInteger(0, HIT[item.value]);
            myPlayer.hit = item.value;
          }

          if (item.checked && item.name === "defence") {
            myPlayer.defence = item.value;
          }

          item.checked = false;
        }

        this.hitValue = myPlayer.value;

        return myPlayer;
    }
  }

  domHPElement() {
    return document.querySelector(`.${this.playerNumber} .life`);
  }
}
