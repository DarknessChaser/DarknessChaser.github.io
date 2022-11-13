---
layout:     post
title:      "利用shared worker实现浏览器关闭全部tab后登出用户"
subtitle:   ""
date:       2022-11-13
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - shared worker
    - 关闭全部tab后登出用户
---

## 效果

用户在在关闭全部浏览器中的tab页后，清除用户信息。传统实现遇到的新问题。

1. 把用户信息塞到没有过期时间的cookie中。现代浏览器有个会话保持功能，打开后无过期时间cookie并不会自动清空。
2. 把用户信息塞入sessionStorage。现代浏览器有个新安全策列，通过a标签直接打开的tab不共享sessionStorage。导致新开页丢失用户登录信息。

## 如何shared worker

浏览器其实是比较抗拒开发者拿到用户关闭浏览器信息的，所以并不能直接监听关闭事件。转换思路，在新开tab时如果发现自己是第一个tab，那么登出用户。在同事的启发下，利用shared worker共享内存的特点。tab新开后就在shared worker中先读取是否有tab，再更改标记有tab的值，关闭所有tab后shared worker会重置存在tab的标记。shared worker 在只有一个tab时刷新，状态也会重置。所以在sessionstorage中也需要一份有tab页的标志。

PS: 在webpack5中，worker资源会被加载成相对路径，不用再使用单独的worker-loader处理了。参考以下代码可以快速引入。

### main.ts

```ts
async function firstOpenLogout() {
  // 不支持 SharedWorker 回落到 sessionStorage 没登陆过就退出逻辑
  if (!SharedWorker) {
    if (!hasLogged.value) {
      return logout();
    }
  }
  const loginWorker = new SharedWorker(new URL('@/workers/login.shared.worker.js', import.meta.url));

  loginWorker.port.start();
  const activeTabInfo = new Promise<void>((resolve) => {
    loginWorker.port.onmessage = async ({ data }) => {
      if (data.type === CHECK_FIRST_TAB) {
        if (!hasLogged.value && data.hasActiveTab === false) {
          await logout();
        } else if (data.hasActiveTab === true) {
          hasLogged.value = true;
        }
      }
      resolve();
    };
  });

  loginWorker.port.postMessage(REGISTER_TAB);

  return activeTabInfo;
}

// 伪代码
if (enabled) {
  await firstOpenLogout();
}
```

### login.shared.worker.js

```js
// 就当这里是个原生环境吧，不要依赖任何工具。工具链有问题。甚至 import 也不能正常用
// REGISTER_TAB CHECK_FIRST_TAB 记得和 src\utils\constant.ts 中的同步
const REGISTER_TAB = 'ANAKIN_REGISTER_TAB';
const CHECK_FIRST_TAB = 'ANAKIN_CHECK_FIRST_TAB';
let hasActiveTab = false;

// eslint-disable-next-line no-restricted-globals
self.onconnect = (e) => {
  const port = e.ports[0];

  port.onmessage = ({ data }) => {
    if (data === REGISTER_TAB) {
      port.postMessage({
        type: CHECK_FIRST_TAB,
        hasActiveTab,
      });
      hasActiveTab = true;
    }
  };
};

```
