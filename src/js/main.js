import Game from "./modules/Game";

const game = new Game({});

document.addEventListener("DOMContentLoaded", async function () {  
    game.init();
});
