export function renderCard(word, state) {
  const meaning = state.showMeaning
    ? `<div class="meaning">${word.meaning}</div>`
    : '';
  const example = state.showExample
    ? `<div class="example">${word.example}</div>`
    : '';
  const pos = word.pos ? `<span class="pos">${word.pos}</span>` : '';

  return `
    <div class="card">
      <div class="word">${word.text}</div>
      <div class="phonetic">${word.phonetic || ''}</div>
      ${pos}
      ${meaning}
      ${example}
    </div>
  `;
}
