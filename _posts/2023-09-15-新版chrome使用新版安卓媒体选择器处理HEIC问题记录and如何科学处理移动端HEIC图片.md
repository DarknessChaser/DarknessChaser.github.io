---
layout:     post
title:      "新版chrome使用新版安卓媒体选择器处理HEIC问题记录and如何科学处理移动端HEIC图片"
subtitle:   ""
date:       2023-09-15
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - chrome HEIC bug
    - HEIC
---

## 问题

新版chrome在部分新版安卓（13及以上）灰度了新版图片选择器。可参考[https://www.androidcentral.com/apps-software/android-13-photo-picker-chrome-105](https://www.androidcentral.com/apps-software/android-13-photo-picker-chrome-105)

在此种模式下浏览器选择图片即使设置了accept为jpg+png，也可以选择heic。并且会将heic后缀改成accept中设置的格式，但是编码并没有真的设置。因此选择的图片浏览器无法解析。

## 浏览器选择图片总结

1. ios和macos Safari，设置accept为jpg+png，实际可以选择heic，并且浏览器接收的图片会正确的转换成accept中的格式。
2. 大部分传统chrome设置accept为jpg+png，默认heic不能选中。但是有上述问题的chrome可以选中但是转换错误，疑似chrome or 安卓bug
