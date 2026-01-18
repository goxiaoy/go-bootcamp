import { renderCard } from './js/view.js';
import { createLocalStore } from './js/storage.js';
import { buildTodayQueue, normalizeDate } from './js/logic.js';

const store = createLocalStore();
const panels = {
  start: document.getElementById('start'),
  card: document.getElementById('card'),
};
const cardRoot = document.getElementById('card-root');
const revealBtn = document.getElementById('reveal');
const exampleBtn = document.getElementById('example');

let showMeaning = false;
let showExample = false;
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
}

function setupPlan(count) {
  store.set('dailyCount', count);
  setPanel('card');

  const today = normalizeDate(new Date());
  const progress = store.get('progress', {});
  const { queue: todayQueue } = buildTodayQueue({
    words: queue,
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

revealBtn.addEventListener('click', () => {
  showMeaning = true;
  renderCurrent();
});

exampleBtn.addEventListener('click', () => {
  showExample = true;
  renderCurrent();
});
