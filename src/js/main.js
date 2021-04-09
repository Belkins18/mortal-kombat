// src
const assets = 'http://reactmarathon-api.herokuapp.com/assets/'
const imgList = {
    scorpion: `${assets}/scorpion.gif`,
    kitana: `${assets}/kitana.gif`,
    liukang: `${assets}/liukang.gif`,
    sonya: `${assets}/sonya.gif`,
    subzero: `${assets}/subzero.gif`,
}
// Dom
const $arena = document.querySelector('.arenas');

// Class
class CreatePlayer {
    constructor(name: string, hp: number, img: string, weapon: [string]) {
        this.name = name;
        this.hp = hp;
        this.img = img;
        this.weapon = weapon
    }

    attack() {
        console.log(`${this.name} Fight...`)
    }
}

const createPlayer = (playerNumber: string, player: {
    name: string, hp: number, img: string, weapon: [string]
}) => {
    const createEl = (tag: string, className: string | null = null) => {
        if (!className) return document.createElement(tag);
        const $element = document.createElement(tag)
        $element.classList.add(className);
        return $element;
    }

    const {name, hp, img, weapon} = player
    console.log(player.img)
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
}

const scorpion = new CreatePlayer('SCORPION', 50, imgList.scorpion, []);
const subzero = new CreatePlayer('SUB-ZERO', 80, imgList.subzero, []);

const player1 = createPlayer('player1', scorpion);
const player2 = createPlayer('player2', subzero);

$arena.appendChild(player1);
$arena.appendChild(player2);
