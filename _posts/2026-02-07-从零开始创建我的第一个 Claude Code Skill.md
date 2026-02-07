---
layout:     post
title:      "从零开始创建我的第一个 Claude Code Skill"
subtitle:   "一行代码没手写，全程用 Claude Code 开发 Claude Code 的扩展——一次有趣的"套娃"体验。"
date:       2026-02-07
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - Claude Code
    - Skill
---

## 起因：我到底给 Anthropic 送了多少钱？

用了一段时间 Claude Code 之后，我产生了一个朴素的好奇：这东西按 token 计费，我每天和它聊这么多，到底花了多少钱？

Claude Code 本身并没有提供一个直观的费用面板。虽然可以去 Anthropic 后台看账单，但是似乎只有管理员权限才能看到，我是没有的。于是想要试试能不能根据一些信息推测出账单来。

既然 Claude Code 支持通过 Skill 来扩展功能，那不如自己做一个——顺便也学学 Skill 到底是怎么回事。

## 什么是 Claude Code Skill？

如果你刚开始用 Claude Code，可能还没接触过 Skill 这个概念。简单来说：

**Skill 是一份 Markdown 文档，告诉 Claude 在特定场景下应该怎么做。**

它不是传统意义上的"插件"或"代码包"，更像是一份结构化的指令手册。一个 Skill 通常包含：

- **SKILL.md** — 核心文件，用 YAML front matter 定义元数据（名称、描述、可用工具等），正文部分是给 Claude 的详细指令
- **scripts/** — 可选的脚本文件，Claude 会按照 SKILL.md 中的指令来调用它们
- **references/** — 可选的参考资料，供 Claude 在执行任务时查阅

用户在对话中输入 `/skill-name` 就可以触发一个 Skill。触发后，Claude 会读取 SKILL.md 的内容，按照里面的指令来完成任务。

这和 Plugin 有什么区别？Plugin 更重一些，有自己的安装体系，一般通过命令来安装和管理。而 Skill 非常轻量——本质上就是 prompt engineering，把文件放到指定目录下就能用。理解这个区别，是我踩的第一个坑。

## 第一次尝试：踩进 Skill 与 Plugin 的坑

有了想法之后，我的第一反应是：直接让 Claude Code 帮我写。

我对它说："帮我创建一个 Claude Code Skill，用来统计 API 使用费用。"听起来很合理吧？然而 Claude 给我生成的整个项目结构是按照 Plugin 的方式组织的，完全不是 Skill 的样子。

问题出在哪？**Claude 自己也分不清 Skill 和 Plugin。** 这两个概念在 Claude Code 的生态里确实容易混淆，尤其是当时 Skill 还是比较新的功能，Claude 的训练数据里相关内容不多。它按照自己对"扩展"的理解，默认走了 Plugin 那条更重的路。

这给我上了第一课：**当 Claude 对某个领域的知识不够准确时，你需要先自己搞清楚概念，再引导它。**

## 发现 Skill Creator——以及新的问题

既然直接让 Claude 写不靠谱，我就去找有没有什么辅助工具。很快发现 Anthropic 官方提供了一个叫 **Skill Creator** 的 Skill——没错，是一个"用来创建 Skill 的 Skill"。

这看起来是正道。但在尝试安装的过程中，我遇到了新的问题：

我一开始以为 Skill Creator 可以像 Skill 本身一样轻量地单独安装，找了半天也没找到直接安装的方法。后来才意识到，Skill Creator 是 Anthropic 官方 Plugin （`example-skills`）的一部分，它只是 Plugin 的一个附属 Skill。**你不能单独安装 Skill Creator，必须先装整个 Plugin。**

这让我意识到：虽然 Skill 本身很轻量，但官方提供的 Skill 工具却依赖于 Plugin 体系。有点绕，但搞清楚之后，安装好 Plugin，Skill Creator 就可以用了。

有了 Skill Creator 的辅助，我终于理解了一个 Skill 的正确结构该是什么样的。

## 真正动手：一小时搞定核心功能

搞清楚 Skill 的结构之后，真正的开发反而很快。

我的思路很简单：Claude Code 会在本地缓存使用数据（`~/.claude/stats-cache.json`），里面记录了每次会话的 token 消耗和模型信息。只要写一个 Python 脚本去解析这个文件，再乘以各模型的单价，就能算出费用。

整个过程完全交给 Claude Code 来完成，我自己一行代码都没写。具体步骤：

1. **让 Claude Code 写 Python 脚本** — 读取缓存文件，按天、按模型汇总 token 用量，乘以单价算出费用
2. **创建 SKILL.md** — 定义 Skill 的元数据和调用指令，告诉 Claude 在用户输入 `/cost-report` 时应该执行这个脚本
3. **准备定价数据** — 把各模型的 API 单价整理成一个 JSON 文件，方便后续更新

大约一个小时，基础功能就跑通了：输入 `/cost-report`，就能看到最近的费用汇总、每天的花费明细、各模型的用量占比。

这里有一个很有意思的体验：**我在用 Claude Code 开发一个分析 Claude Code 费用的工具。** 整个过程本身也在产生费用，而这些费用最终会出现在我自己工具的报告里。这种"套娃"感还挺有趣的。

## 分发难题：当标准方式不适用时

功能做好之后，下一个问题是：怎么让别人也能用？

如果只是自己用，把文件丢进 `~/.claude/` 目录就行了。但如果要分享给团队，就需要考虑分发方式。

标准的 Skill 分发依赖于 Plugin 体系——把 Skill 作为 Plugin 的一部分来安装。但在公司内部环境下，这条路走起来不太顺畅。于是我选择了一种更朴素的方式：

- 用 **Git 仓库**托管代码
- 写一个 **install.sh 安装脚本**，自动把文件复制到正确的目录
- 配套一个 **uninstall.sh** 用于卸载

这意味着项目的目录结构不能完全按照标准的 Skill 规范来组织——需要额外的安装脚本、README、以及一个和安装后目录不同的源码结构。我为此做了好几次目录调整，才找到一个既方便开发又方便安装的布局。

这个过程花的时间比写功能本身还多。基础功能一小时搞定，而分发方案的设计和反复调整，前前后后花了一个晚上。

## 最终成果

最终的 cost-report Skill 支持这些功能：

- **基础报告** — 查看指定天数内的费用汇总和每日明细
- **模型维度分析** — 按模型拆分费用，看看是 Opus 还是 Sonnet 更烧钱
- **Top N 排行** — 找出花费最多的几天
- **CSV 导出** — 把数据导出来做进一步分析
- **定价管理** — 查看和更新模型单价，避免因为价格调整导致计算偏差

用起来就是一句 `/cost-report`，Claude 会自动运行脚本然后把结果格式化输出。整个 Skill 的核心就是一个 Python 脚本加一个定价 JSON 文件，非常轻量。

## 经验总结：我希望早点知道的事

回顾整个过程，有几条经验值得分享：

**1. 先搞清楚 Skill 和 Plugin 的区别**

这是最关键的一点。Skill 是 Markdown 驱动的轻量指令，Plugin 是有完整安装体系的重量级扩展。如果你只是想让 Claude 按照特定方式完成某类任务，Skill 就够了。

**2. 安装 Skill Creator 来辅助开发**

不要从零开始摸索 SKILL.md 的写法。先装好官方的 `example-skills` Plugin，用里面的 Skill Creator 来生成项目骨架，效率会高很多。

**3. Claude 不是全知的，新特性需要你来引导**

对于 Skill 这样比较新的功能，Claude 的知识可能不够准确。先自己阅读官方文档，理解核心概念，再让 Claude 在你的引导下干活。人负责方向，AI 负责执行。

**4. 用 Claude Code 开发 Skill 是最好的学习方式**

虽然一开始 Claude 会搞混概念，但一旦你搞清楚了结构，后续的编码、调试、重构都可以交给它。这种"用工具开发工具的扩展"的体验，本身就是理解这个生态最好的方式。
