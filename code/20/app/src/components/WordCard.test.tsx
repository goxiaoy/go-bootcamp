import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { WordCard } from './WordCard';

it('renders word and meaning when enabled', () => {
  render(
    <WordCard
      word={{ text: 'abandon', meaning: '放弃', phonetic: '' }}
      showMeaning
      showExample={false}
    />
  );

  expect(screen.getByText('abandon')).toBeInTheDocument();
  expect(screen.getByText('放弃')).toBeInTheDocument();
});
