# React + shadcn/ui 改造设计

## 目标与范围
- 将 `code/20/app` 直接替换为 Vite + React + TypeScript + shadcn/ui。
- 保留“词卡学习 + 计划选择”的核心流程，不扩张功能。
- 继续使用本地词表与 LocalStorage 进度。

## 技术与结构
- 前端根目录：`code/20/app`（Vite 项目根）。
- 入口：`app/index.html` + `app/src/main.tsx`。
- 依赖：shadcn/ui + Tailwind + Radix + class-variance-authority。

## 组件拆分
- `PlanSelector`：每日学习量选择。
- `WordCard`：单词展示、释义/例句切换。
- `NavigationBar`：上一个/下一个。
- `ProgressBar`：今日进度。
- `App`：负责加载词表、生成队列、持久化进度。

## 数据流
- 启动时加载 `data/words.json`，生成今日队列。
- `App` 管理 `queue`、`index`、`showMeaning`、`showExample`。
- 上/下切换会重置展示状态。
- 计划与进度写入 LocalStorage，重启可恢复。

## 交互与样式
- 主要按钮与卡片使用 shadcn/ui 组件。
- 移动端优先：大字号、触控友好、清晰层级。
- 自定义少量 Tailwind class，避免过度定制。

## 错误处理
- 词表加载失败：提示错误并提供重试。
- LocalStorage 不可用：提示“临时模式”。

## 测试
- 初期先搭建界面与逻辑；后续补充 Vitest + RTL 的组件测试。
