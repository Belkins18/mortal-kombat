import { randomInteger } from "./index";

const logs = {
  start:
    "Часы показывали [time], когда [player1] и [player2] бросили вызов друг другу.",
  end: [
    "Результат удара [playerWins]: [playerLose] - труп",
    "[playerLose] погиб от удара бойца [playerWins]",
    "Результат боя: [playerLose] - жертва, [playerWins] - убийца",
  ],
  hit: [
    "[playerDefence] пытался сконцентрироваться, но [playerKick] разбежавшись раздробил копчиком левое ухо врага.",
    "[playerDefence] расстроился, как вдруг, неожиданно [playerKick] случайно раздробил грудью грудину противника.",
    "[playerDefence] зажмурился, а в это время [playerKick], прослезившись, раздробил кулаком пах оппонента.",
    "[playerDefence] чесал <вырезано цензурой>, и внезапно неустрашимый [playerKick] отчаянно размозжил грудью левый бицепс оппонента.",
    "[playerDefence] задумался, но внезапно [playerKick] случайно влепил грубый удар копчиком в пояс оппонента.",
    "[playerDefence] ковырялся в зубах, но [playerKick] проснувшись влепил тяжелый удар пальцем в кадык врага.",
    "[playerDefence] вспомнил что-то важное, но внезапно [playerKick] зевнув, размозжил открытой ладонью челюсть противника.",
    "[playerDefence] осмотрелся, и в это время [playerKick] мимоходом раздробил стопой аппендикс соперника.",
    "[playerDefence] кашлянул, но внезапно [playerKick] показав палец, размозжил пальцем грудь соперника.",
    "[playerDefence] пытался что-то сказать, а жестокий [playerKick] проснувшись размозжил копчиком левую ногу противника.",
    "[playerDefence] забылся, как внезапно безумный [playerKick] со скуки, влепил удар коленом в левый бок соперника.",
    "[playerDefence] поперхнулся, а за это [playerKick] мимоходом раздробил коленом висок врага.",
    "[playerDefence] расстроился, а в это время наглый [playerKick] пошатнувшись размозжил копчиком губы оппонента.",
    "[playerDefence] осмотрелся, но внезапно [playerKick] робко размозжил коленом левый глаз противника.",
    "[playerDefence] осмотрелся, а [playerKick] вломил дробящий удар плечом, пробив блок, куда обычно не бьют оппонента.",
    "[playerDefence] ковырялся в зубах, как вдруг, неожиданно [playerKick] отчаянно размозжил плечом мышцы пресса оппонента.",
    "[playerDefence] пришел в себя, и в это время [playerKick] провел разбивающий удар кистью руки, пробив блок, в голень противника.",
    "[playerDefence] пошатнулся, а в это время [playerKick] хихикая влепил грубый удар открытой ладонью по бедрам врага.",
  ],
  defence: [
    "[playerKick] потерял момент и храбрый [playerDefence] отпрыгнул от удара открытой ладонью в ключицу.",
    "[playerKick] не контролировал ситуацию, и потому [playerDefence] поставил блок на удар пяткой в правую грудь.",
    "[playerKick] потерял момент и [playerDefence] поставил блок на удар коленом по селезенке.",
    "[playerKick] поскользнулся и задумчивый [playerDefence] поставил блок на тычок головой в бровь.",
    "[playerKick] старался провести удар, но непобедимый [playerDefence] ушел в сторону от удара копчиком прямо в пятку.",
    "[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.",
    "[playerKick] не думал о бое, потому расстроенный [playerDefence] отпрыгнул от удара кулаком куда обычно не бьют.",
    "[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.",
  ],
  draw: "Ничья - это тоже победа!",
};

export const generateLogs = (
  type,
  { name: namePlayer1, hitValue: hitValuePlayer1 },
  { name: namePlayer2, hp: hpPlayer2 },
  chat
) => {
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const player1Template = `<span class="log log__player1">${namePlayer1}</span>`;
  const player2Template = `<span class="log log__player2">${namePlayer2}</span>`;
  const blockTemplate = `${player2Template} Blocked ${player1Template} HIT`;
  const hitTemplate = `${player1Template} Hit ${player2Template}`;

  let text;

  switch (type) {
    case "start":
      text = logs.start
        .replace("[time]", `<span>${time}</span>`)
        .replace("[player1]", `<span>${namePlayer1}</span>`)
        .replace("[player2]", `<span>${namePlayer2}</span>`);
      break;
    case "end":
      text = logs.end[randomInteger(0, logs.end.length - 1)]
        .replace("[playerWins]", `<span>${namePlayer1}</span>`)
        .replace("[playerLose]", `<span>${namePlayer2}</span>`);
      break;
    case "hit":
      text = `${logs.hit[randomInteger(0, logs.hit.length - 1)]
        .replace("[playerKick]", `<span>${namePlayer1}</span>`)
        .replace("[playerDefence]", `<span>${namePlayer2}</span>`)} 
        <br/><span>${hitTemplate} | Dmg: ${hitValuePlayer1} | HP(${namePlayer2}): ${
        hpPlayer2 <= 0 ? 0 : hpPlayer2
      }/100</span>`;
      break;
    case "defence":
      text = `${logs.defence[randomInteger(0, logs.defence.length - 1)]
        .replace("[playerKick]", `<span>${namePlayer1}</span>`)
        .replace(
          "[playerDefence]",
          `<span>${namePlayer2}</span>`
        )} <br/><span>${blockTemplate} | HP(${namePlayer2}): ${
        hpPlayer2 <= 0 ? 0 : hpPlayer2
      }/100</span>`;
      break;
    default:
      break;
  }

  const chatEl = `<p><span>${time}</span>: ${text}</p>`;

  chat.insertAdjacentHTML("afterbegin", chatEl);
};
