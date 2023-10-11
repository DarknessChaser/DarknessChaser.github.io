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

在此种模式下浏览器选择图片即使设置了accept为jpeg+png，也可以选择heic。并且会将heic后缀改成accept中设置的格式，但是编码并没有真的设置。因此选择的图片浏览器无法解析。

目前来看没啥办法，也许可以在预览图这层做些提示。

## 注意

在设置accept时请同时设置jpg和jpeg，只设置一种有时会导致奇怪的跨平台问题

## 浏览器选择图片行为记录

#### 设置可接受文件类型为image/*

###### Safari

1. iOS 可以选heic，heic会转换成jpg
2. macOS 可以选heic，heic会原样上传

###### chrome

1. macOS 不能选择heic
2. android 可以选heic，heic会原样上传
3. Windows10&11 不能选择heic

###### Firefox

1. macOS 不能选择heic
2. Windows10&11 不能选择heic

#### 设置可接受文件类型为jpeg+png

###### Safari

1. iOS 可以选heic，heic会转换成jpg
2. macOS 不可以选heic

###### chrome

1. macOS 不能选择heic
2. android 不能选择heic
3. Windows10&11 不能选择heic

###### Firefox

1. macOS 不能选择heic
2. Windows10&11 不能选择heic

#### 设置可接受文件类型为heic

###### Safari

1. iOS 可以选heic，heic会转换成jpg
2. macOS 可以选heic，heic会原样上传

###### chrome

1. macOS 可以选heic，heic会原样上传
2. android 可以选heic，heic会原样上传
3. Windows10&11 可以选heic，heic会原样上传

###### Firefox

1. macOS 可以选heic，heic会原样上传
2. Windows10&11 可以选heic，heic会原样上传

## 浏览器选择图片行为总结

1. iOS上的Safari，无论是否设置接受heic，目前都可以选择heic图片，都会转换成通用格式。因此可以考虑设置成只接受通用格式。
2. macOS上的Safari和android上的Chrome，*包含heic，选择按照设置进行，并且上传时不会进行转换。因此可以考虑设置成只接受通用格式。
3. macOS和Windows10&11上的Chrome和Firefox，*不包含heic，选择按照设置进行，并且上传时不会进行转换。因此可以考虑设置成只接受通用格式。
4. 实操中安卓chrome和Windows平台，文件选择器可以绕开accept。建议上传时拦一层。
