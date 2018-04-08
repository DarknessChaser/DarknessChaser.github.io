---
layout:     post
title:      "Let's HTTPS！新手入门caddy+tomcat实现HTTPS建站"
subtitle:   
date:       2018-04-03
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - caddy
    - tomcat
    - https
    - letsencrypt
    - nginx
---

## 前言
记录一波新手配置HTTPS极简建站历程，HTTPS可以进行加密传输，更好的保证传输数据不被他人窃取。

## 关于HTTPS你需要知道的
太长不看系列：HPPTS=HTTP+TLS/SSL

想要详细了解系列：

1.  什么是 http 和 https
2.  https 的工作原理
3.  https 的安全性是如何保证的，有没有什么单点故障

对于 https 的了解，大致需要了解：

1.  TLS/SSL 协议是什么
2.  证书和根证书
3.  对称加密算法和非对称加密算法工作原理

### 获得域名
证书似乎是和域名绑定的所以首先要有个域名。

- 国内域名可以上阿里云买，不过要主意国内的监管规则，做好实名认证之类的。
- 不想实名认证，可以在国外买[namecheap](https://www.namecheap.com/ "namecheap")和[godaddy](https://www.godaddy.com/ "godaddy")都是不错的选择。
- 不想花钱可以去白嫖域名，参见我之前写的[新手练习建站神器-免费域名+免费CDN](/2018/03/02/新手练习建站神器-免费域名+免费CDN/ "新手练习建站神器-免费域名+免费CDN")去[freenom](http://www.freenom.com "freenom")获得免费域名。

### 获得证书
了解了前面的信息之后，就可以知道，想要个人网站使用HTTPS的方式来访问，就要获得有效的安全证书。
- 国内可以上阿里云，企鹅云买，似乎也有些免费试用，详情可以上网搜索。
- 国外可以上cloudflare，诺顿之类的买，也有免费试用可以白嫖，详情可以上网搜索。
- 不想花钱还省事可以选择**Let's Encrypt** 获得免费证书，这里是他的官网：[Let's Encrypt官方网站](https://letsencrypt.org/)三个月一续，GitHub也有自动化机器人很好用项目地址[certbot](https://github.com/certbot/certbot "certbot")自动化程度看简介非常高基本已经是无忧托管了。

### 为什么要用caddy呢？
标题里就有的关键字到现在都没出来可还行，来简单的介绍一下caddy。[caddyserver官方网站](https://caddyserver.com/ "caddyserver")和[caddyserver官方文档](https://caddyserver.com/docs "caddyserver官方文档")，官方的口号是**EVERY site on HTTPS**所以我认为这个服务器最牛逼之处在于扣脚部署HTTPS前置服务器，而且还有toyo的一键扣脚脚本[doub脚本+中文快速入门](https://doub.io/jzzy-2/ "doub脚本+中文快速入门")嫌麻烦可以用下边代码一键真扣脚。

>wget -N --no-check-certificate https://raw.githubusercontent.com/pipesocks/install/master/caddy_install.sh && chmod +x caddy_install.sh && bash caddy_install.sh uninstall

用上面的脚本安装的caddy在`/usr/local/caddy`目录下，配置文件叫`Caddyfile`安装后应该没有自带需要自己创建。安装完成后就会自动注册service服务，所以可以直接用如下指令来启动，停止和重启。

> service caddy start
> 
> service caddy stop
> 
> service caddy restart

### 如何食用caddy
caddy要实现的功能

1. HTTPS证书的托管
2. HTTP流量重定向到HTTPS
3. 作为tomcat（容器）的前置代理

PS：caddy要实现的功能其实和nginx是类似的，可以看作一个自带certbot的nginx，所以很多用法可以参考nginx的教程。


#### HTTPS证书的托管
所谓HTTPS证书也就是TLS证书，详情可以参阅[TLS官方文档](https://caddyserver.com/docs/tls "TLS官方文档")这里简单介绍一下

1. 不使用HTTPS证书托管（那你还用个锤子caddy
> tls off

2. 提供一个邮箱地址一键扣脚托管
> tls email

3. 自己提供证书，分别输入对应的cert和key文件路径就行了
> tls cert key

4. 自签骗人证书，开发的时候自己玩玩就行了，浏览器会标注不安全的
> tls self_signed

5. 还有个高级模式请自行参阅文档

#### HTTP流量重定向到HTTPS
利用[redir官方文档](https://caddyserver.com/docs/redir "redir官方文档")功能把HTTP流量重定向到HTTPS上。

> http://你的域名 {
> 
>  redir https://你的域名{url}
>  
> }

配置完了重启即可。

#### 作为tomcat（容器）的前置代理
我只配过tomcat其他的容器可以参考对应容器的nginx配法研究。原理上，就是要让tomcat意识到自己只是个容器，在他前面还有个前置代理。

##### caddy侧
详情可参阅[proxy官方文档](https://caddyserver.com/docs/proxy "proxy官方文档")有现成模板，这样就可以告诉tomcat真正发送请求的信息了。

> header_upstream Host {host}
> 
> header_upstream X-Real-IP {remote}
> 
> header_upstream X-Forwarded-For {remote}
> 
> header_upstream X-Forwarded-Proto {scheme}

##### tomcat侧
配置文件是tomcat安装目录下conf的server.xml。

1. 第一步告诉它转发信息是从443端口来的，因为我们使用HTTPS协议默认端口就是443。

```
<Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="443"
               proxyPort="443"
               URIEncoding="UTF-8"
               />
```

2. 第二步告诉它如何正确处理转发来的参数。

```
<Host name="localhost"  appBase="webapps"
            unpackWARs="true" autoDeploy="true">
      <Valve className="org.apache.catalina.valves.RemoteIpValve"
        remoteIpHeader="x-forwarded-for"
        remoteIpProxiesHeader="x-forwarded-by"
        protocolHeader="x-forwarded-proto"
            />
</Host>
```

## 结语
按照上面的内容配置完成以后应该就能正确的把tomcat上的应用转换为HTTPS链接了，附送一个配好的caddy配置文件，用来参考。

```
http://你的域名:80 {
 timeouts none
 redir https://你的域名{url}
}
https://你的域名:443 {
 timeouts none
 gzip #开启流量压缩，开了不吃亏开了不上当。
 tls 你的邮箱
 proxy /要分流的访问目录 分流地址 {
  websocket
  header_upstream -Origin
 }
 proxy / localhost:8080 { #/后面不写东西就说明全部都分流到8080
  header_upstream Host {host}
  header_upstream X-Real-IP {remote}
  header_upstream X-Forwarded-For {remote}
  header_upstream X-Forwarded-Proto {scheme}
  header_upstream X-Forwarded-Protocol {scheme}
 }
}
```
 