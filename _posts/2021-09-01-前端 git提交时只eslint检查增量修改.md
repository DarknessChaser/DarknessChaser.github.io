---
layout:     post
title:      "前端git提交时只eslint检查增量修改.md"
subtitle:   ""
date:       2021-09-01
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog:    true
tags:
    - git
    - vue
    - eslint
    - vue-cli
---

## 需求背景
现在在维护的代码已经写了很久了，一开始的时候可能并没有严格按照eslint去写，而且已有代码量也很大。在新增lint检查后，每次提交前如果进行全量检查那么就有点浪费时间了，而且还很有可能因为历史代码报错提交不上去。所以最好只检查已改动的代码，一点一点慢慢来。

## 参考文章
lint-staged官方文档[https://github.com/okonet/lint-staged](https://github.com/okonet/lint-staged 'lint-staged')。
husky官方文档[https://github.com/typicode/husky](https://github.com/typicode/husky 'husky')。

## 结论
如果是用较新版vue-cli生成的代码，根本不用进行任何改动，就有这个功能。网上很多教你如何写sh/js脚本增量lint的文章已经过期了。核心流程就是通过`husky`触发git提交前检查+`lint-staged`来实现只对git暂存区执行指定脚本。注意在写本文章的时候用的是husky4和lint-staged10。新版husky文档似乎要更改运行方式，lint-stage10也不再需要在钩子中配置`git add`（@vue/cli 4.5.13生成的模板中会有这一行不过lint-stage版本也是9）。顺路在默认生成的lint后面加上`--fix`，帮助自动纠正些小问题。

```
"scripts": {
	...
    "lint": "vue-cli-service lint --fix"
  },
 "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,vue,ts,tsx}": [
      "vue-cli-service lint"
    ]
  }
```

## 验证
1. 找个有字符串的文件，根据规则把单引号改成双引号-->暂存后提交-->触发lint检测提交失败。验证暂存后会被校验。
2. 找到另外一个字符串文件加点内容并暂存，把第一个文件取消暂存-->触发lint但是提交成功。验证不暂存就不会被校验。
