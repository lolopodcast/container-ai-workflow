# Container 專案筆記

## 中文用語規則

**完整對照表在 `~/.claude/CLAUDE.md` 的「中文用語規則」一節**（2026-08-08 移至該處）——此處不再複製一份，避免兩份各自演化，這是 KB 紀律一「同步義務」的直接應用。

本專案額外注意：教材同時有中英雙語，**改中文用語時英文版通常不必動**（`framework`、`optimization` 在英文裡都是正常字）。批次替換前先確認只掃中文區段。

## 教材撰寫規範（KB 紀律五的自我應用）

SPA 模組的深入解析段落**以 100–300 字為準**（最早寫的 M1–M4 是 103–262 字）。超過就代表該拆成「短導言＋要點區塊」——`m{n}_pts` 支援分組條列，用它承載列舉內容，別把結構壓平成散文。

**每次追加內容後，回頭跟這個標準比對，不要跟上一次的追加比對。** 檢查方式：列出各模組段落字數並排比較。

## PWA 快取版本號 — 每次改動需精快取的檔案都要記得升版

`sw.js` 目前的 `CACHE_NAME` 是 **`caiw-shell-v21`**（2026-08-08 因一致性檢查抓出 `框架誤用`→架構誤用、`宏觀任務`→大型任務升版）。

只要修改了以下任一被 service worker 預先快取（`APP_SHELL`）的檔案，就必須把 `sw.js` 裡的 `CACHE_NAME` 版本號往上加一（`v1` → `v2`），否則已經造訪過的使用者會因為快取策略是 stale-while-revalidate、且只有版本號改變才會清除舊快取，而一直看到舊版本：

- `index.html` / `CONTAINER_AI_WORKFLOW_SPA.html`
- `CONTAINER_AI_WORKFLOW_QUIZ.html`（測驗 SPA）
- `manifest.json`
- `icons/` 底下任何圖示

部署流程：改檔案 → 把 `sw.js` 的 `CACHE_NAME` 版本號 +1 → commit & push（`main` 分支已接上 GitHub Pages，push 後自動部署到 https://lolopodcast.github.io/container-ai-workflow/）。
