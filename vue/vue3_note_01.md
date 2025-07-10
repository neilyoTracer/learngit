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

#Day Three
## 侦听器
在组合式 API 中，我们可以使用 watch 函数在每次响应式状态发生变化时触发回调函数
```javascript
<script setup>
import {ref,watch} from 'vue'
const question = ref('')
const answer = ref('Questions usually contain a question mark.')

watch(question, async(newQues, oldQues) => { 
  if(newQues.inclueds('?')) { 
    answer.value = 'Thinking...'
    try { 
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) { 
      answer.value = 'Error! Could not reach the API. '
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>
```

### 侦听数据源类型
watch 的第一个参数可以是不同形式的“数据源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组：
```javascript
const x = ref(0)
const y = ref(0)

watch(x, (newX) => {})
watch(() => x.value + y.value, sum => {})
watch([x, () => y.value], ([newX, newY]) => {})
```
***Note***
注意，你不能直接侦听响应式对象的属性值，例如:
```javascript
const obj = reactive({count:0})
watch(obj.count, count => {}) error
watch(() => obj.count, count => {}) ok
```

### 深层侦听器
直接给 watch() 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发：
```javascript
const obj = reactive({count:0})
watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})
obj.count++
```
相比之下，一个返回响应式对象的 getter 函数，只有在返回不同的对象时，才会触发回调
```javascript
watch(
  () => state.someObject,
  () => {
    // 仅当 state.someObject 被替换时触发
  }
)

// 你也可以给上面这个例子显式地加上 deep 选项，强制转成深层侦听器：
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
)
```

## 停止侦听器
在 setup() 或 <script setup> 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。因此，在大多数情况下，你无需关心怎么停止一个侦听器。

一个关键点是，侦听器必须用同步语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。如下方这个例子：
```javascript
<script setup>
import { watchEffect } from 'vue'

// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)

// 要手动停止一个侦听器，请调用 watch 或 watchEffect 返回的函数：
const unwatch = watchEffect(() => {})
unwatch()

// 注意，需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑：
const data = ref(null)
watchEffect(() => { 
  if(data.value) {}
})
</script>
```

# Day Four
## 模版引用
```javascript
<script setup>
import {ref,onMounted} from 'vue'
const input = ref(null)

onMounted(() => input.value.focus())


//如果你需要侦听一个模板引用 ref 的变化，确保考虑到其值为 null 的情况：
watchEffect(() => { 
  if(input.value) { 
    input.value.focus()
  } else { 
    // 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）
  }
})
</script>

<template>
  <input ref="input" />
</template>
```

### v-for中的模版引用
当在 v-for 中使用模板引用时，对应的 ref 中包含的值是一个数组，它将在元素被挂载后包含对应整个列表的所有元素：
```javascript
<script setup>
import {ref,onMounted} from 'vue'
const list = ref([])
const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item of list" ref="itemRefs">{{item}}</li>
  </ul>
</template>
```
**Note: 应该注意的是，ref 数组并不保证与源数组相同的顺序。

### 函数模板引用
<input :ref="el => {}" />
注意我们这里需要使用动态的 :ref 绑定才能够传入一个函数。当绑定的元素被卸载时，函数也会被调用一次，此时的 el 参数会是 null。你当然也可以绑定一个组件方法而不是内联函数。

## 组件上的ref
模板引用也可以被用在一个子组件上。这种情况下引用中获得的值是组件实例：

有一个例外的情况，使用了 <script setup> 的组件是默认私有的：一个父组件无法访问到一个使用了 <script setup> 的子组件中的任何东西，除非子组件在其中通过 defineExpose 宏显式暴露：
<script>
  import {ref} from 'vue'
  const a = 1
  const b = ref(2)

  defineExpose({
    a,b
  })
</script>

## 组件基础
### 传递props
Props 是一种特别的 attributes，你可以在组件上声明注册。要传递给博客文章组件一个标题，我们必须在组件的 props 列表上声明它。这里要用到 defineProps 宏：
```javascript
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{title}}</h4>
</template>
```
defineProps 是一个仅 <script setup> 中可用的编译宏命令，并不需要显式地导入。声明的 props 会自动暴露给模板。defineProps 会返回一个对象，其中包含了可以传递给组件的所有 props：
const props = defineProps(['title'])
console.log(props.title)

如果你没有使用 <script setup>，props 必须以 props 选项的方式声明，props 对象会作为 setup() 函数的第一个参数被传入：
export defualt { 
  props: ['title'],
  setup(props) { 
    console.log(props.title)
  }
}

### 监听事件
我们可以通过 defineEmits 宏来声明需要抛出的事件：
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
和 defineProps 类似，defineEmits 仅可用于 <script setup> 之中，并且不需要导入，它返回一个等同于 $emit 方法的 emit 函数。它可以被用于在组件的 <script setup> 中抛出事件，因为此处无法直接访问 $emit：
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
如果你没有在使用 <script setup>，你可以通过 emits 选项定义组件会抛出的事件。你可以从 setup() 函数的第二个参数，即 setup 上下文对象上访问到 emit 函数：
export default { 
  emits: ['enlarge-text'],
  setup(props, ctx) { 
    ctx.emit('enlarge-text')
  }
}

### 动态组件
<component :is="tabs[currentTab]"></component>
当使用 <component :is="..."> 来在多个组件间作切换时，被切换掉的组件会被卸载。我们可以通过 <KeepAlive> 组件强制被切换掉的组件仍然保持“存活”的状态。

### DOM 模板解析注意事项
请注意下面讨论只适用于直接在 DOM 中编写模板的情况。如果你使用来自以下来源的字符串模板，就不需要顾虑这些限制了：

单文件组件
内联模板字符串 (例如 template: '...')
<script type="text/x-template">

## 组件注册
### 全局注册
import { createApp } from 'vue'
const app = createApp({})
app.component(
  'MyComponent',
  //组件的实现
  {}
)
import MyComponent from './App.vue'
app.component('MyComponent', MyComponent)
app.component() 方法可以被链式调用：
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)

### 局部注册
在使用 <script setup> 的单文件组件中，导入的组件可以直接在模板中使用，无需注册
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
如果没有使用 <script setup>，则需要使用 components 选项来显式注册：
请注意：局部注册的组件在后代组件中并不可用。在这个例子中，ComponentA 注册后仅在当前组件可用，而在任何的子组件或更深层的子组件中都不可用.

## Props
除了使用字符串数组来声明 prop 外，还可以使用对象的形式：
// 使用 <script setup>
defineProps({
  title: String,
  likes: Number
})

// 非 <script setup>
export default {
  props: {
    title: String,
    likes: Number
  }
}

