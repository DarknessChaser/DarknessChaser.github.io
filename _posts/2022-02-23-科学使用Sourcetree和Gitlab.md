---
layout:     post
title:      "科学使用Sourcetree和Gitlab"
subtitle:   ""
date:       2022-02-23
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - 科学使用
    - Gitlab
    - Sourcetree
---

# 起因
Sourcetree使用HTTPS访问公司Gitlab的时候总是无法正确验证token。经过实验是因为公司Gitlab禁止账号密码登录（GitHub 2021年年底应该也禁用了），因此需要使用SSH方式。

# 设置
Sourcetree SSH访问支持两种模式，一种是OpenSSH，另一种是PuTTY。建议使用OpenSSH，因为右下角不会单独开一个SSH工具的图标。参考文章[如何在 Windows 和 Linux 上将 .pem 文件与 .ppk 互相转换？](https://aws.amazon.com/cn/premiumsupport/knowledge-center/ec2-ppk-pem-conversion/ "如何在 Windows 和 Linux 上将 .pem 文件与 .ppk 互相转换？")

1. SSH方式链接并不需要使用Sourcetree内置的添加账号功能。
2. 先启动PuTTYgen，点击**生成**后在空白处乱动鼠标，并保存私钥（.ppk格式）和公钥。虽然推荐设置密码，但是使用的时候也要输入，图省事就不加了。
3. 用PuTTYgen先`转换-导入`导入.ppk格式私钥，然后`转换-导出OpenSSH密钥`导出.pem私钥。
4. 在Sourcetree`工具-选项-一般`中选择OpenSSH方式，并加载.pem格式私钥。
