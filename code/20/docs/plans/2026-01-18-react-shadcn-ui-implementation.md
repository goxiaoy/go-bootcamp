# React + shadcn/ui Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 `code/20/app` 重建为 Vite + React + TypeScript + shadcn/ui 的前端，并保留词卡学习流程。

**Architecture:** 用 Vite 管理前端构建，React 组件驱动页面，业务逻辑与视图拆分。词表数据仍在 `app/public/data/words.json`，本地进度由 LocalStorage 保存。

**Tech Stack:** Vite, React, TypeScript, Tailwind, shadcn/ui, Vitest, React Testing Library.

---

### Task 1: 初始化 Vite + React + TypeScript 项目

**Files:**
- Delete: `code/20/app/*` (旧静态文件)
- Create: `code/20/app/*` (Vite 脚手架生成)

**Step 1: Remove old app directory**

Run: `rm -rf code/20/app`
Expected: `code/20/app` 不存在。

**Step 2: Create Vite app**

Run: `npm create vite@latest code/20/app -- --template react-ts`
Expected: 生成 `code/20/app/package.json` 与 `code/20/app/src/main.tsx`。

**Step 3: Install dependencies**

Run: `cd code/20/app && npm install`
Expected: `node_modules` 生成，无报错。

**Step 4: Commit**

```bash
git add code/20/app

git commit -m "chore: scaffold Vite React app"
```

---

### Task 2: 初始化 Tailwind 与 shadcn/ui

**Files:**
- Modify: `code/20/app/tailwind.config.ts`
- Modify: `code/20/app/src/index.css`
- Create: `code/20/app/components.json`
- Create: `code/20/app/src/components/ui/*`

**Step 1: Install Tailwind + shadcn deps**

Run:
```bash
cd code/20/app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-progress
```

Expected: `tailwind.config.ts` 和 `postcss.config.js` 创建。

**Step 2: Initialize shadcn/ui**

Run: `cd code/20/app && npx shadcn-ui@latest init`
Expected: 生成 `components.json` 与 `src/components/ui`。

**Step 3: Configure Tailwind**

Edit `tailwind.config.ts` to include:
```ts
content: ["./index.html", "./src/**/*.{ts,tsx}"],
```

Add in `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: Commit**

```bash
git add code/20/app

git commit -m "chore: set up tailwind and shadcn ui"
```

---

### Task 3: 迁移业务逻辑到 TypeScript + 测试

**Files:**
- Create: `code/20/app/src/lib/logic.ts`
- Create: `code/20/app/src/lib/navigation.ts`
- Create: `code/20/app/src/lib/storage.ts`
- Create: `code/20/app/src/lib/logic.test.ts`

**Step 1: Write failing test**

```ts
// code/20/app/src/lib/logic.test.ts
import { describe, it, expect } from 'vitest';
import { buildTodayQueue } from './logic';

it('buildTodayQueue picks review + new', () => {
  const words = [
    { id: 'w1', text: 'abandon' },
    { id: 'w2', text: 'ability' },
  ];
  const progress = { w1: { nextReview: '2026-01-18', stage: 1 } };
  const { queue, reviewIds, newIds } = buildTodayQueue({
    words,
    progress,
    dailyCount: 2,
    today: '2026-01-18',
  });

  expect(reviewIds).toEqual(['w1']);
  expect(newIds).toEqual(['w2']);
  expect(queue.length).toBe(2);
});
```

**Step 2: Run test to verify it fails**

Run: `cd code/20/app && npx vitest run src/lib/logic.test.ts`
Expected: FAIL (module not found).

**Step 3: Implement minimal logic**

```ts
// code/20/app/src/lib/logic.ts
const REVIEW_SPACING = [1, 3, 7, 14, 30];

export function normalizeDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function buildTodayQueue({ words, progress, dailyCount, today }) {
  const reviewIds = words
    .filter((word) => progress[word.id]?.nextReview <= today)
    .map((word) => word.id);

  const newIds = words
    .filter((word) => !progress[word.id])
    .map((word) => word.id)
    .slice(0, Math.max(dailyCount - reviewIds.length, 0));

  const queue = [...reviewIds, ...newIds].map((id) =>
    words.find((word) => word.id === id)
  );

  return { queue, newIds, reviewIds };
}
```

Add `navigation.ts` and `storage.ts` (LocalStorage wrapper) similar to current JS version.

**Step 4: Run test to verify it passes**

Run: `cd code/20/app && npx vitest run src/lib/logic.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add code/20/app/src/lib

git commit -m "feat: add core logic modules"
```

---

### Task 4: 实现核心 React 组件

**Files:**
- Create: `code/20/app/src/components/PlanSelector.tsx`
- Create: `code/20/app/src/components/WordCard.tsx`
- Create: `code/20/app/src/components/NavigationBar.tsx`
- Create: `code/20/app/src/components/ProgressBar.tsx`
- Modify: `code/20/app/src/App.tsx`

**Step 1: Write failing test**

```ts
// code/20/app/src/components/WordCard.test.tsx
import { render, screen } from '@testing-library/react';
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
```

**Step 2: Run test to verify it fails**

Run: `cd code/20/app && npx vitest run src/components/WordCard.test.tsx`
Expected: FAIL (module not found).

**Step 3: Implement components**

Use shadcn/ui `Card`, `Button`, `Progress` 组合完成界面。

**Step 4: Run test to verify it passes**

Run: `cd code/20/app && npx vitest run src/components/WordCard.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add code/20/app/src/components code/20/app/src/App.tsx

git commit -m "feat: add core ui components"
```

---

### Task 5: 词表加载与离线支持

**Files:**
- Create: `code/20/app/public/data/words.json`
- Modify: `code/20/app/src/App.tsx`
- Modify: `code/20/app/vite.config.ts`

**Step 1: Move word list**

Copy current `code/20/app/data/words.json` to `code/20/app/public/data/words.json`.

**Step 2: Load data in App**

In `App.tsx`, fetch `/data/words.json` and build queue.

**Step 3: Commit**

```bash
git add code/20/app/public/data/words.json code/20/app/src/App.tsx

git commit -m "feat: load word list in React app"
```

---

### Task 6: 更新开发与运行说明

**Files:**
- Modify: `code/20/README.md`

**Step 1: Update README**

Add instructions:
```md
cd code/20/app
npm install
npm run dev
```

**Step 2: Commit**

```bash
git add code/20/README.md

git commit -m "docs: add React app run instructions"
```
