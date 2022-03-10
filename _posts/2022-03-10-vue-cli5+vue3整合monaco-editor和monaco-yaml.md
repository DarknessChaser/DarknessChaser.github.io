---
layout:     post
title:      "vue-cli5+vue3整合monaco-editor和monaco-yaml"
subtitle:   ""
date:       2022-03-10
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue3
    - vue-cli
    - monaco-editor
    - monaco-yaml
---

# demo项目地址
[https://github.com/DarknessChaser/vue3-monaco-editor-demo](https://github.com/DarknessChaser/vue3-monaco-editor-demo)

# 一些踩坑总结

#### 神奇的网络问题
配代理+有点耐心。`npm i`执行翻车很正常，心态要好。

#### 注意版本信息

###### 源代码和npm版本的差异
其实现在`monaco-editor`和`monaco-yaml` main分支上都已经有官方demo了，是很棒的参考。但是需要注意的是，两者都在持续开发中，npm上发布的内容和GitHub上的源代码可能是不一样的，要注意版本信息，我在开发的时候就对着GitHub上的`monaco-yaml`代码整了半天结果npm上的正式版是老版本。

###### monaco-yaml依赖的monaco-editor版本
现在**2022/3/10**`monaco-yaml`的lock文件只锁`monaco-editor`依赖的最低版本，而且`monaco-editor`是把x.y.z版本号中的y版本当x版本用的，因此当`monaco-editor`y版本更新后很可能就和`monaco-yaml`匹配不上了。因此要去`monaco-yaml`的正确npm版本对应的lock文件找当时开发时真正对应的`monaco-editor`版本。

###### monaco-editor依赖的webpack版本
`monaco-editor`在升级的时候需要的webpack版本也是不同的。2022年又正好是vue-cli社区从webpack4迁移到5的过渡时间段，因此需要找到和`monaco-yaml`对应的`monaco-editor`依赖的webpack版本，再通过这个版本去找对应的vue-cli版本。

#### 接入
因为`monaco-editor`和`monaco-yaml`的demo都没提供vue的，因此需要合理推演一下。

###### vue接入monaco-editor+monaco-editor-webpack-plugin
当使用monaco-yaml@4.0.0-alpha.0时，依赖的版本是monaco-editor@0.30.0。已经可以支持monaco-editor-webpack-plugin了。因为使用了webpack插件，所以不用指定getWorkerUrl相关的配置了。demo中配置文件是给webpack的，对于vue-cli只需要把以下内容加进去即可。

vue.config.js 设置
```js
const { defineConfig } = require('@vue/cli-service');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: [],
        customLanguages: [
          {
            label: 'yaml',
            entry: ['monaco-yaml', 'vs/basic-languages/yaml/yaml.contribution'],
            worker: {
              id: 'monaco-yaml/yamlWorker',
              entry: 'monaco-yaml/lib/esm/yaml.worker',
            },
          },
        ],
      }),
    ],
  },
});
```

###### 接入vue
其实接入vue是相对独立的，正常当一个库引入就好。然后再简单封装一下。
```html
<template>
  <div id="editor" style="height: 300px;"></div>
</template>

<script>
import { defineComponent } from 'vue';
import { Uri, editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { setDiagnosticsOptions } from 'monaco-yaml';

// 仅用来匹配 schema 其实可以不写。
const modelUri = Uri.parse('a://b/foo.yaml');

// 方便大家看效果的默认 schema
const defaultSchemas = [
  {
    // Id of the first schema
    uri: 'http://myserver/foo-schema.json',
    // Associate with our model 这里要和上面的modelUri匹配
    fileMatch: [String(modelUri)],
    schema: {
      type: 'object',
      properties: {
        p1: {
          enum: ['v1', 'v2'],
        },
        p2: {
          // Reference the second schema
          $ref: 'http://myserver/bar-schema.json',
        },
      },
    },
  },
  {
    // Id of the first schema
    uri: 'http://myserver/bar-schema.json',
    schema: {
      type: 'object',
      properties: {
        q1: {
          enum: ['x1', 'x2'],
        },
      },
    },
  },
];

const defaultValue = 'p1: \n';

let monacoEditor;
export default defineComponent({
  name: 'MonacoEditor',
  props: {
    modelValue: {
      type: String,
      require: false,
      default: defaultValue, // 此处只是为了演示提供默认值，使用的时候要改成需要的值
    },
    schemas: {
      require: false,
      default: defaultSchemas, // 此处只是为了演示提供默认值，使用的时候要改成需要的值
    },
  },
  emits: ['change'],
  watch: {
    modelValue(value) {
      if (monacoEditor) {
        monacoEditor.setValue(value);
      }
    },
  },
  created() {
    if (this.schemas) {
      setDiagnosticsOptions({
        enableSchemaRequest: true,
        hover: true,
        completion: true,
        validate: true,
        format: true,
        schemas: defaultSchemas,
      });
    }
  },
  mounted() {
    monacoEditor = editor.create(document.getElementById('editor'), {
      // Monaco-yaml features should just work if the editor language is set to 'yaml'.
      language: 'yaml',
      model: editor.createModel(defaultValue, 'yaml', modelUri),
    });
    monacoEditor.onDidChangeModelContent(() => {
      this.$emit('change', monacoEditor.getValue());
    });
  },
  beforeUnmount() {
    monacoEditor.dispose();
  },
});
</script>

```
PS：monaco-editor的报错hover范围比较小感觉没vs code好用，需要多挪一挪鼠标并不是功能挂了……
