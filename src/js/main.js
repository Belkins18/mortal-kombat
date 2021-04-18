// src
const assets = 'http://reactmarathon-api.herokuapp.com/assets/';
const heroes = {
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
const HIT = {
    head: 30,
    body: 25,
    foot: 20,
}
const ATTACK = ['head', 'body', 'foot'];


// Dom
const $root = document.querySelector('.root');
const $arena = document.querySelector('.arenas');
const $switchMode = document.getElementById('checkbox');
const $formFight = document.querySelector('.control');

// Global State
let players = [];
let playersDOM = [];
let myPlayer;
let enemyPlayer;

const createEl = (tag, className = null) => {
    if (!className) return document.createElement(tag);
    const $element = document.createElement(tag)
    $element.classList.add(className);
    return $element;
}

const createReloadButton = () => {
    const $wrap = createEl('div', 'reloadWrap');
    const $button = createEl('button', 'button');

    $button.innerText = 'Restart';
    $wrap.appendChild($button);
    $arena.appendChild($wrap);

    $wrap.addEventListener('click', () => window.location.reload());
}

const randomInteger = (min, max) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

// Class
class CreatePlayer {
    constructor(
        name, 
        hp, 
        img, 
        weapon, 
        number, 
        isEnemy) {
        this.name = name;
        this.hp = hp;
        this.img = img;
        // this.weapon = weapon
        this.playerNumber = `player${number}`
        this.isEnemy = isEnemy;
    }

    changeHP(value) {
        this.hp -= value;
    }

    renderHP() {
        const $playerLife = this.elHP();

        if (this.hp <= 0) {
            $playerLife.style.width = `0%`;
        } else {
            $playerLife.style.width = `${this.hp}%`;
        }
    }

    elHP() {
        return document.querySelector(`.${this.playerNumber} .life`)
    }

    enemyAttack() {
        const hit = ATTACK[randomInteger(0, 2)];
        const defence = ATTACK[randomInteger(0, 2)];
        
        return {
            value: randomInteger(0, HIT[hit]),
            hit,
            defence
        }
    }

    playerAttack () {
        const myPlayerRaundStep = {};

        for (const item of $formFight) {

            if (item.checked && item.name === 'hit') {
                myPlayerRaundStep.value = randomInteger(0, HIT[item.value]);
                myPlayerRaundStep.hit = item.value;
            }

            if (item.checked && item.name === 'defence') {
                myPlayerRaundStep.defence = item.value
            }

            item.checked = false;
        }
        return myPlayerRaundStep;
    }
}

const createPlayer = (player) => {
    const { name, hp, img, playerNumber, isEnemy } = player
    const $root = createEl('div', playerNumber);
    const $progressbar = createEl('div', 'progressbar');
    const $life = createEl('div', 'life');
    const $name = createEl('div', 'name');
    const $isPlayer = createEl('div', 'isPlayer');
    const $character = createEl('div', 'character');
    const $img = createEl('img');

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

if (localStorage.getItem('gameMod')) {
    $switchMode.checked = JSON.parse(localStorage.getItem('gameMod'))
}

const getRandomPlayer = (list) => {
    return list[Math.floor(Math.random() * list.length)]
}

const generatePlayers = (
    hardMode = false, 
    myPlayer = 0, 
    _heroes = heroes
) => {
    Array(2).fill(0).forEach((item, index) => {
        const key = getRandomPlayer(Object.keys(_heroes))
        const hero = heroes[key];
        const randomHP = randomInteger(1, 100);

        players.push(new CreatePlayer(
            hero.name,
            hardMode ? randomHP : hero.hp,
            hero.img,
            hero.weapon,
            index + 1,
            myPlayer === index ? false : true
        ));
    });
}

const refreshRender = () => {
    playersDOM.forEach(item => {
        $arena.removeChild(item);
    })
    players = [];
    playersDOM = [];

    generatePlayers(JSON.parse(localStorage.getItem('gameMod')), 1);
    renderPlayers();
    $fightBtn.disabled = false;

    if ($arena.querySelector(".winTitle")) {
        const $winTitle = $arena.querySelector(".winTitle")
        $arena.removeChild($winTitle);
    }

}

const renderPlayers = () => {
    if (players.length !== 2) return;

    players.forEach((player, index) => {
        console.log(player)
        playersDOM.push(createPlayer(player));
        
        if (player.isEnemy) {
            enemyPlayer = player;
        } else {
            myPlayer = player;
        }
        
        $arena.appendChild(playersDOM[index]);
    })
}

function playerWin(name) {
    const $winTitle = createEl('div', 'winTitle');
    $winTitle.innerText = name + ' win!';

    changeAudio({ src: '19'});

    return $winTitle;
}

function createAudio(...attr) {
    window.$audio = createEl('audio');

    const attributes = {
        preload: "auto",
        autoplay: "autoplay",
    }

    Object.assign(attributes, ...attr);

    for (var key in attributes) {
        $audio.setAttribute(`${key}`, `${attributes[key]}`)
        if (key === 'src') {
            $audio.setAttribute('src', `./assets/audio/${attributes[key]}.mp3`);
        }
    }

    $root.appendChild($audio);
}

function changeAudio(...attr) {
    window.$audio.remove();

    createAudio(...attr)
}

// ----------------------------
function playerStep(hit, defence, value, playerInstance) {
    if (hit !== defence) {
        playerInstance.changeHP(value);
    } 
}

document.addEventListener('DOMContentLoaded', function () {
    createAudio({ src: randomInteger(1, 3), allow: "autoplay 'src'", loop: "loop" });
    generatePlayers(JSON.parse(localStorage.getItem('gameMod')), randomInteger(0, 1));
    renderPlayers();
    
    console.log('myPlayer', {
        ...myPlayer
    })
    console.log('enemyPlayer', {
        ...enemyPlayer
    })

    // listeners
    $switchMode.addEventListener("change", function () {
        if (localStorage.getItem('gameMod')) {
            localStorage.removeItem("gameMod");
        }

        localStorage.setItem("gameMod", this.checked);
        refreshRender();
        changeAudio({ src: randomInteger(1, 3), loop: "loop" });
    });

    $formFight.addEventListener('submit', (event) => {
        event.preventDefault();
        const $btnSubmit = $formFight.querySelector("button[type='submit']")
        const myPlayerRaundStep = myPlayer.playerAttack();
        const enemyPlayerRaundStep = enemyPlayer.enemyAttack();
        const actors  = [
            {
                hit: myPlayerRaundStep.hit,
                defence: enemyPlayerRaundStep.defence,
                value: myPlayerRaundStep.value,
                player: enemyPlayer
            },
            {
                hit: enemyPlayerRaundStep.hit,
                defence: myPlayerRaundStep.defence,
                value: enemyPlayerRaundStep.value,
                player: myPlayer
            }, 
            
        ];
        console.log('myPlayer', {
            ...myPlayerRaundStep
        })
        console.log('enemyPlayer', {
            ...enemyPlayerRaundStep
        })

        actors.forEach(item => playerStep(item.hit, item.defence, item.value, item.player));
    
        players.forEach((player, index) => {
            player.renderHP();

            if (player.hp <= 0) {
                $btnSubmit.disabled = true;
                
                const winPlayer = players.filter(item => item.playerNumber !== player.playerNumber)[0].name;
                
                $arena.appendChild(playerWin(winPlayer));
                $arena.removeChild($formFight);
                createReloadButton();
            }
        })
    })

    const playPromise = $audio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(function() {
            console.log('Automatic playback started!');
        }).catch(function(error) {
            console.error('Zar! How i can resolse this problem?');
        });
    };

});

