# Day Four
## 禁用Attributes继承
如果你不想要一个组件自动地继承 attribute，你可以在组件选项中设置 inheritAttrs: false。

如果你使用了 <script setup>，你需要一个额外的 <script> 块来书写这个选项声明：

vue
<script>
// 使用普通的 <script> 来声明选项
export default {
  inheritAttrs: false
}
</script>

<script setup>
// ...setup 部分逻辑
</script>

最常见的需要禁用 attribute 继承的场景就是 attribute 需要应用在根节点以外的其他元素上。通过设置 inheritAttrs 选项为 false，你可以完全控制透传进来的 attribute 被如何使用。

这些透传进来的 attribute 可以在模板的表达式中直接用 $attrs 访问到。

现在我们要再次使用一下之前小节中的 <MyButton> 组件例子。有时候我们可能为了样式，需要在 <button> 元素外包装一层 <div>：

template
<div class="btn-wrapper">
  <button class="btn">click me</button>
</div>
我们想要所有像 class 和 v-on 监听器这样的透传 attribute 都应用在内部的 <button> 上而不是外层的 <div> 上。我们可以通过设定 inheritAttrs: false 和使用 v-bind="$attrs" 来实现：

template
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>

## 在javascript中访问透传Attributes
如果需要，你可以在 <script setup> 中使用 useAttrs() API 来访问一个组件的所有透传 attribute：

<script setup>
    import {useAttrs} from 'vue'
    const attrs = useAttrs()
</script>

如果没有使用 <script setup>，attrs 会作为 setup() 上下文对象的一个属性暴露：

```javascript
export default {
  setup(props, ctx) {
    // 透传 attribute 被暴露为 ctx.attrs
    console.log(ctx.attrs)
  }
}
```

# Day Five
## 插槽
### 插槽渲染作用域
插槽内容可以访问到父组件的数据作用域，因为插槽内容本身是在父组件模板中定义的。举例来说：

template
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
这里的两个 {{ message }} 插值表达式渲染的内容都是一样的。

插槽内容无法访问子组件的数据。Vue 模板中的表达式只能访问其定义时所处的作用域，这和 JavaScript 的词法作用域规则是一致的。换言之：

### 具名插槽
有时在一个组件中包含多个插槽出口是很有用的。举例来说，在一个 <BaseLayout> 组件中，有如下模板：

template
<div class="container">
  <header>
    <!-- 标题内容放这里 -->
  </header>
  <main>
    <!-- 主要内容放这里 -->
  </main>
  <footer>
    <!-- 底部内容放这里 -->
  </footer>
</div>
对于这种场景，<slot> 元素可以有一个特殊的 attribute name，用来给各个插槽分配唯一的 ID，以确定每一处要渲染的内容：

template
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
这类带 name 的插槽被称为具名插槽 (named slots)。没有提供 name 的 <slot> 出口会隐式地命名为“default”。

在父组件中使用 <BaseLayout> 时，我们需要一种方式将多个插槽内容传入到各自目标插槽的出口。此时就需要用到具名插槽了：

要为具名插槽传入内容，我们需要使用一个含 v-slot 指令的 <template> 元素，并将目标插槽的名字传给该指令：

template
<BaseLayout>
  <template v-slot:header>
    <!-- header 插槽的内容放这里 -->
  </template>
</BaseLayout>
v-slot 有对应的简写 #，因此 <template v-slot:header> 可以简写为 <template #header>。其意思就是“将这部分模板片段传入子组件的 header 插槽中”。

下面我们给出完整的、向 <BaseLayout> 传递插槽内容的代码，指令均使用的是缩写形式：

template
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>

当一个组件同时接收默认插槽和具名插槽时，所有位于顶级的非 <template> 节点都被隐式地视为默认插槽的内容。所以上面也可以写成：

template
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- 隐式的默认插槽 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>

### 作用域插槽
在上面的渲染作用域中我们讨论到，插槽的内容无法访问到子组件的状态。

然而在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。要做到这一点，我们需要一种方法来让子组件在渲染时将一部分数据提供给插槽。

我们也确实有办法这么做！可以像对组件传递 props 那样，向一个插槽的出口上传递 attributes：

template
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
当需要接收插槽 props 时，默认插槽和具名插槽的使用方式有一些小区别。下面我们将先展示默认插槽如何接受 props，通过子组件标签上的 v-slot 指令，直接接收到了一个插槽 props 对象：

template
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
你可能想问什么样的场景才适合用到作用域插槽，这里我们来看一个 <FancyList> 组件的例子。它会渲染一个列表，并同时会封装一些加载远端数据的逻辑、使用数据进行列表渲染、或者是像分页或无限滚动这样更进阶的功能。然而我们希望它能够保留足够的灵活性，将对单个列表元素内容和样式的控制权留给使用它的父组件。我们期望的用法可能是这样的：

template
<FancyList :api-url="url" :per-page="10">
  <template #item="{body,username,likes}">
    <div class="item">
      <p>{{body}}</p>
      <p>by {{username}} | {{likes}} likes</p>
    </div>
  </template>
</FancyList>
在 <FancyList> 之中，我们可以多次渲染 <slot> 并每次都提供不同的数据 (注意我们这里使用了 v-bind 来传递插槽的 props)：

template
<ul>
  <li v-for="item of items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>

## 依赖注入
### Provide(提供)
要为组件后代提供数据，需要使用到 provide() 函数：

vue
<script setup>
import { provide } from 'vue'

provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
</script>
如果不使用 <script setup>，请确保 provide() 是在 setup() ****同步****调用的：

js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
  }
}
provide() 函数接收两个参数。第一个参数被称为注入名，可以是一个字符串或是一个 Symbol。后代组件会用注入名来查找期望注入的值。一个组件可以多次调用 provide()，使用不同的注入名，注入不同的依赖值。

第二个参数是提供的值，值可以是任意类型，包括响应式的状态，比如一个 ref：

js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
提供的响应式状态使后代组件可以由此和提供者建立响应式的联系。

### 应用层Provide
除了在一个组件中提供依赖，我们还可以在整个应用层面提供依赖：

js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
在应用级别提供的数据在该应用内的所有组件中都可以注入。这在你编写插件时会特别有用，因为插件一般都不会使用组件形式来提供值。

### inject(注入)
要注入上层组件提供的数据，需使用 inject() 函数：

vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
如果提供的值是一个 ref，注入进来的会是该 ref 对象，而不会自动解包为其内部的值。这使得注入方组件能够通过 ref 对象保持了和供给方的响应性链接。

同样的，如果没有使用 <script setup>，inject() 需要在 setup() 内****同步***调用：

js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}

### 注入默认值
默认情况下，inject 假设传入的注入名会被某个祖先链上的组件提供。如果该注入名的确没有任何组件提供，则会抛出一个运行时警告。

如果在注入一个值时不要求必须有提供者，那么我们应该声明一个默认值，和 props 类似：

js
// 如果没有祖先组件提供 "message"
// `value` 会是 "这是默认值"
const value = inject('message', '这是默认值')
在一些场景中，默认值可能需要通过调用一个函数或初始化一个类来取得。为了避免在用不到默认值的情况下进行不必要的计算或产生副作用，我们可以使用工厂函数来创建默认值：

js
const value = inject('key', () => new ExpensiveClass())

### 和响应式数据配合使用
当提供 / 注入响应式的数据时，建议尽可能将任何对响应式状态的变更都保持在供给方组件中。这样可以确保所提供状态的声明和变更操作都内聚在同一个组件内，使其更容易维护。

有的时候，我们可能需要在注入方组件中更改数据。在这种情况下，我们推荐在供给方组件内声明并提供一个更改数据的方法函数：

vue
<!-- 在供给方组件内 -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
vue
<!-- 在注入方组件 -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
最后，如果你想确保提供的数据不能被注入方的组件更改，你可以使用 readonly() 来包装提供的值。

vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>

## 组合式函数
### 鼠标跟踪器实例
如果我们要直接在组件中使用组合式 API 实现鼠标跟踪功能，它会是这样的：
<script setup>
  import {ref, onMounted, onUnmounted} from 'vue'

  const x = ref(0)
  const y = ref(0)

  function update(event) { 
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>

但是，如果我们想在多个组件中复用这个相同的逻辑呢？我们可以把这个逻辑以一个组合式函数的形式提取到外部文件中：

```javascript
import {ref,onMounted,onUnmounted} from 'vue'

export function useMouse() { 
  const x = ref(0)
  const y = ref(0)

  function update(event) { 
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>

举例来说，我们可以将添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中：

js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // 如果你想的话，
  // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}

有了它，之前的 useMouse() 组合式函数可以被简化为：

js
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}

### 异步状态示例
```javascript
import {ref} from 'vue'

export function useFetch(url) { 
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then(res => res.json())
    .then(json => data.value = json)
    .catch(err => error.value = err)

  return {data, error}
}
```

<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>

useFetch() 接收一个静态的 URL 字符串作为输入，所以它只执行一次请求，然后就完成了。但如果我们想让它在每次 URL 变化时都重新请求呢？那我们可以让它同时允许接收 ref 作为参数：

```javascript
// fetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // 在请求之前重设状态...
    data.value = null
    error.value = null
    // unref() 解包可能为 ref 的值
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    // 若输入的 URL 是一个 ref，那么启动一个响应式的请求
    watchEffect(doFetch)
  } else {
    // 否则只请求一次
    // 避免监听器的额外开销
    doFetch()
  }

  return { data, error }
}
```

### 约定和最佳实践
命名#
组合式函数约定用驼峰命名法命名，并以“use”作为开头。

输入参数#
尽管其响应性不依赖 ref，组合式函数仍可接收 ref 参数。如果编写的组合式函数会被其他开发者使用，你最好在处理输入参数时兼容 ref 而不只是原始的值。unref() 工具函数会对此非常有帮助：

js
import { unref } from 'vue'

function useFeature(maybeRef) {
  // 若 maybeRef 确实是一个 ref，它的 .value 会被返回
  // 否则，maybeRef 会被原样返回
  const value = unref(maybeRef)
}
如果你的组合式函数在接收 ref 为参数时会产生响应式 effect，请确保使用 watch() 显式地监听此 ref，或者在 watchEffect() 中调用 unref() 来进行正确的追踪。

### 返回值
你可能已经注意到了，我们一直在组合式函数中使用 ref() 而不是 reactive()。我们推荐的约定是组合式函数始终返回一个包含多个 ref 的普通的非响应式对象，这样该对象在组件中被解构为 ref 之后仍可以保持响应性：

js
// x 和 y 是两个 ref
const { x, y } = useMouse()
从组合式函数返回一个响应式对象会导致在对象解构过程中丢失与组合式函数内状态的响应性连接。与之相反，ref 则可以维持这一响应性连接。

如果你更希望以对象属性的形式来使用组合式函数中返回的状态，你可以将返回的对象用 reactive() 包装一次，这样其中的 ref 会被自动解包，例如：

js
const mouse = reactive(useMouse())
// mouse.x 链接到了原来的 x ref
console.log(mouse.x)
template
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}

### 副作用
在组合式函数中的确可以执行副作用 (例如：添加 DOM 事件监听器或者请求数据)，但请注意以下规则：

如果你的应用用到了服务端渲染 (SSR)，请确保在组件挂载后才调用的生命周期钩子中执行 DOM 相关的副作用，例如：onMounted()。这些钩子仅会在浏览器中被调用，因此可以确保能访问到 DOM。

确保在 onUnmounted() 时清理副作用。举例来说，如果一个组合式函数设置了一个事件监听器，它就应该在 onUnmounted() 中被移除 (就像我们在 useMouse() 示例中看到的一样)。当然也可以像之前的 useEventListener() 示例那样，使用一个组合式函数来自动帮你做这些事。

### 使用限制
组合式函数在 <script setup> 或 setup() 钩子中，应始终被同步地调用。在某些场景下，你也可以在像 onMounted() 这样的生命周期钩子中使用他们。

这个限制是为了让 Vue 能够确定当前正在被执行的到底是哪个组件实例，只有能确认当前组件实例，才能够：

将生命周期钩子注册到该组件实例上

将计算属性和监听器注册到该组件实例上，以便在该组件被卸载时停止监听，避免内存泄漏。

TIP

<script setup> 是唯一在调用 await 之后仍可调用组合式函数的地方。编译器会在异步操作之后自动为你恢复当前的组件实例。

## 自定义指令
我们已经介绍了两种在 Vue 中重用代码的方式：组件和组合式函数。组件是主要的构建模块，而组合式函数则侧重于有状态的逻辑。另一方面，自定义指令主要是为了重用涉及普通元素的底层 DOM 访问的逻辑。
<script setup>
// 在模版中启用 v-focus
const vFocus = { 
  mounted: el => el.focus()
}
</script>

<template>
<input v-focus />
</template>

在 <script setup> 中，任何以 v 开头的驼峰式命名的变量都可以被用作一个自定义指令。在上面的例子中，vFocus 即可以在模板中以 v-focus 的形式使用。
在没有使用 <script setup> 的情况下，自定义指令需要通过 directives 选项注册：

js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中启用 v-focus
    focus: {
      /* ... */
    }
  }
}
将一个自定义指令全局注册到应用层级也是一种常见的做法：
const app = createApp({})

// 使 v-focus 在所有组件中都可用
app.directive('focus', {
  /* ... */
})

### 简化形式
对于自定义指令来说，一个很常见的情况是仅仅需要在 mounted 和 updated 上实现相同的行为，除此之外并不需要其他钩子。这种情况下我们可以直接用一个函数来定义指令，如下所示：

template
<div v-color="color"></div>
js
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})

### 在组件上使用自定义指令
当在组件上使用自定义指令时，它会始终应用于组件的根节点，和透传 attributes 类似。
和 attribute 不同，指令不能通过 v-bind="$attrs" 来传递给一个不同的元素。
总的来说，不推荐在组件上使用自定义指令。

# Day Six
## Plugin
### 写法
插件 (Plugins) 是一种能为 Vue 添加全局功能的工具代码。下面是如何安装一个插件的示例：

```javascript
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* 可选的选项 */
})
一个插件可以是一个拥有 install() 方法的对象，也可以直接是一个安装函数本身。安装函数会接收到安装它的应用实例和传递给 app.use() 的额外选项作为参数：

js
const myPlugin = {
  install(app, options) {
    // 配置此应用
  }
}
```
插件没有严格定义的使用范围，但是插件发挥作用的常见场景主要包括以下几种：

1.通过 app.component() 和 app.directive() 注册一到多个全局组件或自定义指令。

2.通过 app.provide() 使一个资源可被注入进整个应用。

3.向 app.config.globalProperties 中添加一些全局实例属性或方法

4.一个可能上述三种都包含了的功能库 (例如 vue-router)。

### 编写一个插件
为了更好地理解如何构建 Vue.js 插件，我们可以试着写一个简单的 i18n (国际化 (Internationalization) 的缩写) 插件。
export default { 
  install: (app, options) => { 

  }
}

<h1>{{ $translate('greetings.hello') }}</h1>

这个函数应当能够在任意模板中被全局调用。这一点可以通过在插件中将它添加到

```javascript
export default {
  install:(app, options) => { 
    app.config.globalProperties.$translate = (key) => { 
      return key.split('.').reduce((o, i) => { 
        if(o) return o[i]
      }, options)
    }
  }
}
```

我们的 $translate 函数会接收一个例如 greetings.hello 的字符串，在用户提供的翻译字典中查找，并返回翻译得到的值。
```javascript
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, { 
  greetings: { 
    hello: 'Bonjour!'
  }
})
```