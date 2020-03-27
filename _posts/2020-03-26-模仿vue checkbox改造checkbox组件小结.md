---
layout:     post
title:      "模仿vue checkbox改造checkbox组件小结"
subtitle:   
date:       2020-03-26
author:     "漆黑菌"
header-img: "img/post-bg.jpg"
catalog: true
tags:
    - vue
    - checkbox
---

# 简介
在学习了vue处理checkbox的方法后，尝试为公司内部组件的checkbox添加绑定数组支持。果然觉得看懂了和模仿着写出来中间还是差非常多的。

# vue checkbox 如何处理change和checked
先上props
```
props: {
    model: {
      require: false,
      default: undefined
    },
    checked: {
      type: [Boolean],
      require: false,
      default: undefined
    },
    value: {
      default: null
    },
    trueValue: {
      default: true
    },
    falseValue: {
      default: false
    },
    disabled: Boolean,
    indeterminate: Boolean
  }
```

处理checked
```
    currentChecked () {
      return this.checked ??
        (Array.isArray(this.currentModel)
          ? this.looseIndexOf(this.currentModel, this.value) > -1
          : (this.trueValue === true
            ? this.currentModel
            : isEqual(this.currentModel, this.trueValue)
          )
        )
    }
```

处理change
```
    handlerChange (event) {
      const checked = event.target.checked
      if (Array.isArray(this.currentModel)) {
        const index = this.looseIndexOf(this.currentModel, this.value)
        if (checked) {
          if (index < 0) {
            this.currentModel = this.currentModel.concat([this.value])
          }
        } else {
          index > -1 && (this.currentModel = this.currentModel.slice(0, index).concat(this.currentModel.slice(index + 1)))
        }
      } else {
        this.currentModel = checked ? this.trueValue : this.falseValue
      }
      this.$emit('change', this.currentModel)
    }
```

简单总结，大体上的逻辑就是当model为数组时，根据value对model中的数组进行添加或删除。当model为非数组时，则根据true-value或false-value。

# 捣鼓自己实现的版本时遇到的问题
1. 根据vue组件不能直接操作prop的建议，所以model和checked这种属性都要准备一个和对应prop相关的data/computed版本。checked因为不用主动赋值，所以选择了computed。而model因为要处理后通过事件提交到父组件，所以还要考虑到set的情况，因此选择data，然后通过watch和prop中的model关联起来。
2. 在操作model中数组的时候，源代码采用的是`concat`方法，应该是因为跑在原生环境中，并没有改造array的方法和工具函数用。自己实现的版本因为已经在vue中了,所以可以用`this.$delete`和`this.$set`来替代
3. 在替代在替代`looseEqual`和`looseIndexOf`时（详情请见上篇[探索vue checkbox v-model绑定数组语法糖的原理](/2020/02/06/探索vue-checkbox-v-model绑定数组语法糖的原理/ "探索vue checkbox v-model绑定数组语法糖的原理")），一开始选择了lodash的`isEqual`和`findIndex`。这里产生了一个误会以为`findIndex`方法会使用类似deepEqual的方法比较数组和第二个参数，然而实际上第二个是要传入一个“比较方法”，具体可以看文档。需要通过传入`isEqual`才能得到正确的index。虽然后来同事建议不要引入不必要的第三方依赖，直接改回`looseIndexOf`实现了。
4. 组件的结构如下，在使用的时候本来以为可以用`v-text`把内容直接渲染到`slot`中，然而实际上会发生全部组件内容被覆盖的情况。一开始很意外，在实验+查阅文档后发现。要正确使用slot必须采用{{ }}，`v-text`的特性就是会干掉全部textContent。
> 更新元素的 textContent。如果要更新部分的 textContent ，需要使用 \{\{ Mustache \}\} 插值

```
  <label :class="wrapClasses">
    <span :class="checkboxClasses">
      <input
        class="dao-checkbox-input"
        type="checkbox"
        :name="name"
        :checked="currentChecked"
        :disabled="disabled"
        :indeterminate.prop="indeterminate"
        v-on="currentListeners"
      >
      <span class="dao-checkbox-inner" />
    </span>
    <span v-if="$slots.default"><slot /></span>
  </label>
```