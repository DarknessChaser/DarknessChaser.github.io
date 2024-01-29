---
layout:     post
title:      "如何基于webpack配置可以使用tsx的vue2.7项目"
subtitle:   ""
date:       2024-01-29
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue $slots
    - vue $scopedSlots
    - vue2.6
    - vue2.7
    - vue3
---

## 引入ts支持

安装相关依赖typescript和ts-loader和vue-tsc。

vs code选手记得安装相关volar插件。

配置tsconfig.json。同时参考了vue cli创建的项目和create-vue的ts配置。主要起作用的还是vue cli的配置，直接复制，然后加上

```json
"vueCompilerOptions": {
"target": 2.7
}
```

允许使用js的话记得在最外层和compilerOptions都加上"allowJs": true,

include选项要单独配置了从create-vue抄来的env.d.ts和eslint的配置文件（不加eslint配置文件似乎会导致问题）

>vue2.7中不再需要像vue2.6系列再配置单独的vue.d.ts和tsx.d.ts文件

## 配置vue loader

可以直接用vue cli创建一个vue2项目，然后使用vue inspect指令打印出webpack配置从中抄需要的部分。

>对于vue2.x项目vue loader只能使用v15版本，v16开始就为vue3服务了

## 配置Babel转义jsx插件

vue2.x项目要用`@vue/babel-preset-jsx`，参考文档设置时注意不要与其它插件冲突重复注入render fn。

在现有项目中同事为了兼容vue2.6时代往protype上挂库的写法，在new Vue的时候会把vue实例存起来，然后通过`webpack.ProvidePlugin`插件把全局替换的h指向存起来的vue实例。让.tsx 和 .vue文件都能使用rende fn。

```ts
new webpack.ProvidePlugin({
  h: [resolve('src/shared/h'), 'h'],
}),

export function h(...args) {
  const vueItem = memoryCache.get('vueItem')
  return vueItem.$createElement(...args)
}
```

## eslint配置

安装相关依赖，最重要的是vue的eslint解析器`eslint-plugin-vue`和eslint增强插件`@rushstack/eslint-patch"`。主要配置可以直接从create-vue的2.7项目中抄。用了ts可以考虑用对应的eslint配置，比较基本的是`@vue/eslint-config-typescript`，也可以直接使用`@vue/eslint-config-airbnb-with-typescript`。

配置extends规则时，注意vue要用`plugin:vue/essential`系列规则。因为要用jsx和tsx参考`@vue/eslint-config-airbnb-with-typescript`文档要配置单独的    允许js和允许jsx规则。在单独的.js，.jsx文件中写jsx会lint error不支持的文件后缀

## 开发注意事项

1. vue2.7中对tsx组件的使用和vue3不同，并不能直接使用`<component :is="tsx" />`或者`<Tsx />`而是需要包裹一下写成`<component :is="defineComponent({ render: () => tsx })" />`。vue2.7中似乎并没提供内置组件component的类型信息，webstorm会把类型回落到vue3的，通过defineComponent包裹后可获取一致的ts体验。
2. 如果在script中使用tsx，需要显示指定lang=tsx
3. 如果想使用return render形式的setup，则不能使用setup语法糖。或者通过[https://vue-macros.sxzz.moe/macros/define-render.html](https://vue-macros.sxzz.moe/macros/define-render.html)
