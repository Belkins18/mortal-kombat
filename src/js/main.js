import {logs} from './logs';
// src
const assets = 'http://reactmarathon-api.herokuapp.com/assets/';
const heroes = {
    scorpion: {
        name: 'SCORPION',
        img: `${assets}/scorpion.gif`,
        weapon: [],
        hp: 10
    },
    kitana: {
        name: 'KITANA',
        img: `${assets}/kitana.gif`,
        weapon: [],
        hp: 10
    },
    liukang: {
        name: 'LIU-KANG',
        img: `${assets}/liukang.gif`,
        weapon: [],
        hp: 10
    },
    sonya: {
        name: 'SONYA',
        img: `${assets}/sonya.gif`,
        weapon: [],
        hp: 10
    },
    subzero: {
        name: 'SUB-ZERO',
        img: `${assets}/subzero.gif`,
        weapon: [],
        hp: 10
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
const $chat = document.querySelector('.chat');

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

    attack(player) {
        this.hitValue = 0;

        switch (player) {
            case 'enemy':
                const hit = ATTACK[randomInteger(0, 2)];
                const defence = ATTACK[randomInteger(0, 2)];
                
                this.hitValue = randomInteger(0, HIT[hit])

                return {
                    value: this.hitValue,
                    hit,
                    defence
                }
            case 'player':
                const myPlayer = {};

                for (const item of $formFight) {
        
                    if (item.checked && item.name === 'hit') {
                        myPlayer.value = randomInteger(0, HIT[item.value]);
                        myPlayer.hit = item.value;
                    }
        
                    if (item.checked && item.name === 'defence') {
                        myPlayer.defence = item.value
                    }
        
                    item.checked = false;
                }

                this.hitValue = myPlayer.value;
                
                return myPlayer;
        }
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

    generatePlayers(JSON.parse(localStorage.getItem('gameMod')));
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
        // console.log(player)
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

function showResults($btnSubmit) {
    players.forEach((player) => {
        player.renderHP();

        if (player.hp <= 0) {
            $btnSubmit.disabled = true;
            
            const playersStatus = {};
            
            players
                .filter(item => {
                    if (item.playerNumber !== player.playerNumber) {
                        playersStatus.win = item
                        return item
                    } else playersStatus.lose = item
                })
            console.log(playersStatus);
            
            generateLogs('end', playersStatus.win, playersStatus.lose);

            $arena.appendChild(playerWin(playersStatus.win.name));
            $arena.removeChild($formFight);

            createReloadButton();
        }
    })
}


function generateLogs(type, player1, player2) {
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    let text;
    switch (type) {
        case 'start':
            text = logs.start
                .replace('[time]', time)
                .replace('[player1]', player1.name)
                .replace('[player2]', player2.name)
            break;
        case 'end':
            text = logs.end[randomInteger(0, logs.end.length - 1)]
                .replace('[playerWins]', player1.name)
                .replace('[playerLose]', player2.name)
            break;
        case 'hit':
            console.log('player1', player1.hitValue);


            text = `${logs.hit[randomInteger(0, logs.hit.length - 1)]
                .replace('[playerKick]', player1.name)
                .replace('[playerDefence]', player2.name)} | Dmg: ${player1.hitValue} | HP(${player2.name}): ${player2.hp <= 0 ? 0 : player2.hp}/100`;
            break;
        case 'defence':
            text = `${logs.defence[randomInteger(0, logs.defence.length - 1)]
                .replace('[playerKick]', player1.name)
                .replace('[playerDefence]', player2.name)} | HP(${player2.name}): ${player2.hp <= 0 ? 0 : player2.hp}/100`
            break;
        default:
            break;
    }
    console.log(text);
    const chatEl = `<p>${time}: ${text}</p>`;
    $chat.insertAdjacentHTML('afterbegin', chatEl);
}

// ----------------------------
function playerStep(hit, defence, value, players) {
    const hitPlayer = players.hit;
    const defPlayer = players.defence;

    // console.log('hitPlayer', hitPlayer);
    // console.log('defPlayer', defPlayer.name);

    if(hitPlayer.hp > 0 && defPlayer.hp > 0) {
        if (hit !== defence) {
            defPlayer.changeHP(value);
            generateLogs('hit', hitPlayer, defPlayer);
        } else {
            generateLogs('defence', hitPlayer, defPlayer);
        }    
    } else {
        console.error('HP < 0')
    }    
}

document.addEventListener('DOMContentLoaded', function () {
    createAudio({ src: randomInteger(1, 3), allow: "autoplay 'src'", loop: "loop" });
    generatePlayers(JSON.parse(localStorage.getItem('gameMod')));
    renderPlayers();

    generateLogs('start', myPlayer, enemyPlayer);

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
        const myPlayerRaundStep = myPlayer.attack('player');
        const enemyPlayerRaundStep = enemyPlayer.attack('enemy');
        const actors  = [
            {
                hit: myPlayerRaundStep.hit,
                defence: enemyPlayerRaundStep.defence,
                value: myPlayerRaundStep.value,
                players: {
                    hit: myPlayer,
                    defence: enemyPlayer 
                }
            },
            {
                hit: enemyPlayerRaundStep.hit,
                defence: myPlayerRaundStep.defence,
                value: enemyPlayerRaundStep.value,
                players: {
                    hit: enemyPlayer,
                    defence: myPlayer 
                }
            }, 
            
        ];
        console.log('myPlayer', {
            ...myPlayerRaundStep
        })
        console.log('enemyPlayer', {
            ...enemyPlayerRaundStep
        })

        actors.forEach(item => 
            playerStep(item.hit, item.defence, item.value, item.players));
        
        showResults($btnSubmit);
        
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

