import { generateLogs } from "./logs";

const createElement = (tag, className = null) => {
  if (!className) return document.createElement(tag);
  const $element = document.createElement(tag);
  $element.classList.add(className);
  return $element;
};

const randomInteger = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

const getRandomPlayer = (list) => {
  return list[Math.floor(Math.random() * list.length)];
};

export { createElement, randomInteger, getRandomPlayer, generateLogs };
