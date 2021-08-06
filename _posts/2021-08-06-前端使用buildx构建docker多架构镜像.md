---
layout:     post
title:      "前端使用buildx构建docker多架构镜像"
subtitle:   ""
date:       2021-08-06
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog:    true
tags:
    - docker
    - buildx
    - arm
---

## 需求背景
docker支持一个镜像tag对应多个架构镜像，并根据对应环境自动拉取。构建方式大概有两种，一种是传统方式，先分别构建不同架构的镜像，然后再聚合成一个。还有一个是通过buildx工具（对环境有较新要求）直接构建一个多架构镜像。buildx直接内置了模拟器在一台机器上就能构建多种架构的镜像，并自动聚合。

本次为了后面构建方便选择了使用buildx方式，这样就不用手动聚合了。

## 参考文章
docker buildx官方文档[https://docs.docker.com/buildx/working-with-buildx/](https://docs.docker.com/buildx/working-with-buildx/ 'Docker Buildx')。

docker buildx 命令官方文档[https://docs.docker.com/engine/reference/commandline/buildx/](https://docs.docker.com/engine/reference/commandline/buildx/ 'Docker Buildx')。

使用 Docker Buildx 构建多种系统架构镜像[https://teddysun.com/581.html](https://teddysun.com/581.html '使用 Docker Buildx 构建多种系统架构镜像').

## 产物
Makefile.var
```
SHELL=\bash

BASE_VERSION=1.1.0

CURRENT_COMMIT=$(shell git rev-parse --short HEAD| cut -b 1-7)
CURRENT_TAG=$(shell git tag --contains $(CURRENT_COMMIT) | head -1)

VERSION=$(shell if [ ! -z $(CURRENT_TAG) ]; then echo $(CURRENT_TAG); else echo $(BASE_VERSION)-$(CURRENT_COMMIT); fi)

HUB=daocloud.io/daocloud

IMG=$(HUB)/dx-arch-ui

DOCKER_MULTI_ARCH=linux/amd64,linux/arm64

```
Makefile
```
include Makefile.var

all: build

get-version:
	@echo $(VERSION)

build:
	echo "Building for arch = $(DOCKER_MULTI_ARCH) tag = $(IMG):$(VERSION)"

	export DOCKER_CLI_EXPERIMENTAL=enabled ;\
	! ( docker buildx ls | grep arch-mutil-platform-builder ) \
	&& ( docker run --rm --privileged docker/binfmt:a7996909642ee92942dcd6cff44b9b95f08dad64;\
	docker buildx create --name arch-mutil-platform-builder --platform $(DOCKER_MULTI_ARCH) );\
	docker buildx build \
	  		 --builder arch-mutil-platform-builder \
	  		 --platform $(DOCKER_MULTI_ARCH) \
	  		 -t $(IMG):$(VERSION) \
	  		 --push \
	  		 .

upload:
	docker push $(IMG):$(VERSION)

release: build upload

clean:
	docker rm $(IMG):$(VERSION)

.PHONY: all build release upload clean

```
Dockerfile
```
FROM node:14.17.4-alpine AS builder-header
# 对 header 进行打包
WORKDIR /app

RUN yarn config set registry https://registry.npm.taobao.org/

COPY ["./the-header/package.json", \
      "./the-header/yarn.lock", \
      "/app/"]

RUN yarn install

COPY ./the-header /app/

RUN yarn run build:lib
RUN yarn run build:lib:inline

FROM node:14.17.4-alpine AS builder-portal
# 对 portal 进行打包
WORKDIR /app

RUN yarn config set registry https://registry.npm.taobao.org/

COPY ["./the-portal/package.json", \
      "./the-portal/yarn.lock", \
      "/app/"]

RUN yarn install

COPY ./the-portal /app/

RUN yarn run build

FROM node:14.17.4-alpine AS builder-ram
# 对 ram 主程序进行打包
WORKDIR /app

# 设置淘宝源
RUN yarn config set registry https://registry.npm.taobao.org/

COPY ["./ram/package.json", \
      "./ram/yarn.lock", \
      "/app/"]

RUN yarn install

COPY ./ram/ /app/

RUN yarn run build

# 获取监控指标
FROM nginx/nginx-prometheus-exporter:0.9.0 AS exporter

FROM nginx:1.20.1-alpine
LABEL io.daocloud.system=build-in

COPY ./nginx/ /etc/nginx

COPY --from=builder-ram /app/dist /usr/share/nginx/ram
COPY --from=builder-header /app/dist /usr/share/nginx/header
COPY --from=builder-header /app/cdist /usr/share/nginx/header
COPY --from=builder-portal /app/dist /usr/share/nginx/portal
COPY --from=exporter /usr/bin/nginx-prometheus-exporter /usr/bin

# 创建一个空文件夹
RUN mkdir /etc/nginx/conf.d/ram-server

# 换源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

RUN apk add gettext
RUN apk add bash

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80 81 82

ENTRYPOINT [ "/entrypoint.sh" ]
```

## 环境要求
1. Docker v19.03+
2. Linux kernel >= 4.8

可以通过`docker version`查看docker版本

据说以下版本安装内核就符合需求，无需自己升级内核
- ubuntu:18.04 LTS 及以上
- debian:10 及以上

## 构建可用的buildx实例
#### 开启实验性支持
通过配置文件
```
$ mkdir ~/.docker
$ cat > ~/.docker/config.json <<EOF
{
"experimental": "enabled"
}
```

通过环境变量
```
export DOCKER_CLI_EXPERIMENTAL=enabled
```

#### 安装buildx
buildx github[https://github.com/docker/buildx/releases/latest](https://github.com/docker/buildx/releases/latest)

根据对应平台下载二进制，并放到`~/.docker/cli-plugins/docker-buildx`，记得使用`chmod a+x ~/.docker/cli-plugins/docker-buildx`赋予可执行权限。

通过`docker buildx version`查看是否安装成功
通过`uname -m`查看当前机器架构

#### 添加多平台支持
可以根据文档选择指定版本的支持，文档[https://hub.docker.com/r/tonistiigi/binfmt](https://hub.docker.com/r/tonistiigi/binfmt)
```
docker run --privileged --rm tonistiigi/binfmt --install all
```

一股脑全装上，获取最新tag[https://hub.docker.com/r/docker/binfmt/tags](https://hub.docker.com/r/docker/binfmt/tags)
```
docker run --rm --privileged docker/binfmt:a7996909642ee92942dcd6cff44b9b95f08dad64
```

查看目录 /proc/sys/fs/binfmt_misc/ 会发现多了一些架构支持。

#### 构建指定版本的构建器并使用
```
docker buildx create --name 你想要的名字 --platform 你想要的平台，例如：linux/amd64,linux/arm64
docker buildx use 你想要的名字
```

#### 也许更高效的方式
如果有原生arm机器的话，buildx似乎可以直接添加一个arm节点来构建，速度会快一些（毕竟少了模拟器层）。但是目前并没看懂这到底是个啥玩意，以后找机会再填坑吧。可以参考[https://medium.com/nttlabs/buildx-multiarch-2c6c2df00ca2](https://medium.com/nttlabs/buildx-multiarch-2c6c2df00ca2)中的**Option 3: Remote mode (easy, fast, but needs an extra machine)**

## 构建
构建指令可以参考上面的文件，前端dockerfile中依赖的docker比较少，注意选择支持所需架构的镜像，各种镜像推荐一手`*-alpine`版本，据说可以有效减少镜像尺寸。构建指令记得加`--push`不然本地似乎不会保存。各种操作指令可以参考官方的文档[https://docs.docker.com/engine/reference/commandline/buildx_build/](https://docs.docker.com/engine/reference/commandline/buildx_build/)

## 验证
1. 先把镜像push到dockerhub上，在tag页面可以看到支持的架构
2. 然后再在不同架构的机器上分别跑一下，最终验证
