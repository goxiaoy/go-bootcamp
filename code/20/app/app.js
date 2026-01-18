import { renderCard } from './js/view.js';
import { createLocalStore } from './js/storage.js';
import { buildTodayQueue, normalizeDate } from './js/logic.js';
import { nextIndex, prevIndex } from './js/navigation.js';

const store = createLocalStore();
const panels = {
  start: document.getElementById('start'),
  card: document.getElementById('card'),
};
const cardRoot = document.getElementById('card-root');
const revealBtn = document.getElementById('reveal');
const exampleBtn = document.getElementById('example');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let showMeaning = false;
let showExample = false;
let words = [];
let queue = [];
let index = 0;

function setPanel(name) {
  Object.values(panels).forEach((panel) => panel.classList.remove('active'));
  panels[name].classList.add('active');
}

function renderCurrent() {
  const word = queue[index];
  if (!word) return;
  cardRoot.innerHTML = renderCard(word, { showMeaning, showExample });
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index >= queue.length - 1;
}

async function setupPlan(count) {
  store.set('dailyCount', count);
  setPanel('card');

  await wordsReady;
  const today = normalizeDate(new Date());
  const progress = store.get('progress', {});
  const { queue: todayQueue } = buildTodayQueue({
    words,
    progress,
    dailyCount: count,
    today,
  });
  queue = todayQueue;
  index = 0;
  showMeaning = false;
  showExample = false;
  renderCurrent();
}

function bindPlanButtons() {
  document.querySelectorAll('[data-count]').forEach((btn) => {
    btn.addEventListener('click', () => setupPlan(Number(btn.dataset.count)));
  });
}

bindPlanButtons();

async function loadWords() {
  const response = await fetch('./data/words.json');
  words = await response.json();
}

const wordsReady = loadWords();

revealBtn.addEventListener('click', () => {
  showMeaning = true;
  renderCurrent();
});

exampleBtn.addEventListener('click', () => {
  showExample = true;
  renderCurrent();
});

prevBtn.addEventListener('click', () => {
  if (!queue.length) return;
  index = prevIndex(index, queue.length);
  showMeaning = false;
  showExample = false;
  renderCurrent();
});

nextBtn.addEventListener('click', () => {
  if (!queue.length) return;
  index = nextIndex(index, queue.length);
  showMeaning = false;
  showExample = false;
  renderCurrent();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}
