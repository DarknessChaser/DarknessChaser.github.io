---
layout:     post
title:      "Windows下使用git的换行符f问题"
subtitle:   ""
date:       2019-10-09
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog:    true
tags:
    - Git
    - Windows
    - AutoCRLF
    - SafeCRLF
    - 换行符
---

## 简介
Git系统本来是运行在Unix上的，所以默认存储的的换行符为LF，但是Windows的换行符是CRLF。在Windows上git有个自动转换的功能在提交的时候转换为LF，检出的时候转换为CRLF.然而在中文环境下有bug检出的时候会LF转CRLF，但是提交的时候不会转换为LF，还是不要开比较好。

## 相关配置
#### AutoCRLF
#提交时转换为LF，检出时转换为CRLF
git config --global core.autocrlf true

#提交时转换为LF，检出时不转换
git config --global core.autocrlf input

#提交检出均不转换
git config --global core.autocrlf false

#### SafeCRLF

#拒绝提交包含混合换行符的文件
git config --global core.safecrlf true

#允许提交包含混合换行符的文件
git config --global core.safecrlf false

#提交包含混合换行符的文件时给出警告
git config --global core.safecrlf warn

#### 自己的Windows默认设置
```
    #提交时转换为LF，检出时不转换
    git config --global core.autocrlf input

    #提交包含混合换行符的文件时给出警告
    git config --global core.safecrlf warn
```