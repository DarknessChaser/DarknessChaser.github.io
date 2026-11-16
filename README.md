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
- `src/content/posts/YYYY/MM/DD/images/` — 该日期文章的配图，正文里用相对路径 `./images/xxx.jpg` 引用（构建时自动压缩、加 hash）
- `src/content/spec/about.md` — 关于页
- `src/config.ts` — 站点标题、导航、侧栏资料、主题色
- `src/assets/images` — 页面模板用到的图片（banner、头像），构建时走 Astro 图片优化
- `design/` — 备用设计素材，不参与构建，也不会出现在线上站点
- `public/favicon` — 明/暗两套 favicon，源图是旧站的「黑」字图标
- `scripts/migrate-posts.mjs` — 一次性迁移脚本（Jekyll → Astro，已执行完毕，留档备查）
- `scripts/audit-urls.mjs` — URL 对账脚本：对比 jekyll-legacy 分支与 dist 的全部文章 URL

## 写新文章

在 `src/content/posts/YYYY/MM/DD/` 下新建 Markdown，front-matter：

```yaml
---
title: 文章标题
published: 2026-01-01
description: 摘要（可选）
tags: [标签1, 标签2]
category: 技术文档
---
```

配图放在同目录的 `images/` 下，正文用相对路径引用：

```md
![截图](./images/screenshot.png)
```

或使用 `pnpm new-post <slug>` 生成草稿模板（放在 `src/content/posts/` 根目录，需自行移入日期目录以获得正确 URL）。

## 评论

[giscus](https://giscus.app)（GitHub Discussions）。在 `src/components/Comment.astro` 顶部填入 repo / repoId / categoryId 后自动启用。

## 部署

GitHub Actions（`.github/workflows/deploy.yml`）：push 到 `master` 自动构建并部署。
仓库 Settings → Pages → Source 需选择 **GitHub Actions**。

## 历史

旧 Jekyll 站（Hux Blog / BY Blog 模板）完整保留在 `jekyll-legacy` 分支。
