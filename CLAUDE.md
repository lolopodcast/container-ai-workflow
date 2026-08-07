# Container 專案筆記

## PWA 快取版本號 — 每次改動需精快取的檔案都要記得升版

`sw.js` 目前的 `CACHE_NAME` 是 **`caiw-shell-v16`**（2026-08-07 因 M7 引言色塊縮短、零成本偵測改為要點區塊升版（全教材段落已無超標））。

只要修改了以下任一被 service worker 預先快取（`APP_SHELL`）的檔案，就必須把 `sw.js` 裡的 `CACHE_NAME` 版本號往上加一（`v1` → `v2`），否則已經造訪過的使用者會因為快取策略是 stale-while-revalidate、且只有版本號改變才會清除舊快取，而一直看到舊版本：

- `index.html` / `CONTAINER_AI_WORKFLOW_SPA.html`
- `CONTAINER_AI_WORKFLOW_QUIZ.html`（測驗 SPA）
- `manifest.json`
- `icons/` 底下任何圖示

部署流程：改檔案 → 把 `sw.js` 的 `CACHE_NAME` 版本號 +1 → commit & push（`main` 分支已接上 GitHub Pages，push 後自動部署到 https://lolopodcast.github.io/container-ai-workflow/）。
