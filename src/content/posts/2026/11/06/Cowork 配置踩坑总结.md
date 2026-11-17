---
title: "Cowork 配置踩坑总结"
description: "Claude Desktop Cowork 插件与 MCP 连接的排查思路"
published: 2026-11-06
category: "技术文档"
tags: ["Cowork"]
---
Claude Desktop Cowork （3P 模式）插件/MCP 配置：

1. Cowork 里插件和 MCP 是两层：插件声明依赖，连接器（Managed Connectors）负责实际连接和授权。插件装好 ≠ 工具可用，Not added 只是"没连上"，不要重装插件。
2. 排查时先分清：是网络（egress 拦截，到 Capabilities 配 Allowed egress hosts）、认证（OAuth / API key），还是根本没建连接器，不要混成一个问题。
3. 远程服务优先配 Managed 原生 HTTP；本地程序用本地 stdio。
