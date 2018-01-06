---
layout:     post
title:      "网上回国——Windows搭建ShadowsocksR服务端"
subtitle:   
date:       2018-01-06
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - 网上回国
    - ShadowsocksR
---

## 前言
现在大陆有很多价格低廉的网络服务是很方便的，但是这其中有很多是大陆地区限定的，如果你出境就不能享受这些低价服务啦。本文就是为了造福有这种需求的小伙伴们的。

## 技术原理
说白了就是在大陆搭建一台服务器，你通过这个服务器访问大陆的各种服务，然后这些服务商就以为你是在大陆了。本文主要参考了[GitHub@逗比](https://doub.bid/ss-jc45/ "Windows系统 安装运行 ShadowsocksR服务端 简单教程")和[CSDN@wyvbboy](http://blog.csdn.net/wyvbboy/article/details/52540658 "windows 下搭建shadowsocks 服务端")两位的大作。

### 位于大陆的服务器
这个就要用到这几年非常火爆的“云服务”的概念了，这个可以去网上搜，一搜一大把相关的文章，我也就不瞎BB了。因为我原本就有一台阿里云的主机，所以这次主要就是用它搞点小实验，在此就不多说了。现在国内买云服务器应该都是需要实名认证的，不要用来干什么违法乱纪的事情（笑😀，记得买的时候主意一下带宽和独立IP，其他的配置可以稍微差一点，不要紧的。带宽事关你的上网速度，可以参考国内办网时候的感受，自行选择，一般看个视频什么的有个10兆的网差不多了。各位Linux大手子可以选择Linux，考虑到国情大部分人应该都是用Windows系统比较多，我当时选系统时就选择了Windows server 2008。这样方便一些，直接用Windows系统自带的远程桌面就能访问并管理。此时需要注意一下是多少位的系统是32位还是64位。个人经验是内存大于4G务必选择64位系统。后面会有一系列操作，让你设置（记不住就截个图，主意保存好。
  
### 访问服务器
1. 找到自己的服务器在哪，点进去。  
![阿里云云服务器控制台](https://cl.ly/2c0L2N1V1b1k/download/%E9%98%BF%E9%87%8C%E4%BA%91%E4%BA%91%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%8E%A7%E5%88%B6%E5%8F%B0.jpg)  
2. 根据图找到你的公网IP地址，复制下来。  
![阿里云云服务器控制台 - 详情](https://cl.ly/1W160V111l3A/download/%E9%98%BF%E9%87%8C%E4%BA%91%E4%BA%91%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%8E%A7%E5%88%B6%E5%8F%B0%20-%20%E8%AF%A6%E6%83%85.jpg)
3. win+R调出运行，输入mstsc，打开远程桌面，输入你的云服务器的ip地址和账号密码，点击连接，如果没有问题的话，你就能看到熟悉又陌生的桌面啦。  
![远程桌面](https://cl.ly/0z2K1v01471u/download/%E8%BF%9C%E7%A8%8B%E6%A1%8C%E9%9D%A2.jpg)
4. Windows真的是小白福音，这个远程桌面会共享本地机和远程机的粘贴板，然后我们就可以利用这个复制一些文件进去。服务器自带的祖传IE十分不好使唤，建议弄个火狐浏览器扔进去。

### 安装ShadowsocksR需要的基础环境  
这里主要参考了[GitHub@逗比](https://doub.bid/ss-jc45/ "Windows系统 安装运行 ShadowsocksR服务端 简单教程")的大作。通俗地说运行ShadowsocksR需要Python和OpenSSL两个基础环境。

#### 安装Python
打开[ Python官网-下载页面 ](https://www.python.org/downloads/windows/ "Python官网-下载页面")，找到 **Python 2.7.xx – xxxx-xx-xx** ，然后根据你的 Windows操作系统位数 下载对应的安装包：
 
- Download Windows x86 MSI installer（32位下载这个）
- Download Windows x86-64 MSI installer（64位下载这个）

#### 安装OpenSSL 
打开[ OpenSSL官网-下载页面](https://slproweb.com/products/Win32OpenSSL.html " OpenSSL官网-下载页面")，翻到网页中间，然后根据你的 Windows操作系统位数 下载对应的安装包：

- Win32 OpenSSL v1.x.xx Light（32位下载这个）
- Win64 OpenSSL v1.x.xx Light（64位下载这个）

> 注意是那个 3MB 左右大小的文件，30MB 左右的是开发者用的。

#### 设置环境变量
**开始菜单 — 控制面板 — 系统 — 高级系统设置 — 高级 选项卡 — 环境变量 按钮 — 系统变量 Path**变量值应该会有Python和OpenSSL两部分，`C:\Python27\;C:\Python27\Scripts;C:\OpenSSL-Win64\bin\;`我用的是默认的安装目录，注意OpenSSL是区分
32和64位的。 

#### 环境变量检测 
1. 配置完成以后**开始菜单 —— 运行 —— 输入 CMD 并回车**调出**CMD**.
2. 输入`Python -V`检查Python的配置是否正确，如果正确会输出python的版本信息。
3. 输入`openssl`，如果正确的话会出现
> C:\Users\Administrator>openssl  
> OpenSSL>  

然后继续输入`help`命令并回车，就会出来一大堆的说明。  
4. 理论上安装openSSL后会自动添加环境变量`OPENSSL_CONF`，我的是`C:\OpenSSL-Win64\bin\openssl.cfg`，仅供参考。

#### 搭建ShadowsocksR服务端
安装和配置，展开说又是一大堆，具体请上网搜索了，在这里提供下ShadowsocksR最新服务端文件下载地址：[Github项目地址](https://github.com/ToyoDAdoubi/shadowsocksr "Github项目地址")、[https://github.com/ToyoDAdoubi/shadowsocksr/archive/manyuser.zip](https://github.com/ToyoDAdoubi/shadowsocksr/archive/manyuser.zip "Github下载地址")
> 注意：为了避免出错或不兼容，Python/OpenSSL/ShadowsocksR服务端都不要安装在 目录包含中文字符和特殊字符的文件夹中！

#### 启动ShadowsocksR服务端
依然打开**CMD**，这是我的命令仅供参考，记得根据自己的情况做出替换。
`C:\shadowsocksr\shadowsocks\server.py -c C:\shadowsocksr\user-config.json`  
如果没有问题的话就会出现这样的内容了
> C:\shadowsocksr\shadowsocks\server.py -c C:\shadowsocksr\user-config.json
> loaded collections.OrderedDict
> IPv6 support
> INFO: loading config from D:\shadowsocksr-manyuser\shadowsocks\../shadowsocks\../user-config.json
> 2017-02-09 18:34:29 INFO     util.py:85 loading libcrypto from D:\OpenSSL-Win32\bin\libcrypto.dll
> 2017-02-09 18:34:29 INFO     shell.py:80 ShadowsocksR 3.0.2 2017-01-08
> 2017-02-09 18:34:29 INFO     asyncdns.py:324 dns server: [('8.8.4.4', 53), ('8.8.8.8', 53)]
> 2017-02-09 18:34:29 INFO     server.py:106 server start with protocol[auth_aes128_md5] password [m] method [aes-128-ctr] obfs [tls1.2_ticket_auth_compatible] obfs_param []
> 2017-02-09 18:34:29 INFO     server.py:122 starting server at [::]:8388
> 2017-02-09 18:34:29 INFO     server.py:142 starting server at 0.0.0.0:8388

#### 大概率出现的bug
运行报错
> libcrypto(OpenSSL) not found

字面意思上理解是OpenSSL的一个依赖库没找见，实际上很有可能是因为没有做兼容，64位版本的**dll**命名不一样，没有正确识别。  
打开OpenSSL的安装目录把`libcrypto-1_1-x64.dll`和`libssl-1_1-x64.dll`分别复制并重命名为`libcrypto.dll`和`libssl.dll`，然后打开`bin`文件夹，对里面的`libcrypto-1_1-x64.dll`和`libssl-1_1-x64.dll`重复以上操作。这样程序就能找到正确的**dll**啦！

#### 隐藏CMD窗口
想偷偷挂在服务器上静默运行怎么办？我来告诉你。这部分主要参考了[CSDN@wyvbboy](http://blog.csdn.net/wyvbboy/article/details/52540658 "windows 下搭建shadowsocks 服务端")的内容。  
1. 先写个bat批处理文件,把以下内容写进去。
> 
@echo off  
C:\shadowsocksr\shadowsocks\server.py -c C:\shadowsocksr\user-config.json

我选择放在了C盘根目录命名为`ssrRun.bat`。  
2. 再写个vbs脚本文件,把以下内容写进去。
> Set ws = CreateObject("Wscript.Shell")  
> ws.run "cmd /c C:\ssrRun.bat",vbhide  

如果和我一样需要开机自启动的话，扔到开始菜单里面的`启动`文件夹里。**注意**里面要对应之前bat文件的目录。

## 结语
写点东西真是累，我整个配置完成大概也就用了半个多小时，写这个用了好几个小时。。。写文档也是个技术活+体力活呀。