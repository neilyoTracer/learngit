#Day One
1. reactive
```javascript
import { reactive } from 'vue'

const counter = reactive({
  count: 0
})

console.log(counter.count) // 0
counter.count++
```
reactive() 只适用于对象 (包括数组和内置类型，如 Map 和 Set)。而另一个 API ref() 则可以接受任何值类型。ref 会返回一个包裹对象，并在 .value 属性下暴露内部值。

2. ref
```javascript
import { ref } from 'vue'

const message = ref('Hello World!')

console.log(message.value) // "Hello World!"
message.value = 'Changed'
```
reactive() 和 ref() 的细节在[指南——响应式基础](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)一节中有进一步讨论。

3 computed
```javascript
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // 根据 `todos.value` & `hideCompleted.value`
  // 返回过滤后的 todo 项目
  return hideCompleted.value
    ? todos.value.filter((t) => !t.done)
    : todos.value
})
```
3.1 计算属性缓存 vs 方法
*** 计算属性值会基于其响应式依赖被缓存 ***
无论多少次访问computed都会立即返回先前计算的结果，只有依赖不改变，而方法调用总是会在重渲染发生时再次执行函数
这也解释了为什么下面的计算属性永远不会更新，因为Date.now()并不是一个响应式依赖
```javascript
const now = computed(() => Date.now())
```
*note: 不要在计算函数中做异步请求或者更改 DOM！
.exp:
```javascript
const isActive = ref(true)
const error = ref(null)
const classObject = computed(() => ({ 
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))

<div :class="classObject"></div>
```

4. onMounted
```javascript
import { onMounted } from 'vue'

onMounted(() => {
  // 此时组件已经挂载。
})
```

5.watch
```javascript
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // 没错，console.log() 是一个副作用
  console.log(`new count is: ${newCount}`)
})
```

5. 组件
```javascript
<script setup>
import ChildComp from './ChildComp.vue'
</script>

<template>
  <ChildComp />
</template>
```

6. defineProps
```javascript
<!-- ChildComp.vue -->
<script setup>
const props = defineProps({
  msg: String
})
</script>

<ChildComp :msg="greeting" />
```

7. defineEmits
```javascript
<script setup>
// 声明触发的事件
const emit = defineEmits(['response'])

// 带参数触发
emit('response', 'hello from child')

<ChildComp @response="(msg) => childMsg = msg" />
</script>
```

8. createApp
```javascript
<div id="app"></div>

import { createApp } from 'vue'

const app = createApp({
  /* 根组件选项 */
})

// 挂载应用
app.mount('#app')
```

9. 应用配置
应用实例会暴露一个 .config 对象允许我们配置一些应用级的选项，例如定义一个应用级的错误处理器，它将捕获所有由子组件上抛而未被处理的错误：
```javascript
app.config.errorHandler = (err) => {
  /* 处理错误 */
}
```
应用实例还提供了一些方法来注册应用范围内可用的资源，例如注册一个组件：
```javascript
app.component('TodoDeleteButton', TodoDeleteButton)
```
#Day Two
1. 类与样式绑定
# class
```javascript
## 绑定对象
<div :class="{ active: isActive }"><div>

const classObject = reactive({
  active: true,
  'text-danger': false
})

<div :class="classObject"></div>

const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({ 
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))

<div :class="classObject"></div>

## 绑定数组
const active = ref('active')
const error = ref('text-danger')
<div :class="[activeClass, errorClass]"></div>
<div :class="[isActive ? activeClass : '', errorClass]"></div>
<div :class="[{ active: isActive }, errorClass]"></div>
```

## class透传
对于只有一个根元素的组件，当你使用了 class attribute 时，这些 class 会被添加到根元素上，并与该元素上已有的 class 合并。
如果你的组件有多个根元素，你将需要指定哪个根元素来接收这个 class。你可以通过组件的 $attrs 属性来实现指定：
```javascript
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
<MyComponent class="baz" />
这将被渲染为：

html
<p class="baz">Hi!</p>
<span>This is a child component</span>
```
# style
...

2. v-model配合组件使用
# 方法1
```javascript
<input v-model="searchText" />

<input :value="searchText" @input="searchText = $event.target.value" />

<CustomInput v-model="searchText" />

<CustomInput :modelValue="searchText" @update:modelValue="newValue => searchText = newValue" />

// 要让这个例子实际工作起来，<CustomInput> 组件内部需要做两件事：
// 1.将内部原生 input 元素的 value attribute 绑定到 modelValue prop
// 2.输入新的值时在 input 元素上触发 update:modelValue 事件

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>
```

# 方法2
```javascript
<script setup>
import {computed} from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({ 
  get() { 
    return props.modelValue
  },
  set(value) { 
    emit('update:modelValue', value)
  }
})
</script>

<template>
<input v-model="value" />
</template>
```

# 处理 v-model 修饰符
在学习输入绑定时，我们知道了 v-model 有一些内置的修饰符，例如 .trim，.number 和 .lazy。在某些场景下，你可能想要一个自定义组件的 v-model 支持自定义的修饰符。
```javascript
<MyComponent v-model.capitalize="myText" />

<script setup>
import {computed} from 'vue'

const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

console.log(props.modelModifiers) // {capitalize:true}

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}

</script>

<template>
<input type="text" :value="modelValue" @input="emitValue" />
</template>
```