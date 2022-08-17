# Node.js 事件循环

## 介绍

事件循环是了解 Node.js 最重要的方面之一。

为什么这么重要？ 因为它阐明了 Node.js 如何做到异步且具有非阻塞的 I/O，所以它基本上阐明了 Node.js 的“杀手级应用”，正是这一点使它成功了。
Node.js JavaScript 代码运行在单个线程上。 每次只处理一件事。

这个限制实际上非常有用，因为它大大简化了编程方式，而不必担心并发问题。

只需要注意如何编写代码，并避免任何可能阻塞线程的事情，例如同步的网络调用或无限的循环。

通常，在大多数浏览器中，每个浏览器选项卡都有一个事件循环，以使每个进程都隔离开，并避免使用无限的循环或繁重的处理来阻止整个浏览器的网页。

该环境管理多个并发的事件循环，例如处理 API 调用。 Web 工作进程也运行在自己的事件循环中。

主要需要关心代码会在单个事件循环上运行，并且在编写代码时牢记这一点，以避免阻塞它。

## 阻塞事件循环

任何花费太长时间才能将控制权返回给事件循环的 JavaScript 代码，都会阻塞页面中任何 JavaScript 代码的执行，甚至阻塞 UI 线程，并且用户无法单击浏览、滚动页面等。

JavaScript 中几乎所有的 I/O 基元都是非阻塞的。 网络请求、文件系统操作等。 被阻塞是个异常，这就是 JavaScript 如此之多基于回调（最近越来越多基于 promise 和 async/await）的原因。

## 调用堆栈

调用堆栈是一个 LIFO 队列（后进先出）。

事件循环不断地检查调用堆栈，以查看是否需要运行任何函数。

当执行时，它会将找到的所有函数调用添加到调用堆栈中，并按顺序执行每个函数。

你知道在调试器或浏览器控制台中可能熟悉的错误堆栈跟踪吗？ 浏览器在调用堆栈中查找函数名称，以告知你是哪个函数发起了当前的调用：
每次迭代中的事件循环都会查看调用堆栈中是否有东西并执行它直到调用堆栈为空：

## 入队函数执行

上面的示例看起来很正常，没有什么特别的：JavaScript 查找要执行的东西，并按顺序运行它们。

让我们看看如何将函数推迟直到堆栈被清空。

setTimeout(() => {}, 0) 的用例是调用一个函数，但是是在代码中的每个其他函数已被执行之后。
当运行此代码时，会首先调用 foo()。 在 foo() 内部，会首先调用 setTimeout，将 bar 作为参数传入，并传入 0 作为定时器指示它尽快运行。 然后调用 baz()。

## 消息队列(宏任务)

当调用 setTimeout() 时，浏览器或 Node.js 会启动定时器。 当定时器到期时（在此示例中会立即到期，因为将超时值设为 0），则回调函数会被放入“消息队列”中。

在消息队列中，用户触发的事件（如单击或键盘事件、或获取响应）也会在此排队，然后代码才有机会对其作出反应。 类似 onLoad 这样的 DOM 事件也如此。

> 事件循环会赋予调用堆栈优先级，它首先处理在调用堆栈中找到的所有东西，一旦其中没有任何东西，(还需要清空微任务)便开始处理消息队列中的东西。

我们不必等待诸如 setTimeout、fetch、或其他的函数来完成它们自身的工作，因为它们是由浏览器提供的，并且位于它们自身的线程中。 例如，如果将 setTimeout 的超时设置为 2 秒，但不必等待 2 秒，等待发生在其他地方(线程)。

## ES6作业队伍(微任务)

ECMAScript 2015 引入了作业队列的概念，Promise 使用了该队列（也在 ES6/ES2015 中引入）。 执行完当前事件循环的所有工作，在下一次事件循环的开始之前调用)，注意宏任务和事件循环本身无关，只要调用栈不再有任务就会去处理消息队列 

前面两节建议看一下[事件循环: 微任务和宏任务](https://zh.javascript.info/event-loop)

## 了解process.nextTick() 微任务

当尝试了解 Node.js 事件循环时，其中一个重要的部分就是 process.nextTick()。
每当事件循环进行一次完整的行程时，我们都将其称为一个滴答。
当将一个函数传给 process.nextTick() 时，则指示引擎在当前操作结束（在下一个事件循环滴答开始之前）时调用此函数：
JS
process.nextTick(() => {
  //做些事情
})
调用 setTimeout(() => {}, 0) 会在下一个滴答结束时执行该函数，比使用 nextTick()（其会优先执行该调用并在下一个滴答开始之前执行该函数）晚得多。
当要确保在下一个事件循环迭代中代码已被执行，则使用 nextTick()。

## 了解setImmediate()

当要异步地（但要尽可能快）执行某些代码时，其中一个选择是使用 Node.js 提供的 setImmediate() 函数：
JS
setImmediate(() => {
  //运行一些东西
})
作为 setImmediate() 参数传入的任何函数都是在事件循环的下一个迭代中执行的回调。
setImmediate() 与 setTimeout(() => {}, 0)（传入 0 毫秒的超时）、process.nextTick() 有何不同？

传给 process.nextTick() 的函数会在事件循环的当前迭代中（当前操作结束之后）被执行。 这意味着它会始终在 setTimeout 和 setImmediate 之前执行。

延迟 0 毫秒的 setTimeout() 回调与 setImmediate() 非常相似。 执行顺序取决于各种因素，但是它们都会在事件循环的下一个迭代中运行。

## 探索Javascript定时器

# setTimeout()

该语法定义了一个新的函数。 可以在其中调用所需的任何其他函数，也可以传入现有的函数名称和一组参数：
JS
const myFunction = (firstParam, secondParam) => {
  // 做些事情
}

// 2 秒之后运行
setTimeout(myFunction, 2000, firstParam, secondParam)
setTimeout 会返回定时器的 id。 通常不使用它，但是可以保存此 id，并在要删除此安排的函数执行时清除它：
JS
const id = setTimeout(() => {
  // 应该在 2 秒之后运行
}, 2000)

// 改变主意了
clearTimeout(id)

## 零延时

通过在调度程序中排队函数，可以避免在执行繁重的任务时阻塞 CPU，并在执行繁重的计算时执行其他函数。

## setInterval

setInterval 是一个类似于 setTimeout 的函数，不同之处在于：它会在指定的特定时间间隔（以毫秒为单位）一直地运行回调函数，而不是只运行一次：

setTimout(() => {}, 0) == setImmediate(() => {}) 

# Javascript异步编程与回调

## 编程语言中的异步性

计算机在设计上是异步的。

异步意味着事情可以独立于主程序流而发生。

在当前的用户计算机中，每个程序都运行于特定的时间段，然后停止执行，以让另一个程序继续执行。 这件事运行得如此之快，以至于无法察觉。 我们以为计算机可以同时运行许多程序，但这是一种错觉（在多处理器计算机上除外）。

程序在内部会使用中断，一种被发送到处理器以获取系统关注的信号。

这里不会深入探讨这个问题，只要记住，程序是异步的且会暂停执行直到需要关注，这使得计算机可以同时执行其他操作。 当程序正在等待来自网络的响应时，则它无法在请求完成之前停止处理器。

通常，编程语言是同步的，有些会在语言或库中提供管理异步性的方法。 默认情况下，C、Java、C＃、PHP、Go、Ruby、Swift 和 Python 都是同步的。 其中一些语言通过使用线程（衍生新的进程）来处理异步操作。

## Javascript

JavaScript 默认情况下是同步的，并且是单线程的。 这意味着代码无法创建新的线程并且不能并行运行。

代码行是依次执行的，例如：
JS
const a = 1
const b = 2
const c = a * b
console.log(c)
doSomething()

但是 JavaScript 诞生于浏览器内部，一开始的主要工作是响应用户的操作，例如 onClick、onMouseOver、onChange、onSubmit 等。 使用同步的编程模型该如何做到这一点？

答案就在于它的环境。 浏览器通过提供一组可以处理这种功能的 API 来提供了一种实现方式。

更近点，Node.js 引入了非阻塞的 I/O 环境，以将该概念扩展到文件访问、网络调用等。

## 回调

你不知道用户何时单击按钮。 因此，为点击事件定义了一个事件处理程序。 该事件处理程序会接受一个函数，该函数会在该事件被触发时被调用：

JS
document.getElementById('button').addEventListener('click', () => {
  //被点击
})

这就是所谓的回调。

回调是一个简单的函数，会作为值被传给另一个函数，并且仅在事件发生时才被执行。 之所以这样做，是因为 JavaScript 具有顶级的函数，这些函数可以被分配给变量并传给其他函数（称为高阶函数）。

通常会将所有的客户端代码封装在 window 对象的 load 事件监听器中，其仅在页面准备就绪时才会运行回调函数：

JS
window.addEventListener('load', () => {
  //window 已被加载。
  //做需要做的。
})
回调无处不在，不仅在 DOM 事件中。

一个常见的示例是使用定时器：

JS
setTimeout(() => {
  // 2 秒之后运行。
}, 2000)

XHR 请求也接受回调，在此示例中，会将一个函数分配给一个属性，该属性会在发生特定事件（在该示例中，是请求状态的改变）时被调用：
JS
const xhr = new XMLHttpRequest()
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {

    xhr.status === 200 ? console.log(xhr.responseText) : console.error('出错')

  }
}
xhr.open('GET', 'http://nodejs.cn')
xhr.send()

## 处理回调中的错误

如何处理回调的错误？ 一种非常常见的策略是使用 Node.js 所采用的方式：任何回调函数中的第一个参数为错误对象（即错误优先的回调）。
如果没有错误，则该对象为 null。 如果有错误，则它会包含对该错误的描述以及其他信息。
JS
fs.readFile('/文件.json', (err, data) => {
  if (err !== null) {

    //处理错误
    console.log(err)
    return

  }

  //没有错误，则处理数据。
  console.log(data)
})

## 回调的问题

window.addEventListener('load', () => {
  document.getElementById('button').addEventListener('click', () => {

    setTimeout(() => {
      items.forEach(item => {
        //你的代码在这里。
      })
    }, 2000)

  })
})

# 了解Javascript Promise

## Promise 简介

Promise 通常被定义为最终会变为可用值的代理。

Promise 是一种处理异步代码（而不会陷入回调地狱）的方式。
多年来，promise 已成为语言的一部分（在 ES2015 中进行了标准化和引入），并且最近变得更加集成，在 ES2017 中具有了 async 和 await。

异步函数 在底层使用了 promise，因此了解 promise 的工作方式是了解 async 和 await 的基础。

## Promise如何运作

当 promise 被调用后，它会以处理中状态开始。 这意味着调用的函数会继续执行，而 promise 仍处于处理中直到解决为止，从而为调用的函数提供所请求的任何数据。

被创建的 promise 最终会以被解决状态或被拒绝状态结束，并在完成时调用相应的回调函数（传给 then 和 catch）。

## 创建promise

JS
Promise API 公开了一个 Promise 构造函数，可以使用 new Promise() 对其进行初始化：
let done = true

const isItDoneYet = new Promise((resolve, reject) => {
  if (done) {

    const workDone = '这是创建的东西'
    resolve(workDone)

  } else {

    const why = '仍然在处理其他事情'
    reject(why)

  }
})
如你所见，promise 检查了 done 全局常量，如果为真，则 promise 进入被解决状态（因为调用了 resolve 回调）；否则，则执行 reject 回调（将 promise 置于被拒绝状态）。 如果在执行路径中从未调用过这些函数之一，则 promise 会保持处理中状态。

使用 resolve 和 reject，可以向调用者传达最终的 promise 状态以及该如何处理。 在上述示例中，只返回了一个字符串，但是它可以是一个对象，也可以为 null。 由于已经在上述的代码片段中创建了 promise，因此它已经开始执行。 这对了解下面的消费 promise 章节很重要。

一个更常见的示例是一种被称为 Promisifying 的技术。 这项技术能够使用经典的 JavaScript 函数来接受回调并使其返回 promise：

const fs = require('fs')

const getFile = (fileName) => {
  return new Promise((resolve, reject) => {

    fs.readFile(fileName, (err, data) => {
      if (err) {
        reject(err)  // 调用 `reject` 会导致 promise 失败，无论是否传入错误作为参数，
        return        // 且不再进行下去。
      }
      resolve(data)
    })

  })
}

getFile('/etc/passwd')
.then(data => console.log(data))
.catch(err => console.error(err))

在最新版本的 Node.js 中，无需为大多数 API 进行手动地转换。如果需要 promisifying 的函数具有正确的签名，则 [util 模块](http://nodejs.cn/api/util.html#util_util_promisify_original)中有一个 promisifying 函数可以完成此操作。

## 消费promise

在上一个章节中，介绍了如何创建 promise。

现在，看看如何消费或使用 promise。

JS
const isItDoneYet = new Promise(/* ... 如上所述 ... */)
//...

const checkIfItsDone = () => {
  isItDoneYet

    .then(ok => {
      console.log(ok)
    })
    .catch(err => {
      console.error(err)
    })

}

运行 checkIfItsDone() 会指定当 isItDoneYet promise 被解决（在 then 调用中）或被拒绝（在 catch 调用中）时执行的函数。

## 链式promise的示例

```javascript
const status = response => {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    }
    return Promise.reject(new Error(response.statusText))
}

const json = response => response.json()

fetch('/todos.json')
    .then(status) // 注意，`status` 函数实际上在这里被调用，并且同样返回 promise,
    .then(json) // 这里唯一的区别是的 `json` 函数会返回解决时传入 `data` 的 promise，
    .then(data => {}) // 这是 `data` 会在此处作为匿名函数的第一个参数的原因。
    .catch(err => {})
```

在此示例中，调用 fetch() 从域根目录中的 todos.json 文件中获取 TODO 项目的列表，并创建一个 promise 链。

运行 fetch() 会返回一个响应，该响应具有许多属性，在属性中引用了：

status，表示 HTTP 状态码的数值。
statusText，状态消息，如果请求成功，则为 OK。

response 还有一个 json() 方法，该方法会返回一个 promise，该 promise 解决时会传入已处理并转换为 JSON 的响应体的内容。

因此，考虑到这些前提，发生的过程是：链中的第一个 promise 是我们定义的函数，即 status()，它会检查响应的状态，如果不是成功响应（介于 200 和 299 之间），则它会拒绝 promise。
此操作会导致 promise 链跳过列出的所有被链的 promise，且会直接跳到底部的 catch() 语句（记录请求失败的文本和错误消息）。

如果成功，则会调用定义的 json() 函数。 由于上一个 promise 成功后返回了 response 对象，因此将其作为第二个 promise 的输入。

在此示例中，返回处理后的 JSON 数据，因此第三个 promise 直接接收 JSON：

## 编排promise

Promise.all()
如果需要同步不同的 promise，则 Promise.all() 可以帮助定义 promise 列表，并在所有 promise 都被解决后执行一些操作。

```javascript
const f1 = fetch('/something.json')
const f2 = fetch('/something2.json')

Promise.all([f1, f2])
    .then(res => {})
    .catch(err => {})

Promise.all([f1, f2]).then(([res1, res2]) => {
    console.log('结果', res1, res2)
})
```

## Promise.race()

当传给其的首个 promise 被解决时，则 Promise.race() 开始运行，并且只运行一次附加的回调（传入第一个被解决的 promise 的结果）。

```javascript
const first = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, ‘第一个’)
})

const second = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, ‘第二个’)
})

Promise.race([first, second]).then(res => console.log(res)) // 第二个
```

# 具有Async和Await的现代异步JavaScript

## 介绍

JavaScript 在很短的时间内从回调发展到了 promise（ES2015），且自 ES2017 以来，异步的 JavaScript 使用 async/await 语法甚至更加简单。

异步函数是 promise 和生成器的组合，基本上，它们是 promise 的更高级别的抽象。 而 async/await 建立在 promise 之上。

## 为什么引入async/await

它们减少了 promises 的样板，且减少了 promise 链的“不破坏链条”的限制。

当 ES2015 中引入 Promise 时，它们旨在解决异步代码的问题，并且确实做到了，但是在 ES2015 和 ES2017 断开的两年中，很明显，promise 不可能成为最终的解决方案。

Promise 被引入了用于解决著名的回调地狱问题，但是它们自身引入了复杂性以及语法复杂性。

它们是很好的原语，可以向开发人员公开更好的语法，因此，当时机合适时，我们得到了异步函数。

它们使代码看起来像是同步的，但它是异步的并且在后台无阻塞。

## 工作原理

异步函数会返回 promise，例如以下示例：

JS
const doSomethingAsync = () => {
  return new Promise(resolve => {

    setTimeout(() => resolve('做些事情'), 3000)

  })
}

当要调用此函数时，则在前面加上 await，然后调用的代码就会停止直到 promise 被解决或被拒绝。 注意：客户端函数必须被定义为 async。 这是一个示例：

JS
const doSomething = async () => {
  console.log(await doSomethingAsync())
}

这是一个 async/await 的简单示例，用于异步地运行函数：

JS
const doSomethingAsync = () => {
  return new Promise(resolve => {

    setTimeout(() => resolve('做些事情'), 3000)

  })
}

const doSomething = async () => {
  console.log(await doSomethingAsync())
}

console.log('之前')
doSomething()
console.log('之后')

之前
之后
做些事情 // 3 秒之后

## Promise所有事情

在任何函数之前加上 async 关键字意味着该函数会返回 promise。

即使没有显式地这样做，它也会在内部使它返回 promise。

这就是为什么此代码有效的原因：

JS
const aFunction = async () => {
  return '测试'
}

aFunction().then(alert) // 这会 alert '测试'

这与以下代码一样：

JS
const aFunction = () => {
  return Promise.resolve('测试')
}

aFunction().then(alert) // 这会 alert '测试'

## 代码更容易阅读

调试 promise 很难，因为调试器不会跳过异步的代码。
Async/await 使这非常容易，因为对于编译器而言，它就像同步代码一样。

# Node.js事件触发器

如果你在浏览器中使用 JavaScript，则你会知道通过事件处理了许多用户的交互：鼠标的单击、键盘按钮的按下、对鼠标移动的反应等等。

在后端，Node.js 也提供了使用 events 模块构建类似系统的选项。

具体上，此模块提供了 EventEmitter 类，用于处理事件。

使用以下代码进行初始化：

```javascript
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()
```

该对象公开了 on 和 emit 方法。

emit 用于触发事件。
on 用于添加回调函数（会在事件被触发时执行）。
例如，创建 start 事件，并提供一个示例，通过记录到控制台进行交互：

```javascript
eventEmitter.on('start', () => {
    console.log('开始')
})
```

当运行以下代码时：

JS
eventEmitter.emit('start')
可以通过将参数作为额外参数传给 emit() 来将参数传给事件处理程序：

```javascript
eventEmitter.on('start', number => {
    console.log(`开始 ${number}`)
})

eventEmitter.emit('start', 23)

// 多个参数
eventEmitter.on('start', (start, end) => {
    console.log(`从 ${start} 到 ${end}`)
})

eventEmitter.emit('start', 1, 100)
```

EventEmitter 对象还公开了其他几个与事件进行交互的方法，例如：

once(): 添加单次监听器。
removeListener() / off(): 从事件中移除事件监听器。
removeAllListeners(): 移除事件的所有监听器。

可以在事件模块的页面 http://nodejs.cn/api/events.html 上阅读其所有详细信息。

# 搭建HTTP服务器

这是一个简单的 HTTP web 服务器的示例：

```javascript
const http = require('http')

const port = 3000

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('你好世界\n')
})

server.listen(port, () => {
    console.log(`服务器运行在 http://${hostname}:${port}/`)
})
```

简要分析一下。 这里引入了 http 模块。

使用该模块来创建 HTTP 服务器。

服务器被设置为在指定的 3000 端口上进行监听。 当服务器就绪时，则 listen 回调函数会被调用。

传入的回调函数会在每次接收到请求时被执行。 每当接收到新的请求时，request 事件会被调用，并提供两个对象：
一个请求（[http. IncomingMessage](http://nodejs.cn/api/http.html#http_class_http_incomingmessage)对象)
和一个响应（[http. ServerResponse](http://nodejs.cn/api/http.html#http_class_http_serverresponse)对象)。

# 使用Node.js发送HTTP请求

## 执行GET请求

```javascript
const https = require('https')
const options = {
    hostname: 'nodejs.cn',
    port: 443,
    path: '/todos',
    method: 'GET'
}

const req = https.request(options, res => {
    console.log(`状态码: ${res.statusCode}`)

    res.on('data', d => {
        process.stdout.write(d)
    })
})

req.on('error', err => {
    console.error(err)
})

req.end()
```

## 执行POST请求

```javascript
const https = require('https')
const data = JSON.stringify({
    todo: '做点事情'
})

const options = {
    hostname: 'nodejs.cn',
    post: 443,
    path: '/todos',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}

const req = https.request(options, res => {
    console.log(`状态码: ${res.statusCode}`)

    res.on('data', d => {
        process.stdout.write(d)
    })
})

req.on('error', err => {
    console.error(error)
})

req.write(data)
req.end()
```

# 使用Node.js发送HTTP POST请求

在 Node.js 中，有多种方式可以执行 HTTP POST 请求，具体取决于要使用的抽象级别。

使用 Node.js 执行 HTTP 请求的最简单的方式是使用 Axios 库：

```javascript
const axios = require('axios')

axios
    .post('http://nodejs.cn/todos', {
        todo: '做点事情'
    })
    .then(res => {
        console.log(`状态码: ${res.statusCode}`)
        console.log(res)
    })
    .catch(error => {
        console.error(error)
    })
```

# 使用Node.js获取HTTP请求的正文数据

这是在请求正文中提取以 JSON 格式发送的数据的方式。

如果使用的是 Express，则非常简单：使用 body-parser Node.js 模块。

例如，获取此请求的正文：

```javascript
// 请求
const axios = require('axios')
axios.post('http://nodejs.cn/todos', {
    todo: '做点事情'
})

// 服务器处理请求
const express = require('express')
const app = express()

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.post('/todos', (req, res) => {
    console.log(req.body.todo)
})
```

要理解的关键是，当使用 http.createServer() 初始化 HTTP 服务器时，服务器会在获得所有 HTTP 请求头（而不是请求正文时）时调用回调。

在连接回调中传入的 request 对象是一个流。

因此，必须监听要处理的主体内容，并且其是按数据块处理的。

首先，通过监听流的 data 事件来获取数据，然后在数据结束时调用一次流的 end 事件：

```javascript
const server = http.createServer((req, res) => {
    req.on('data', chunk => {
        console.log(`可用的数据块: ${chunk}`)
    })
    req.on('end', () => {
        // 数据结束
    })
})

const server = http.createServer((req, res) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', () => {
        JSON.parse(data).todo // '做点事情'
    })
})
```


# 在Node.js中使用文件描述符
在与位于文件系统中的文件进行交互之前，需要先获取文件的描述符。

文件描述符是使用 fs 模块提供的 open() 方法打开文件后返回的：

```javascript
const fs = require('fs')
fs.open('/Users/joe/test.txt', 'r', (err, fd) => { 
    // fd 是文件描述符
})

// 也可以使用 fs.openSync 方法打开文件，该方法会返回文件描述符（而不是在回调中提供）：

const fs = require('fs')

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r')
} catch (err) {
  console.error(err)
}
```

注意，将 r 作为 fs.open() 调用的第二个参数。

该标志意味着打开文件用于读取。

其他常用的标志有：

r+ 打开文件用于读写。
w+ 打开文件用于读写，将流定位到文件的开头。如果文件不存在则创建文件。
a 打开文件用于写入，将流定位到文件的末尾。如果文件不存在则创建文件。
a+ 打开文件用于读写，将流定位到文件的末尾。如果文件不存在则创建文件。



一旦获得文件描述符，就可以以任何方式执行所有需要它的操作，例如调用 fs.open() 以及许多与文件系统交互的其他操作。

# Node.js文件属性
每个文件都带有一组详细信息，可以使用 Node.js 进行检查。

具体地说，使用 fs 模块提供的 stat() 方法。

调用时传入文件的路径，一旦 Node.js 获得文件的详细信息，则会调用传入的回调函数，并带上两个参数：错误消息和文件属性：

```javascript
cosnt fs = require('fs')
fs.stat('/Users/joe/test.txt', (err, stats) => { 
    if(err) { 
        console.error(err)
        return
    }
})

// Node.js 也提供了同步的方法，该方法会阻塞线程，直到文件属性准备就绪为止：

const fs = require('fs')
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}

const fs = require('fs')
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }

  stats.isFile() //true
  stats.isDirectory() //false
  stats.isSymbolicLink() //false
  stats.size //1024000 //= 1MB
})

```

文件的信息包含在属性变量中。 可以通过属性提取哪些信息？

很多，包括：

使用 stats.isFile() 和 stats.isDirectory() 判断文件是否目录或文件。
使用 stats.isSymbolicLink() 判断文件是否符号链接。
使用 stats.size 获取文件的大小（以字节为单位）。
还有其他一些高级的方法，但是在日常编程中会使用的大部分是这些。

# Node.js文件路径
系统中的每个文件都有路径。

在 Linux 和 macOS 上，路径可能类似于：

/users/joe/file.txt

在 Windows 上则有所不同，具有类似以下的结构：

C:\users\joe\file.txt

当在应用程序中使用路径时需要注意，因为必须考虑到这种差异。

可以使用以下方式将此模块引入到文件中：
JS
const path = require('path')
## 从路径中获取信息
给定一个路径，可以使用以下方法从其中提取信息：

dirname: 获取文件的父文件夹。
basename: 获取文件名部分。
extname: 获取文件的扩展名。
```javascript
const notes = '/user/joe/notes.txt'
path.dirname(notes) // /user/joe
path.basename(notes)// notes.txt
path.extname(notes) // .txt

// 可以通过为 basename 指定第二个参数来获取不带扩展名的文件名：
path.basename(notes, path.extname(notes)) // notes
```

## 使用路径
```javascript
const name = 'joe'
// 可以使用 path.join() 连接路径的两个或多个片段：
path.join('/', 'users', name, 'notes.txt') // 'users/joe/notes.txt'

// 可以使用 path.resolve() 获得相对路径的绝对路径计算：
path.resolve('joe.txt') // 'Users/joe/joe.txt'

// 在此示例中，Node.js 只是简单地将 /joe.txt 附加到当前工作目录。 如果指定第二个文件夹参数，则 resolve 会使用第一个作为第二个的基础：
path.resolve('tmp', 'joe.txt') // 'Users/joe/tmp/joe.txt'

// 如果第一个参数以斜杆开头，则表示它是绝对路径
path.resolve('/etc', 'joe.txt') // '/etc/joe.txt'

// path.normalize() 是另一个有用的函数，当包含诸如 .、.. 或双斜杠之类的相对说明符时，其会尝试计算实际的路径：
path.normalize('/user/joe/..//text.txt') // '/users/text.txt'
```

解析和规范化都不会检查路径是否存在。 其只是根据获得的信息来计算路径。

# 使用Node.js读取文件
在 Node.js 中读取文件最简单的方式是使用 fs.readFile() 方法，向其传入文件路径、编码、以及会带上文件数据（以及错误）进行调用的回调函数：
```javascript
const fs = require('fs')

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => { 
    if(err) { 
        console.error(err)
        return
    }

    console.log(data)
})

// 另外，也可以使用同步的版本 fs.readFileSync()：
try { 
    const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
    console.log(data)
} catch (err) { 
    console.error(err)
}
```

fs.readFile() 和 fs.readFileSync() 都会在返回数据之前将文件的全部内容读取到内存中。

这意味着大文件会对内存的消耗和程序执行的速度产生重大的影响。

在这种情况下，**更好的选择是使用流来读取文件的内容。**

# 使用Node.js写入文件
```javascript
// 在 Node.js 中写入文件最简单的方式是使用 fs.writeFile() API。

const fs = require('fs')
const content = '一些内容'
fs.writeFile('Users/joe/test.txt', content, err => { 
    if(err) { 
        console.error(err)
        return
    }

    // 文件写入成功
})

// 另外，也可以使用同步的版本 fs.writeFileSync()：
const fs = require('fs')
const content = '一些内容'

try { 
    const data = fs.writeFileSync('/User/joe/test.txt', content)
    // 文件写入成功
} catch (err) { 
    console.error(err)
}

// 默认情况下，此 API 会替换文件的内容（如果文件已经存在）。

// 可以通过指定标志来修改默认的行为：

fs.writeFile('/Users/joe/test.txt', content, {flag: 'a+'}, err => {})
```
r+ 打开文件用于读写。
w+ 打开文件用于读写，将流定位到文件的开头。如果文件不存在则创建文件。
a 打开文件用于写入，将流定位到文件的末尾。如果文件不存在则创建文件。
a+ 打开文件用于读写，将流定位到文件的末尾。如果文件不存在则创建文件。

(可以在 http://nodejs.cn/api/fs.html#fs_file_system_flags 中查看更多标志)

## 追加到文件
将内容追加到文件末尾的便捷方法是 fs.appendFile()（及其对应的 fs.appendFileSync()）：

## 使用流
所有这些方法都是在将全部内容写入文件之后才会将控制权返回给程序（在异步的版本中，这意味着执行回调）。

在这种情况下，更好的选择是使用流写入文件的内容。

# 在Node.js中使用文件夹
Node.js 的 fs 核心模块提供了许多便捷的方法用于处理文件夹。

## 检查文件夹是否存在
使用 fs.access() 检查文件夹是否存在以及 Node.js 是否具有访问权限。

## 创建新的文件夹
使用 fs.mkdir() 或 fs.mkdirSync() 可以创建新的文件夹。
```javascript
const fs = require('fs')

const folderName = '/User/joe/test'

try { 
    if(!fs.exsitSync(folderName)) { 
        fs.mkdirSync(folderName)
    }
} catch (err) { 
    console.log(err)
}
```

## 读取目录内容

使用 fs.readdir() 或 fs.readdirSync() 可以读取目录的内容。
这段代码会读取文件夹的内容（全部的文件和子文件夹），并返回它们的相对路径：
```javascript
const fs = require('fs')
const path = require('path')

const folderPath = '/Users/joe'

fs.readdirSync(folderPath)

// 可以获取完整的路径：
fs.readdirSync(folderPath).map(fileName => { 
    return path.join(folderPath, fileName)
})

// 也可以过滤结果以仅返回文件（排除文件夹）：
const isFile = fileName => { 
    return fs.lstatSync(fileName).isFile()
}

fs.readdirSync(folderPath).map(fileName => path.join(folderPath, fileName)).filter(isFile)
```

## 重命名文件夹
```javascript
const fs = require('fs')

fs.rename('Users/joe', '/Users/roger', err => { 
    if(err) { 
        console.error(err)
        return
    }
    // 完成
})
```


## 删除文件夹
使用 fs.rmdir() 或 fs.rmdirSync() 可以删除文件夹。

> 删除包含内容的文件夹可能会更复杂。
> 在这种情况下，最好安装 fs-extra 模块，该模块非常受欢迎且维护良好。 它是 fs 模块的直接替代品，在其之上提供了更多的功能。

# Node.js操作系统模块
```javascript
const os = require('os')
```

os.EOL 可给出行定界符序列。 在 Linux 和 macOS 上为 \n，在 Windows 上为 \r\n。
os.contants.signals  可告知所有与处理过程信号相关的常量，例如 SIGHUP、SIGKILL 等。
os.constants.errno 可设置用于错误报告的常量，例如 EADDRINUSE、EOVERFLOW 等。
可以在 http://nodejs.cn/api/os.html#os_signal_constants 上阅读所有的内容。

# Node.js http模块
## 属性
http.METHODS
http.STATUS_CODES
http.globalAgent
指向 Agent 对象的全局实例，该实例是 http.Agent 类的实例。

用于管理 HTTP 客户端连接的持久性和复用，它是 Node.js HTTP 网络的关键组件。

稍后会在 http.Agent 类的说明中提供更多描述。

## 方法
http.createServer()
返回http.Server类的实例
http.request()
发送 HTTP 请求到服务器，并创建 http.ClientRequest 类的实例。
http.get()
类似于 http.request()，但会自动地设置 HTTP 方法为 GET，并自动地调用 req.end()。

## 类
HTTP 模块提供了 5 个类:
    * http.Agent
    * http.ClientRequest
    * http.Server
    * http.ServerResponse
    * http.IncomingMessage
http.Agent
Node.js 会创建 http.Agent 类的全局实例，以管理 HTTP 客户端连接的持久性和复用，这是 Node.js HTTP 网络的关键组成部分。

该对象会确保对服务器的每个请求进行排队并且单个 socket 被复用。

它还维护一个 socket 池。 出于性能原因，这是关键。

# Node.js Buffer
## 什么是 buffer？
Buffer 是内存区域。 JavaScript 开发者可能对这个概念并不熟悉，比每天与内存交互的 C、C++ 或 Go 开发者（或使用系统编程语言的任何程序员）要少得多。

它表示在 V8 JavaScript 引擎外部分配的固定大小的内存块（无法调整大小）。

可以将 buffer 视为整数数组，每个整数代表一个数据字节。

它由 Node.js Buffer 类实现。
```javascript
import { Buffer } from 'node:buffer';

```

## 为什么需要 buffer？
Buffer 被引入用以帮助开发者处理二进制数据，在此生态系统中传统上只处理字符串而不是二进制数据。

Buffer 与流紧密相连。 当流处理器接收数据的速度快于其消化的速度时，则会将数据放入 buffer 中。

一个简单的场景是：当观看 YouTube 视频时，红线超过了观看点：即下载数据的速度比查看数据的速度快，且浏览器会对数据进行缓冲。

## 如何创建buffer
使用 Buffer.from()、Buffer.alloc() 和 Buffer.allocUnsafe() 方法可以创建 buffer。
    * Buffer.from(array)
    * Buffer.from(arraybuffer, [, byteOffset[, length]])
    * Buffer.from(buffer)
    * Buffer.from(string[, encoding])
也可以只初始化 buffer（传入大小）。 以下会创建一个 1KB 的 buffer：
```javascript
const buf = Buffer.alloc(1024)
// 或
const buf = Buffer.allocUnsafe(1024)
```    

虽然 alloc 和 allocUnsafe 均分配指定大小的 Buffer（以字节为单位），但是 alloc 创建的 Buffer 会被使用零进行初始化，而 allocUnsafe 创建的 Buffer 不会被初始化。 这意味着，尽管 allocUnsafe 比 alloc 要快得多，但是分配的内存片段可能包含可能敏感的旧数据。

当 Buffer 内存被读取时，如果内存中存在较旧的数据，则可以被访问或泄漏。 这就是真正使 allocUnsafe 不安全的原因，在使用它时必须格外小心。

## 使用Buffer
Buffer（字节数组）可以像数组一样被访问：

JS
const buf = Buffer.from('Hey!')
console.log(buf[0]) //72
console.log(buf[1]) //101
console.log(buf[2]) //121

这些数字是 Unicode 码，用于标识 buffer 位置中的字符（H => 72、e => 101、y => 121）。

可以使用 toString() 方法打印 buffer 的全部内容：

JS
console.log(buf.toString())
> 注意，如果使用数字（设置其大小）初始化 buffer，则可以访问到包含随机数据的已预初始化的内存（而不是空的 buffer）！

## 更改buffer的内容
可以使用 write() 方法将整个数据字符串写入 buffer：
```javascript
const buf = Buffer.alloc(4)
buf.write('Hey!')
```

## 复制buffer
buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])
```javascript
const buf = Buffer.from('Hey!')
let bufcopy = Buffer.alloc(4)
buf.copy(bufcopy)

// 将buf复制到bufcopy中，相当于
bufcopy.set(buf.subarray())

// 默认情况下，会复制整个 buffer。 另外的 3 个参数可以定义开始位置、结束位置、以及新的 buffer 长度：
const buf = Buffer.from('Hey!')
let bufcopy = Buffer.alloc(2)
buf.copy(bufcopy, 0, 0, 2)
```

# Node.js 流
## 什么是流
流是为 Node.js 应用程序提供动力的基本概念之一。

它们是一种以高效的方式处理读/写文件、网络通信、或任何类型的端到端的信息交换。

流不是 Node.js 特有的概念。 它们是几十年前在 Unix 操作系统中引入的，程序可以通过管道运算符（|）对流进行相互交互。

例如，在传统的方式中，当告诉程序读取文件时，这会将文件从头到尾读入内存，然后进行处理。

使用流，则可以逐个片段地读取并处理（而无需全部保存在内存中）。

Node.js 的 [stream 模块](http://nodejs.cn/api/stream.html) 提供了构建所有流 API 的基础。 所有的流都是 EventEmitter 的实例。

## 为什么是流
相对于使用其他的数据处理方法，流基本上提供了两个主要优点：

内存效率: 无需加载大量的数据到内存中即可进行处理。
时间效率: 当获得数据之后即可立即开始处理数据，这样所需的时间更少，而不必等到整个数据有效负载可用才开始。

## 流的示例
一个典型的例子是从磁盘读取文件。

使用 Node.js 的 fs 模块，可以读取文件，并在与 HTTP 服务器建立新连接时通过 HTTP 提供文件：
```javascript
const http = require('http')
const fs = require('fs')

const server = http.createServer(function(req, res) { 
    fs.readFile(__dirname + '/data.txt', (err, data) => { 
        res.end(data)
    })
})

server.listen(3000)

// readFile() 读取文件的全部内容，并在完成时调用回调函数。

// 回调中的 res.end(data) 会返回文件的内容给 HTTP 客户端。

// 如果文件很大，则该操作会花费较多的时间。 以下是使用流编写的相同内容：

const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => { 
    const stream = fs.createReadStream(__dirname + '/data.txt')
    stream.pipe(res)
})

server.listen(3000)
```
当要发送的数据块已获得时就立即开始将其流式传输到 HTTP 客户端，而不是等待直到文件被完全读取。

## pipe()
上面的示例使用了 stream.pipe(res) 这行代码：在文件流上调用 pipe() 方法。

该代码的作用是什么？ 它获取来源流，并将其通过管道传输到目标流。

在来源流上调用它，在该示例中，文件流通过管道传输到 HTTP 响应。

pipe() 方法的返回值是目标流，这是非常方便的事情，它使得可以链接多个 pipe() 调用，如下所示：

JS
src.pipe(dest1).pipe(dest2)

此构造相对于：

JS
src.pipe(dest1)
dest1.pipe(dest2)

## 流驱动的Node.js API
由于它们的优点，许多 Node.js 核心模块提供了原生的流处理功能，最值得注意的有：

> process.stdin 返回连接到 stdin 的流。
> process.stdout 返回连接到 stdout 的流。
> process.stderr 返回连接到 stderr 的流。
> fs.createReadStream() 创建文件的可读流。
> fs.createWriteStream() 创建到文件的可写流。
> net.connect() 启动基于流的连接。
> http.request() 返回 http.ClientRequest 类的实例，该实例是可写流。
> zlib.createGzip() 使用 gzip（压缩算法）将数据压缩到流中。
> zlib.createGunzip() 解压缩 gzip 流。
> zlib.createDeflate() 使用 deflate（压缩算法）将数据压缩到流中。
> zlib.createInflate() 解压缩 deflate 流。

## 不同类型的流
流分为四类
> Readable: 可以通过管道读取、但不能通过管道写入的流（可以接收数据，但不能向其发送数据）。 当推送数据到可读流中时，会对其进行缓冲，直到使用者开始读取数据为止。
> Writable: 可以通过管道写入、但不能通过管道读取的流（可以发送数据，但不能从中接收数据）。
> Duplex: 可以通过管道写入和读取的流，基本上相对于是可读流和可写流的组合。
> Transform: 类似于双工流、但其输出是其输入的转换的转换流。

## 如何创建可读流
从 stream 模块获取可读流，对其进行初始化并实现 readable._read() 方法。

```javascript
// 首先创建流对象：
const Stream = require('stream')
const readableStream = new Stream.Readable()
// 然后实现_read
readableStream._read = () => {}

// 也可以使用read属性实现_read
const readableStream = new Stream.Readable({
    read() { }
})

```

## 如何创建可写流
若要创建可写流，需要继承基本的 Writable 对象，并实现其 _write() 方法。

```javascript
// 首先创建流对象
const Stream = require('stream')
const writableStream = new Stream.Writable()

// 然后实现_write
writableStream._write = (chunk, encoding, next) => { 
    console.log(chunk.toString())
    next()
}

// 现在，可以通过一下方式传输可写流
process.stdin.pipe(writableStream)
```

## 如何从可读流中获取数据
```javascript
const Stream = require('stream')
const readableStream = new Stream.Readable({ 
    read() {}
})

const writableStream = new Stream.Writable()
writableStream._write = (chunk, encoding, next) => { 
    console.log(chunk.toString())
    next()
}

readableStream.pipe(writableStream)

readableStream.push('hi!')
readableStream.push('ho!')

// 使用end() 方法通知已结束写入的可写流
writableStream.end()

// 也可以通过readable事件直接地消费可读流
readableStream.on('readable', () => { 
    console.log(readableStream.read())
})
```

## 如何发送数据到可写流
使用流的write() 方法
writableStream.write('hey!\n')

# Node.js开发环境与生产环境的区别
可以为生产环境和开发环境使用不同的配置。

Node.js 假定其始终运行在开发环境中。 可以通过设置 NODE_ENV=production 环境变量来向 Node.js 发出正在生产环境中运行的信号。

通常通过在 shell 中执行以下命令来完成：

BASH
export NODE_ENV=production

但最好将其放在的 shell 配置文件中（例如，使用 Bash shell 的 .bash_profile），否则当系统重启时，该设置不会被保留。

也可以通过将环境变量放在应用程序的初始化命令之前来应用它：

BASH
NODE_ENV=production node app.js

此环境变量是一个约定，在外部库中也广泛使用。

设置环境为 production 通常可以确保：

日志记录保持在最低水平。
更高的缓存级别以优化性能。
例如，如果 NODE_ENV 未被设置为 production，则 Express 使用的模板库 Pug 会在调试模式下进行编译。 Express 页面会在开发模式下按每个请求进行编译，而在生产环境中则会将其缓存。 还有更多的示例。

可以使用条件语句在不同的环境中执行代码：

JS
if (process.env.NODE_ENV === "development") {
  //...
}
if (process.env.NODE_ENV === "production") {
  //...
}
if(['production', 'staging'].indexOf(process.env.NODE_ENV) >= 0) {
  //...
})

例如，在 Express 应用中，可以使用此工具为每个环境设置不同的错误处理程序：

JS
if (process.env.NODE_ENV === "development") {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})

if (process.env.NODE_ENV === "production") {
  app.use(express.errorHandler())
})

# Node.js中的错误处理
Node.js 中的错误通过异常进行处理。

## 创建异常
使用 throw 关键字创建异常：

JS
throw value

一旦 JavaScript 执行到此行，则常规的程序流会被停止，且控制会被交给最近的异常处理程序。

通常，在客户端代码中，value 可以是任何 JavaScript 值（包括字符串、数字、或对象）。

在 Node.js 中，我们不抛出字符串，而仅抛出 Error 对象。

## 错误对象
错误对象是 Error 对象的实例、或者继承自 Error 类（由 Error 核心模块提供）：

JS
throw new Error('错误信息')

或：

JS
class NotEnoughCoffeeError extends Error {
  //...
}
throw new NotEnoughCoffeeError()

## 异常处理
异常处理程序是 try/catch 语句。

try 块中包含的代码行中引发的任何异常都会在相应的 catch 块中处理：

JS
try {
  //代码行
} catch (e) {}

在此示例中，e 是异常值。

可以添加多个处理程序，它们可以捕获各种错误。

## 捕获未捕获的异常
如果在程序执行过程中引发了未捕获的异常，则程序会崩溃。
若要解决此问题，则监听 process 对象上的 uncaughtException 事件：

```javascript
process.on('uncaughtException', err => { 
    console.error('有一个未捕获的错误', err)
    process.exit(1) // 强制性的 (根据Node.js文档)
})
```
无需为此导入 process 核心模块，因为它是自动注入的。

## Promise异常
使用 promise 可以链接不同的操作，并在最后处理错误：

JS
doSomething1()
  .then(doSomething2)
  .then(doSomething3)
  .catch(err => console.error(err))

你怎么知道错误发生在哪里？ 你并不知道，但是你可以处理所调用的每个函数（doSomethingX）中的错误，并且在错误处理程序内部抛出新的错误，这就会调用外部的 catch 处理程序：

JS
const doSomething1 = () => {
  //...
  try {
    //...
  } catch (err) {
    //... 在本地处理
    throw new Error(err.message)
  }
  //...
}