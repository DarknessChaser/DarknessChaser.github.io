---
layout:     post
title:      "快速搭建私有网盘！"
subtitle:   "Caddy+AriaNG+Aria2配置HTTPS离线下载网盘"
date:       2018-04-12
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - 私有网盘
    - Caddy
    - AriaNG
    - Aria2
    - HTTPS
---

### 为什么需要私有网盘？
电脑不想常开挂下载怎么办？如果你正好手头有个闲置硬盘空间的云主机的话，可以在云主机上挂离线然后快速取回本地。

### Caddy+AriaNG+Aria2都是干什么的
1. Aria2算是一款比较出名的多协议、多来源下载工具，支持迅雷磁力链接、BT种子、HTTP、FTP等下载协议，但是它最大的缺点是——他是一个命令行下载工具，敲命令下载可以说是非常痛苦了。
2. AriaNG是为了让用户可以图形化的直接在网页上面添加管理Aria2任务开发的一个WebUI。
3. 既然是WebUI就需要一个网页容器，那么就又要用到方便快捷的web server——Caddy啦。顺路还可以方便的給网站用上HTTPS。

### 安装Aria2
不难看出这三件套的核心就是Aria2，所以我们先选择安装Aria2。这里使用[逗比大佬的一键安装脚本](https://doub.io/shell-jc4/#%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E "逗比大佬的一键安装脚本")，帮你免除安装后配置的痛苦，不过要使用HTTPS协议还需要一点小小的手动改动。

- 下载并执行一键安装脚本`aria2.sh`，后续可以通过`bash aria2.sh`来启动
```
wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/aria2.sh && chmod +x aria2.sh && bash aria2.sh
```

- 脚本功能概览 

```
    Aria2 一键安装管理脚本 [vx.x.x]
    -- Toyo | doub.io/shell-jc4 --
     
    0. 升级脚本
    ————————————
    1. 安装 Aria2
    2. 卸载 Aria2
    ————————————
    3. 启动 Aria2
    4. 停止 Aria2
    5. 重启 Aria2
    ————————————
    6. 修改 配置文件
    7. 查看 配置信息
    8. 查看 日志信息
    9. 配置 自动更新 BT-Tracker服务器
    ————————————
     
    当前状态: 已安装 并 已启动
     
    请输入数字 [0-9]:
```

- 操作概览

```
    启动：/etc/init.d/aria2 start
    
    停止：/etc/init.d/aria2 stop
    
    重启：/etc/init.d/aria2 restart
    
    查看状态：/etc/init.d/aria2 status
    
    配置文件：/root/.aria2/aria2.conf （配置文件包含中文注释，但是一些系统可能不支持显示中文）
    
    令牌密匙：随机生成（可以自己修改 6. 修改 配置文件）
    
    下载目录：/usr/local/caddy/www/aria2/Download
```

- 安装完成后会随机生成密钥，记下来备用

```
    Aria2 简单配置信息：
    
     地址   : #你设备的IP地址，可以替换成你的域名
     端口   : 6800 #默认端口
     密码   : #你的随机密码
     目录   : /usr/local/caddy/www/aria2/Download #默认下载文件目录
```

### 安装并使用Caddy运行Aria2NG
AriaNg是一个 HTML+JS 纯静态一个Aria2的Web面板，所以不需要编译任何环境。任何浏览器都能打开，不过为了让它在我们的服务器上跑起来我们还是需要用到Caddy。

#### 下载并安装Caddy
依然是用到逗比大佬的一键安装脚本
```
wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/caddy_install.sh && chmod +x caddy_install.sh && bash caddy_install.sh install http.filemanager
```

#### 下载AriaNG
GitHub下载地址：[https://github.com/mayswind/AriaNg/releases/latest](https://github.com/mayswind/AriaNg/releases/latest "GitHub下载地址")下载**aria-ng-版本号.zip**后解压扔到你希望的服务器位置即可，这里推荐使用**/usr/local/caddy/www/aria2**。

#### 配置Caddy
打开Caddy的配置文件Caddyfile，添加如下配置。
```
    http://你的域名:80 {
     timeouts none #尽量防止链接超时
     redir https://你的域名:443{url}
    } # HTTP重定向到HTTPS
    https://你的域名:443 {
      root /usr/local/caddy/www/aria2 #放AriaNG网页文件的路径
      timeouts none #尽量防止链接超时
      tls 你的邮箱
      basicauth / 用户名 密码 #给这个网页加个锁
      gzip #压缩文件省流量
      browse #暂时不好解释为什么加这个，作用是让Caddy浏览指定目录下文件
    }

```
重新启动Caddy使得配置生效，不出所料访问你的域名就能访问AriaNG的WebUI了。

#### 配置AriaNG
1. 切换语言简体中文模式
![切换语言](https://cl.ly/0F202i35470H/download/Image%202018-04-12%20at%2011.45.33%20PM.png)
2. 设置Aria2链接，这个其实是可以设置多个的点靠上的**+**即可添加。
![设置Aria2](https://cl.ly/3O0f0m1u1P2X/download/Image%202018-04-12%20at%2011.50.31%20PM.png)
按照这个配置后刷新，不出意外的话……Aria2状态一栏会显示未连接。道理其实也很简单……因为我们的Aria2是HTTP状态啊！！！HTTPS去访问自然是访问不上的。

#### 配置Aria2启动HTTPS
继续运行逗比大佬的脚本`bash aria2.sh`，先选**6**再选**5**，启动手动配置模式。

![手动配置](https://cl.ly/470N3d3Y0s27/download/Image%202018-04-13%20at%2012.00.12%20AM.png)

配置文件全部都有中文注释，写的很详细。按`↓`找到配置SSL/TLS的地方，先打开SSL/TLS的支持，再配置证书文件（.pem或.crt格式）和私钥文件(.key格式)。

![配置SSL/TLS](https://cl.ly/0j290D2d123W/download/Image%202018-04-13%20at%2012.03.55%20AM.png)

证书文件和私钥文件，Caddy已经帮我们申请好了。默认就在在如下目录中，找到相关文件并配置，完成后使用脚本重启Aria2。
> /.caddy/acme/acme-v01.api.letsencrypt.org/sites

完成这些配置后去AriaNG的页面刷新一下应该就可以正常连接了。

PS：其实里面还有些其他的选项可以自己研究一下。

### 一点优化
这个WebUI有个很蛋疼的地方，就是并不提供文件下载的链接。也就是说只负责把文件下载到服务器上，取回和管理还要自己用服务器管理软件。这个就有点不开心了，此时就要用到之前Caddy配置的`browse`功能。如果一切目录都按照默认的来，那么下载文件的位置就在Aria2NG目录下的`Download`文件夹下，所以直接在地址栏中访问`url+/Download`就可以使用Caddy自带的文件浏览功能访问下载文件夹并下载。这样虽然文件管理还是要用服务器管理软件，但是下载是方便多了。

#### 启用filemanager插件管理下载目录
filemanager是caddy下的一个文件管理插件，如果是使用上面的一键脚本按照的话就已经集成了这个插件，没有请自行安装。[filemanager官方文档](https://caddyserver.com/docs/http.filemanager "官方文档")有详细的设置教程，我在这里提供一个自己的配置以供参考。
```
    http://你的域名:80 {
     timeouts none
     redir https://你的域名:443{url}
    }
    https://你的域名:443 {
     root /usr/local/caddy/www/aria2 #放AriaNG网页文件的路径
     timeouts none #尽量防止链接超时
     tls 你的邮箱
     basicauth / 用户名 密码 #给这个网页加个锁
     gzip #压缩文件省流量
     filemanager /Download /usr/local/caddy/www/aria2/Download { # 下载目录
        database /usr/local/caddy/filemanager.db #指定储存配置信息文件目录
        no_auth #不需要登陆验证
        alternative_recaptcha #为中国国情准备的选项，我选上了
        locale zh-cn #选择语言为简体中文
     }
    }

```

#### 自己一点小改动
输入Download也懒得输入的话，可以用我小改的一个AriaNG文件。在左下角**快捷设置**一栏中添加了一个**已下载文件**选项，可以直接访问下载文件目录。

![已下载文件选项](https://cl.ly/022I153x472B/download/Image%202018-04-13%20at%2012.20.53%20AM.png)

欢迎访问[我的GitHub](https://github.com/DarknessChaser/AriaNg "我的GitHub")下载后使用`dist`目录中的文件，塞进静态服务器即可使用快速访问`/Download`目录功能。