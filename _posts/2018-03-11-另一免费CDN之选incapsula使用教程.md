---
layout:     post
title:      "另一免费CDN之选incapsula使用教程"
subtitle:   
date:       2018-03-11
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - 免费CDN
    - incapsula
---

## 前言
前两天介绍了可能是全球最好的免费CDN供应商cloudflare，在了解CDN的时候发现了早年和cloudflare齐名CDN供应商incapsula。然而中文资料很多都过时了，于是决定补充一篇现在**2018年3月11日**的使用incapsula教程。incapsula现在应该正处于转型期，请注意时间节点的不同可能会导致本教程完全失效。

## 注册
首先是打开[incapsula官方网站](https://www.incapsula.com/ "incapsula官方网站")。此时就会遇到第一个可能的坑，incapsula的官方网站有一个中文版，虽然从语言的角度上来讲这是个好事情……但是这个中文版官方是只为商业用户提供服务的！！！也就是说虽然这个中文网站并不是什么野鸡诈骗网站，然而并不能注册白嫖账号。

国际官网长这样，链接[https://www.incapsula.com/](https://www.incapsula.com/ "incapsula国际官网")
![国际官网](https://cl.ly/3v2n2K162l07/download/Image%202018-03-11%20at%201.18.12%20AM.png)
在右上角可以选择中文进入中文官网，链接[https://www.imperva-incapsula.cn/](https://www.imperva-incapsula.cn/ "incapsula中文官网")
![中文官网](https://cl.ly/2A2O1q1m1m1X/download/Image%202018-03-11%20at%201.24.35%20AM.png)
点击**询价&注册**后会直接跳到**企业计划**页面
![企业计划](https://cl.ly/3u1r012G2b2n/download/Image%202018-03-11%20at%201.32.33%20AM.png%20AM.png)
点击**开始您的免费试用**后会直接跳到**联系我们**页面
![联系我们](https://cl.ly/2T0z2f2T1R3g/download/Image%202018-03-11%20at%201.33.24%20AM.png)
网上有前辈试过了……好像第一个直接就是企业付费方案，第二个会说审核后给你的账号，教程最后也没说是否审核成功，很不靠谱的样子。估计incapsula中国和我一样的白嫖用户太多了，在积极拉拢付费用户吧。希望以后有机会支持一下付费计划吧。

回到国际官网，点击**Pricing & Sign Up**就会进入到一个说明付费方案的页面。共有
“ENTERPRISE”，“BUSINESS”和“PRO”三种方案，其中第一个ENTERPRISE方案应该就是中文站的那个，并没有传说中的FREE方案。
![方案介绍](https://cl.ly/173D433M193w/download/Image%202018-03-11%20at%201.46.36%20AM.png)

我本来以为incapsula已经取消了免费方案了，但在网上搜索一番发现incapsula官网的免费方案介绍并没有撤下，只不过是很久以前发布的了。于是抱着“既然没撤下，那么按照老美的商业道德应该还有白嫖方案”的心态，索性点击了PRO方案下的try it free，然后页面就跳转到了**账号注册**页面。
![账号注册页面](https://cl.ly/2H0I0z1B3C3W/download/Image%202018-03-11%20at%201.49.44%20AM.png)

这个页面比中文版的企业计划页面多出了`create password`选项，同意不用看就能注册一个新账号了。登陆后会要求绑定一张信用卡，因为我没有visa卡，以为不能用了就退出了。结果第二天登陆后发现其实没有绑卡也能用……
![切换方案](https://cl.ly/0S3d2n0w451Z/download/Image%202018-03-11%20at%202.00.20%20AM.png)

进入**management-subscription**页面，拉到最下面选择**free**再点击**change plan**就可以切换成free方案白嫖了（不过免费方案会有CDN加的广告）

## 网站接入
同cloudflare不同，incapsula并不托管DNS。先进入网站现有的DNS中设置通向ip的A记录，然后来到首页点击**add site**
![add site](https://cl.ly/350Y222g2b09/download/Image%202018-03-11%20at%202.05.56%20AM.png)

把刚才设置好的域名粘贴到输入框中，点击**add website**
![添加域名](https://cl.ly/1J0H060L230q/download/Image%202018-03-11%20at%202.08.36%20AM.png)

之后incapsula就会解析域名，完成后点击continue。
![解析域名](https://cl.ly/023z3Y3T3F3x/download/Image%202018-03-11%20at%202.16.49%20AM.png)

会返回一个incapsula的服务器域名，按照说明在DNS中添加一个canme记录指向这个域名点击**back to sites**
![返回托管域名](https://cl.ly/2Y1d1h2C2l1L/download/03-11-2-22.jpg)

DNS生效是需要时间的，耐心等待一下。如果没有托管成功会有一个黄三角加小感叹号，点开可以手动**check DNS**，忘记了返回的托管域名也可以在这里查看。
![手动检查](https://cl.ly/3u3t1h0v0Y02/download/Image%202018-03-11%20at%202.29.24%20AM.png)

托管成功后会改为绿色圆圈加对勾。
![正确标识](https://cl.ly/1C3u3t3J1a0k/download/Image%202018-03-11%20at%202.31.25%20AM.png)

此时网站就托管就成功啦！之前在网上查询到的结果是免费方案流量只有25G/月，不过一般情况下也够用了。免费版右下角有个贴片广告，据说老用户是可以关掉的新用户也就忍忍吧。
![贴片广告](https://cl.ly/2j3i0v0u3B0f/download/Image%202018-03-11%20at%202.38.54%20AM.png)

## 与couldflare速度对比
我的宽带是中国电信，每个人的网络情况各不相同，结果仅供参考。

- 延时

cloudflare的延时如图可以直连美西，约为167ms可以说是很不错的速度了。
![cloudflare延时图](https://cl.ly/1s2q1Z0Y3d3a/download/Image%202018-03-11%20at%202.44.27%20AM.png)
incapsula的延时如图，绕路欧洲延时约为375ms要差一些。
![incapsula延时图](https://cl.ly/0m2q2f240P3d/download/Image%202018-03-11%20at%202.48.16%20AM.png)

- 加载网页速度

通过chrome自带的性能测试工具简单测试一下打开速度，实际影响打开速度因素非常多本测试并没有太多参考价值。

cloudflare的加载速度如图约1200+ms。
![cloudflare加载](https://cl.ly/2R471A1S1n2e/download/Image%202018-03-11%20at%202.52.08%20AM.png)
incapsula的加载速度如图约1500+ms。
![incapsula加载](https://cl.ly/2q2p1N0d0M2b/download/Image%202018-03-11%20at%202.54.46%20AM.png)

- 结论
cloudflare可以说是当之无愧的免费CDN老大了，注册方便，速度更快，大部分情况下用它就对了。incapsula之前免费用户可以通过一些手段用到日本或者香港的CDN节点，现在似乎也不可以了，在注册难易程度和速度上率逊一筹。从官方的态度来讲盈利压力应该很大，对免费用户并不友好，但是毕竟不能用爱发电，CDN也是很费钱的服务。希望incapsula能早日在CDN界找到它自己的位置，有个美好的明天吧！（竞争才有白嫖用户浑水摸鱼的空间~