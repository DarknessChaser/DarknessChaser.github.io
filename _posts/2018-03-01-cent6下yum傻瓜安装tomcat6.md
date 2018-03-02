---
layout:     post
title:      "cent6下yum傻瓜安装tomcat6"
subtitle:   
date:       2018-03-01
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - tomcat
    - Linux
---

##安装tomcat6
```
yum install tomcat6
```

##启动tomcat6
```
service tomcat6 start
```

##停止tomcat6
```
service tomcat6 stop
```

##重启tomcat6
```
service tomcat6 restart
```

##安装目录
按照以上方法安装tomcat6默认目录在`/usr/share/tomcat6/`下

配置文件默认目录在`/etc/tomcat6/`下

##本地防火墙屏蔽
如果访问http://localhost:8080/访问不了那大多是防火墙经用了8080端口，解决方法如下：

```
iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 8080 -j ACCEPT
```		
