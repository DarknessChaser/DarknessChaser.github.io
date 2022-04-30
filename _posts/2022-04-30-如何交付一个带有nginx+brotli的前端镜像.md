---
layout:     post
title:      "如何交付一个带有nginx+brotli的前端镜像"
subtitle:   ""
date:       2022-04-30
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - docker
    - nginx
    - brotli
    - 科学使用
---

# 啥是brotli
一种比gzip效率更高的新压缩格式。在Chrome>=50、Firefox>=44等浏览器上支持（详情见["brotli" | Can I use](https://caniuse.com/?search=brotli)），在现在这个时间点（2022年）已经有了广泛的支持，而且浏览器在请求时会告诉服务器自己支持的压缩格式，老浏览器可以很方便的回落到gzip，可以说没啥理由不上。

# nginx+brotli的docker镜像
gzip在nginx是内置的，但是brotli是以第三方模块的形式出现的，因此官方也不提供内置brotli的镜像。虽然我觉得有可能是卖增值服务，因为根据文档nginx plus的brotli的支持是一键开启的。所以镜像需要自己构建，不过官方也提供了一些帮助可以参考[https://github.com/nginxinc/docker-nginx/tree/master/modules](https://github.com/nginxinc/docker-nginx/tree/master/modules)。按照文档构建镜像即可，我是下载Dockerfile.alpine构建的，体积小一些。

Dockerfile.alpine文件第一行会告诉我们基础镜像是什么，我看到的版本是👇。

```
FROM nginx:mainline-alpine
```

然后去[https://hub.docker.com/_/nginx](https://hub.docker.com/_/nginx)查看现在的mainline-alpine对应的真正版本号，我现在是1.21.6。添加到我们自己构建镜像的版本号中，方便后续管理。但是依然不快，需要有点耐心。

```
docker build --build-arg ENABLED_MODULES="brotli" -t darknesschaser/nginx-with-brotli:1.21.6-alpine . -f Dockerfile.alpine
```

## 科学使用 docker proxy
官方文档可以参考[https://docs.docker.com/network/proxy/#use-environment-variables](https://docs.docker.com/network/proxy/#use-environment-variables)。我使用的是桌面版，在**Settings-Resources-PROXIES**手动开启**Manual proxy configuration**并同时设置HTTP和HTTPS。

# 前端dockerfile配置
发现个很神奇的事情，虽然我本地构建成功了名为**nginx-with-brotli**的镜像，但是直接替换nginx镜像，还是会从dockerhub上下载。所以选择先把镜像推到自己的命名空间里**darknesschaser/nginx-with-brotli**。配置文件如下。不过此时还是不能用的，因为还缺少了nginx的配置文件。

```dockerfile
FROM docker.m.daocloud.io/node:16.13.2 as builder
WORKDIR /app
COPY . /app

# package-lock.json is needed
RUN npm ci

# ARG xx=xx

RUN npm run build

FROM darknesschaser/nginx-with-brotli:1.21.6-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
```

# nginx.conf
brotli来自谷歌，可以参考[https://github.com/google/ngx_brotli#brotli_static](https://github.com/google/ngx_brotli#brotli_static)。这里直接从网上抄了一份（见：[https://computingforgeeks.com/how-to-enable-gzip-brotli-compression-for-nginx-on-linux/](https://computingforgeeks.com/how-to-enable-gzip-brotli-compression-for-nginx-on-linux/)），核心部分如下
```
    # 引入brotli模块
    load_module  modules/ngx_http_brotli_filter_module.so;
    load_module  modules/ngx_http_brotli_static_module.so;
    
    # 开启gzip  
    gzip on;
    gzip_min_length 1000;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;

    # 开启brotli
    brotli on;
    brotli_min_length 1000;
    brotli_comp_level 6;
    brotli_types text/xml image/svg+xml application/x-font-ttf image/vnd.microsoft.icon application/x-font-opentype application/json font/eot application/vnd.ms-fontobject application/javascript font/otf application/xml application/xhtml+xml text/javascript  application/x-javascript text/plain application/x-font-truetype application/xml+rss image/x-icon font/opentype text/css image/x-win-bitmap;
```

# 试一下成功了没有
启动镜像后，可以直接浏览器访问。打开开发者工具-网络-在显示信息的table表头上右键一下开启Accept-Encoding，查看是不是br（为brotli简写）。还可以使用命令行，查看返回值中有没有**Content-Encoding: br**。注意因为上面的配置了启用最小尺寸，因此小的文件可能会被跳过，建议找个大点的。

```
curl -IL https://computingforgeeks.com -H "Accept-Encoding: br"
curl -IL https://computingforgeeks.com -H "Accept-Encoding: gzip"
```
