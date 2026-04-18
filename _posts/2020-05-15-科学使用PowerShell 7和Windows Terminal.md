---
layout:     post
title:      "科学使用PowerShell和Windows Terminal"
subtitle:   ""
date:       2020-05-15
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - 科学使用
    - PowerShell
    - Windows Terminal
    - 更新PowerShell
    - 配置Windows Terminal主题
---

# 安装Windows Terminal和PowerShell

先贴官方文档

1. [Windows Terminal](https://github.com/microsoft/terminal "microsoft/terminal: The new Windows Terminal and the original Windows console host, all in the same place!")
2. [PowerShell在GitHub](https://github.com/PowerShell/PowerShell "PowerShell/PowerShell: PowerShell for every system!")
3. [PowerShell在Microsoft Docs](https://docs.microsoft.com/zh-cn/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-7 "在 Windows 上安装 PowerShell")

推荐的安装方式

1. Windows Terminal通过Microsoft Store [https://aka.ms/windowsterminal](https://aka.ms/windowsterminal)
2. PowerShell通过GitHub releases [https://github.com/PowerShell/PowerShell/releases](https://github.com/PowerShell/PowerShell/releases)

# 更新PowerShell

PowerShell 其实可以分成两个版本。一个是 Windows 自带的 PowerShell 5.x，这个版本会跟着 Windows 更新走；另一个是我们单独下载的 PowerShell 6+，两者可以共存。所以此处的“更新 PowerShell”特指更新 PowerShell 6+。

经过实验，不同大版本的 PowerShell 之间也是可以共存的。比如我之前安装的是 PowerShell 7-preview，安装 PowerShell 7 后两者会共存，所以我后来手动卸载了 PowerShell 7-preview。

因为我安装时选择了把 PowerShell 添加到鼠标右键菜单，而 7-preview 和 7 又是可以共存的，此时鼠标右键菜单里就会有三个 PowerShell 的启动链接（别忘了 Windows 自带的 5.x 版本），而且卸载时这些菜单项不会自动删除，所以还要单独进注册表里删一下。

1. 使用Windows自带的卸载工具卸载，**设置——应用**或者**开始菜单找到PowerShell右键卸载**都可以
2. win键+R运行regedit，在注册表编辑器中搜索要删除的版本，如`PowerShell7-previewx64`，然后删除之（怕翻车的话建议备份一下注册表）

# 配置Windows Terminal主题

主要知乎参考文章[https://zhuanlan.zhihu.com/p/139189289](https://zhuanlan.zhihu.com/p/139189289 "Windows10 安装最新版 PowerShell 及 Windows Terminal 并美化")

现在版本的 PowerShell 设置还没有 GUI，打开后就是一个 JSON 文件。文章中推荐了一个 repo：`mbadolato/iTerm2-Color-Schemes`，其中有现成的 Windows Terminal 可用主题配色：[https://github.com/mbadolato/iTerm2-Color-Schemes/tree/master/windowsterminal](https://github.com/mbadolato/iTerm2-Color-Schemes/tree/master/windowsterminal "Windows Terminal配色")

找一个自己喜欢的主题，放到`setting.json`里的`schemes`数组中，注意单独的颜色配置是一个对象。然后找到`profiles-defaults-colorScheme`，把刚配置好的`schemes`里的`name`属性写进去并保存，就可以给全部命令行配置上默认主题了。

我 VS Code 用的主题是**DimmedMonokai**，Windows Terminal 也打算用这个，配置结果如下（仅供参考）。

```JSON
        "defaults": {
            // Put settings here that you want to apply to all profiles.
            "colorScheme": "DimmedMonokai"
        },
```

```JSON
    "schemes": [
        {
            "name": "DimmedMonokai",
            "black": "#3a3d43",
            "red": "#be3f48",
            "green": "#879a3b",
            "yellow": "#c5a635",
            "blue": "#4f76a1",
            "purple": "#855c8d",
            "cyan": "#578fa4",
            "white": "#b9bcba",
            "brightBlack": "#888987",
            "brightRed": "#fb001f",
            "brightGreen": "#0f722f",
            "brightYellow": "#c47033",
            "brightBlue": "#186de3",
            "brightPurple": "#fb0067",
            "brightCyan": "#2e706d",
            "brightWhite": "#fdffb9",
            "background": "#1f1f1f",
            "foreground": "#b9bcba"
        }
    ],
```

# 一份Windows Terminal配置

注意使用的时候要先和原先的配置对比一下，并留意注释；比如`profiles.list`在不同机器上就不一样。

```JSON
{
    "$help": "https://aka.ms/terminal-documentation",
    "$schema": "https://aka.ms/terminal-profiles-schema",
    "actions": [
        {
            "command": "paste",
            "keys": "ctrl+v"
        },
        {
            "command": {
                "action": "copy",
                "singleLine": false
            },
            "keys": "ctrl+c"
        },
        {
            "command": "find",
            "keys": "ctrl+shift+f"
        },
        {
            "command": {
                "action": "splitPane",
                "split": "auto",
                "splitMode": "duplicate"
            },
            "keys": "alt+shift+d"
        }
    ],
    "alwaysShowNotificationIcon": true,
    "copyFormatting": "none",
    "copyOnSelect": true,
    // "defaultProfile": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
    "firstWindowPreference": "persistedWindowLayout",
    "focusFollowMouse": true,
    "launchMode": "default",
    "profiles": {
        "defaults": {
            // "colorScheme": "DimmedMonokai"
        },
        "list": [
            // 不同机器应该不一样，注意要和defaultProfile配合
        ]
    },
    "schemes": [
        // 想用DimmedMonokai请看上面，默认的应该也不用覆盖
    ],
    "showTabsInTitlebar": true,
    "tabSwitcherMode": "inOrder",
    "useAcrylicInTabRow": false,
    "windowingBehavior": "useExisting"
}
```

# 创建一个administrator权限的power shell

直接复制一份 PowerShell 配置后，在配置文件中启用**以管理员身份运行此配置文件**，也可以顺手改个名称，比如**Admin PowerShell**，方便区分。
