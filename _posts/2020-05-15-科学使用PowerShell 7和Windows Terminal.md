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
PowerShell其实可以分成两个版本，一个Windows自带的PowerShell 5.x版本这个更新是跟着Windows更新走的，而且可以和我们下载的PowerShell 6+共存，所以此处的更新PowerShell特指更新PowerShell 6+。

经过实验大版本不同的PowerShell之间也是可以共存的，比如我之前安装的是PowerShell 7-preview，安装PowerShell 7后两者会共存。所以当我手动卸载PowerShell 7-preview。

因为我安装的时候选择了添加PowerShell到鼠标右键菜单，然后7-preview和7是可以共存的，此时鼠标右键菜单里就有三个PowerShell的启动链接（别忘了Windows自带的5.x版本），而且删除的时候不会跟着自动删除！所以要单独进注册表里删一下。

1. 使用Windows自带的卸载工具卸载，**设置——应用**或者**开始菜单找到PowerShell右键卸载**都可以
2. win键+R运行regedit，在注册表编辑器中搜索要删除的版本如`PowerShell7-previewx64`删除之（怕翻车的话建议备份一下注册表

# 配置Windows Terminal主题
主要知乎参考文章[https://zhuanlan.zhihu.com/p/139189289](https://zhuanlan.zhihu.com/p/139189289 "Windows10 安装最新版 PowerShell 及 Windows Terminal 并美化")

现在版本的PowerShell设置还没有GUI，打开就是一个JSON文件。文章中推荐了一个repo `mbadolato/iTerm2-Color-Schemes`中有现成的Windows Terminal可用的主题配色[https://github.com/mbadolato/iTerm2-Color-Schemes/tree/master/windowsterminal](https://github.com/mbadolato/iTerm2-Color-Schemes/tree/master/windowsterminal "Windows Terminal配色")

找一个自己喜欢的放到`setting.json`下的`schemes`数组里，注意单独的颜色配置是个对象。然后找到`profiles-defaults-colorScheme`，把配置好的`schemes`的`name`属性写进去保存，就可以给全部命令行配置上默认主题啦。

我vs code用的主题是**DimmedMonokai**，Windows Terminal也打算用这个，配置结果如下（仅供参考）

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
注意使用的时候和原先对比一下并注意注释，比如profiles.list不同的机器就不一样
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
    "useAcrylicInTabRow": true,
    "windowingBehavior": "useExisting"
}
```
