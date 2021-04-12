// src
const assets = 'http://reactmarathon-api.herokuapp.com/assets/';
interface Hero {
    name: string;
    img: string;
    weapon: [];
    hp: number;
    playerNumber?: number;
}
const heroes: Object<Hero> = {
    scorpion: {
        name: 'SCORPION',
        img: `${assets}/scorpion.gif`,
        weapon: [],
        hp: 100
    },
    kitana: {
        name: 'KITANA',
        img: `${assets}/kitana.gif`,
        weapon: [],
        hp: 100
    },
    liukang: {
        name: 'LIU-KANG',
        img: `${assets}/liukang.gif`,
        weapon: [],
        hp: 100
    },
    sonya: {
        name: 'SONYA',
        img: `${assets}/sonya.gif`,
        weapon: [],
        hp: 100
    },
    subzero: {
        name: 'SUB-ZERO',
        img: `${assets}/subzero.gif`,
        weapon: [],
        hp: 100
    }
}
// Dom
const $arena: HTMLDivElement = document.querySelector('.arenas');
const $randomBtn: HTMLButtonElement = document.querySelector('.button');
const $switchMode: HTMLInputElement = document.getElementById('checkbox');

// Global State
let players: [] = [];
let playersDOM: [] = [];

const createEl = (tag: string, className: string | null = null) => {
    if (!className) return document.createElement(tag);
    const $element = document.createElement(tag)
    $element.classList.add(className);
    return $element;
}

// Class
class CreatePlayer {
    constructor(name: string, hp: number, img: string, weapon: [string], number: number) {
        this.name = name;
        this.hp = hp;
        this.img = img;
        // this.weapon = weapon
        this.playerNumber = `player${number}`
    }

    // attack() {
    //     console.log(`${this.name} Fight...`)
    // }
    changeHP() {
        const $playerLife = document.querySelector(`.${this.playerNumber} .life`)
        this.hp -= Math.floor(Math.random() * 21);

        if (this.hp <=0 ) {
            $playerLife.style.width = `0%`;
        } else {
            $playerLife.style.width = `${this.hp}%`;
        }

    }
}

const createPlayer = (player: {
    name: string,
    hp: number,
    img: string,
    weapon: [string]
}) => {
    const {name, hp, img, playerNumber} = player
    const $root = createEl('div', playerNumber);
    const $progressbar = createEl('div', 'progressbar');
    const $life = createEl('div', 'life');
    const $name = createEl('div', 'name');
    const $character = createEl('div', 'character');
    const $img = createEl('img');

    $life.style.width = `${hp}%`;
    $name.innerText = name;
    $img.src = img;

    $progressbar.appendChild($life);
    $progressbar.appendChild($name);
    $character.appendChild($img);

    $root.appendChild($progressbar);
    $root.appendChild($character);
    return $root;
};

if (localStorage.getItem('gameMod')) {
    $switchMode.checked = JSON.parse(localStorage.getItem('gameMod'))
}

const getRandomPlayer = (list) => {
    return list[Math.floor(Math.random() * list.length)]
}
const generatePlayers = (hardMode: boolean = false, _heroes = heroes): void => {
    Array(2).fill(0).forEach((item, index) => {
        const key= getRandomPlayer(Object.keys(_heroes))
        const hero = heroes[key];
        const randomHP = Math.ceil(Math.random() * 100);

        players.push(new CreatePlayer(
            hero.name,
            hardMode ? randomHP : hero.hp,
            hero.img,
            hero.weapon,
            index + 1
        ));
    });
}
const refreshRender = () => {
    playersDOM.forEach(item => {
        $arena.removeChild(item);
    })
    players = [];
    playersDOM = [];

    generatePlayers(JSON.parse(localStorage.getItem('gameMod')));
    renderPlayers();
    $randomBtn.disabled = false;
    if ($arena.querySelector(".winTitle")) {
        const $winTitle = $arena.querySelector(".winTitle")
        $arena.removeChild($winTitle);
    }

}
const renderPlayers = () => {
    if (players.length !== 2) return;

    players.forEach((item, index) => {
        playersDOM.push(createPlayer(item));
        $arena.appendChild(playersDOM[index]);
    })
}

function playerWin(name) {
    const $winTitle = createEl('div','winTitle');
    $winTitle.innerText = name + ' win!'

    return $winTitle;
}

// ----------------------------
document.addEventListener('DOMContentLoaded', function() {
    generatePlayers(JSON.parse(localStorage.getItem('gameMod')));
    renderPlayers();


// listeners
    $randomBtn.addEventListener('click', () => {
        const whoseMove = Math.floor(Math.random() * 2);
        Number(whoseMove) === 0 ? players[0].changeHP() : players[1].changeHP();

        players.forEach((player, index) => {
            if (player.hp <= 0) {
                $randomBtn.disabled = true;
                const winPlayer = players.filter(item => item.playerNumber !== player.playerNumber)[0].name;
                $arena.appendChild(playerWin(winPlayer));
            }
        })
    })

    $switchMode.addEventListener("change", function() {
        if (localStorage.getItem('gameMod')) {
            localStorage.removeItem("gameMod");
        }

        localStorage.setItem("gameMod", this.checked);
        refreshRender();
    })
});

