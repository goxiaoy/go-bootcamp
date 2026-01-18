import test from 'node:test';
import assert from 'node:assert/strict';
import { renderCard } from '../app/js/view.js';

test('renderCard returns HTML for word card', () => {
  const html = renderCard(
    {
      text: 'abandon',
      phonetic: '/əˈbændən/',
      meaning: '放弃',
      example: 'He abandoned the plan.',
      pos: 'v.',
    },
    { showMeaning: true, showExample: false }
  );

  assert.ok(html.includes('abandon'));
  assert.ok(html.includes('放弃'));
  assert.ok(!html.includes('He abandoned the plan.'));
});
