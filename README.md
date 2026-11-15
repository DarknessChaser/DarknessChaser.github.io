# DarknessChaser.github.io

[漆黑菌的博客](https://darknesschaser.github.io) — 基于 [Astro](https://astro.build) + [Fuwari](https://github.com/saicaca/fuwari) 模板构建。

## 本地开发

```sh
pnpm install
pnpm dev        # 开发服务器
pnpm build      # 构建到 dist/（含 pagefind 搜索索引）
pnpm preview    # 预览构建产物
```

Node 版本由 Volta 固定在 22（见 package.json 的 `volta` 字段）。

## 目录结构

- `src/content/posts/YYYY/MM/DD/<slug>.md` — 文章。文件名路径即最终 URL：`/YYYY/MM/DD/<slug>/`，与旧 Jekyll 站完全一致（大小写、中文、标点均保留）
- `src/content/spec/about.md` — 关于页
- `src/config.ts` — 站点标题、导航、侧栏资料、主题色
- `public/img`、`public/images` — 文章图片（正文中以 `/img/...` 绝对路径引用）
- `public/portfolio/` — 照搬自旧站的 portfolio 静态页
- `scripts/migrate-posts.mjs` — 一次性迁移脚本（Jekyll → Astro，已执行完毕，留档备查）
- `scripts/audit-urls.mjs` — URL 对账脚本：对比 jekyll-legacy 分支与 dist 的全部文章 URL

## 写新文章

在 `src/content/posts/YYYY/MM/DD/` 下新建 Markdown，front-matter：

```yaml
---
title: 文章标题
published: 2026-01-01
description: 摘要（可选）
image: /img/post-bg.jpg（可选，文章封面）
tags: [标签1, 标签2]
---
```

或使用 `pnpm new-post <slug>` 生成草稿模板（放在 `src/content/posts/` 根目录，需自行移入日期目录以获得正确 URL）。

## 评论

[giscus](https://giscus.app)（GitHub Discussions）。在 `src/components/Comment.astro` 顶部填入 repo / repoId / categoryId 后自动启用。

## 部署

GitHub Actions（`.github/workflows/deploy.yml`）：push 到 `master` 自动构建并部署。
仓库 Settings → Pages → Source 需选择 **GitHub Actions**。

## 历史

旧 Jekyll 站（Hux Blog / BY Blog 模板）完整保留在 `jekyll-legacy` 分支。
