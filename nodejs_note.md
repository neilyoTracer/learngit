1. path.resolve和path.join和path.normalize的区别
resolve([...paths])
把传入参数，从右边开始，直到组合成**绝对路径**为止
example:
```javascript
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
join([...paths])
按照传入的参数，就像linux切换目录那样，显示最终的地址
使用特定于平台的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。
零长度的 path 片段被忽略。 如果连接的路径字符串是零长度字符串，则将返回 '.'，表示当前工作目录。
example:

```javascript
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```

path.normalize(path)
path.normalize() 方法规范化给定的 path
example:
```javascript
// linux
path.normalize('/foo/bar//baz/asdf/quux/..');
// 返回: '/foo/bar/baz/asdf'

// windows
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// 返回: 'C:\\temp\\foo\\'


```

# Node.js简介
Node.js 是一个开源和跨平台的 **JavaScript运行时环境**。 它几乎是任何类型项目的流行工具！
Node.js 在浏览器之外运行 V8 JavaScript 引擎（Google Chrome 的内核）。 这使得 Node.js 的性能非常好。

Node.js 应用程序在**单个进程**中运行，无需为每个请求创建新的线程。 
Node.js 在其标准库中提供了一组异步的 I/O 原语，以防止 JavaScript 代码阻塞，
通常，Node.js 中的库是使用**非阻塞**范式编写的，使得阻塞行为成为异常而不是常态。
当 Node.js 执行 I/O 操作时（比如从网络读取、访问数据库或文件系统），Node.js 将在响应返回时恢复操作
(而不是阻塞线程和浪费 CPU 周期等待)
这允许 Node.js 使用单个服务器处理数千个并发连接，而​​不会引入管理线程并发（这可能是错误的重要来源）的负担。
Node.js 具有独特的优势，因为数百万为浏览器编写 JavaScript 的前端开发者现在无需学习完全不同的语言，就可以编写除客户端代码之外的服务器端代码。

在 Node.js 中，可以毫无问题地使用新的 ECMAScript 标准，因为你不必等待所有用户更新他们的浏览器，
你负责通过更改 Node.js 版本来决定使用哪个 ECMAScript 版本，你还可以通过运行带有标志的 Node.js 来启用特定的实验性功能。

## 大量的库
npm 以其简单的结构帮助 Node.js 生态系统蓬勃发展，现在 npm 仓库托管了超过 1,000,000 个开源包，你可以自由使用。

## Node.js应用程序的示例
Node.js 中最常见的 Hello World 示例是 Web 服务器：
```javascript
const http = require('http')
const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => { 
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello Node.js')
})

server.listen(port, hostname, () => { 
    console.log(`Server running at http://${hostname}:${port}/`)
})

```
要运行此代码片段，则将其另存为 server.js 文件并在终端中运行 node server.js。

## Node.js框架和工具
Node.js 是一个底层平台。 为了让开发者的工作变得轻松有趣，社区在 Node.js 上构建了数千个库。

许多随着时间的推移而成为流行的选择。 以下是值得学习的部分列表：
1. [AdonisJS](https://adonisjs.com/) 基于 **TypeScript** 的全功能框架，高度关注开发者的效率、稳定和信任。Adonis 是最快的 Node.js Web 框架之一。
2. [Egg.js](https://eggjs.org/en/) 使用 Node.js 和 Koa 构建更好的企业级框架和应用程序的框架。
3. [Express](https://expressjs.com/) 提供了最简单而强大的方式来创建 Web 服务器。它的极简主义方法、没有偏见、专注于服务器的核心功能，是其成功的关键。
4. [Fastify](https://fastify.io/) 高度专注于以最少的开销和强大的插件架构提供最佳开发者体验的 Web 框架。Fastify 是最快的 Node.js Web 之一 构架。
5. [FeatherJS](https://feathersjs.com/) Feathers 是轻量级的网络框架，用于使用 JavaScript 或 TypeScript 创建实时应用程序和 REST API。在几分钟内构建原型，在几天内构建可用于生产的应用程序。
6. [Gatsby](https://www.gatsbyjs.com/) 基于 React、由 GraphQL 驱动的静态网站生成器，具有非常丰富的插件和启动器生态系统。
7. [hapi](https://hapijs.com/) 用于构建应用程序和服务的富框架，使开发者能够专注于编写可重用的应用程序逻辑，而不是花时间搭建基础设施。
8. [koa](http://koajs.com/) 由 Express 背后的同一个团队构建，旨在更简单、更小，建立在多年知识的基础上。新项目的诞生是为了在不破坏现有社区的情况下创建不兼容的更改。
9. [Loopback.io](https://loopback.io/) 使构建需要复杂集成的现代应用程序变得容易。
10. [Meteor](https://meteor.com/) 非常强大的全栈框架，为您提供同构的方法来使用 JavaScript 构建应用程序，在客户端和服务器上共享代码。曾经是提供所有功能的现成工具，现在可以与前端库 React、Vue 和 **Angular** 集成。也可用于创建移动应用程序。
11. [Micro](https://github.com/zeit/micro) 提供了非常轻量级的服务器来创建异步的 HTTP 微服务。
12. [NestJS](https://nestjs.com/) 基于 **TypeScript** 的渐进式 Node.js 框架，用于构建企业级的高效、可靠和可扩展的服务器端应用程序
13. [Next.js](https://nextjs.org/) React 框架，为您提供最佳的开发者体验，包括生产所需的所有功能：混合静态和服务器渲染、TypeScript 支持、智能捆绑、路由预取等。
14. [Nx](https://nx.dev/) 使用 NestJS、Express、React、Angular 等进行全栈大仓开发的工具包！Nx 有助于将您的开发从构建单个应用程序的团队扩展到多个团队协作开发多个应用程序！
15. [Remix](https://remix.run/) Remix 是一个全栈 Web 框架，用于为 web 构建出色的用户体验。它开箱即用，提供构建现代 web 应用程序所需的一切（包括前端和后端）并将其部署到任何基于 JavaScript 的运行时环境（包括 Node.js）。
16. [Sapper](https://sapper.svelte.dev/) Sapper 是用于构建各种规模的 Web 应用程序的框架，具有优美的开发体验和灵活的基于文件系统的路由。提供 SSR 等等！
17. [Socket.io](https://socket.io/) 构建网络应用的实时通信引擎。
18. [Strapi](https://strapi.io/) Strapi 是灵活开源的 Headless CMS，让开发者可以自由选择他们喜欢的工具和框架，同时还允许编辑人员轻松管理和分发他们的内容。通过插件系统使管理面板和 API 可扩展，Strapi 使世界上最大的公司能够在构建精美的数字体验的同时加速内容交付。



# Node.js 简史(2009 ～ 2021)
信不信由你，Node.js 诞生才 13 年。

相比之下，JavaScript 已存在 26 年 ，而 Web 则是 33 年。

13 年在技术领域并不是很长的时间，但 Node.js 似乎已经存在很久了。

在这篇文章中，我们绘制了 Node.js 历史的大图，以透视事物。

## 一点历史
JavaScript 是一门编程语言，由 Netscape 创建，作为脚本工具用于在其浏览器 Netscape Navigator 中操作网页。
Netscape 的部分商业模式是销售 Web 服务器，其中包括一个名为 Netscape LiveWire 的环境，可以使用服务器端 JavaScript 创建动态页面。 
不幸的是，Netscape LiveWire 并不是很成功，服务器端 JavaScript 直到最近才流行起来，因为 Node.js 的引入。
引领 Node.js 兴起的一个关键因素是时机。 
就在几年前，由于**Web 2.0**应用程序（如 Flickr、Gmail 等）向世界展示了网络上的现代体验，JavaScript 才开始被视为一门更严肃的语言。
随着许多浏览器竞相为用户提供最佳性能，JavaScript 引擎也变得相当出色。 主流浏览器背后的开发团队努力为 JavaScript 提供更好的支持，并找到使 JavaScript 运行得更快的方法。 
Node.js 在引擎盖下使用的引擎 V8（也称为 Chrome V8，因为它是 Chromium 项目的开源 JavaScript 引擎），由于这场竞争而得到了显着改进。

Node.js 恰好是在正确的时间和地点构建的，但运气并不是它今天流行的唯一原因。 它为 JavaScript 服务端开发引入了很多创新思维和方法，已经帮助了很多开发者。
### 2009
Node.js 诞生
第一版的 npm 被创建
### 2010
Express 诞生
Socket.io 诞生
### 2011
npm 发布 1.0 版本
较大的公司（LinkedIn、Uber 等）开始采用 Node.js
hapi 诞生
### 2012
普及速度非常快
### 2013
第一个使用 Node.js 的大型博客平台：Ghost
Koa 诞生
### 2014
大分支：io.js 是 Node.js 的一个主要分支，目的是引入 ES6 支持并加快推进速度
### 2015
Node.js 基金会 诞生
IO.js 被合并回 Node.js
npm 引入私有模块
Node.js 4（以前从未发布过 1、2 和 3 版本）
### 2016
leftpad 事件
Yarn 诞生
Node.js 6
### 2017
npm 更加注重安全性
Node.js 8
HTTP/2
V8 在其测试套件中引入了 Node.js，除了 Chrome 之外，Node.js 正式成为 JS 引擎的标杆
每周 30 亿次 npm 下载
### 2018
Node.js 10
ES 模块 .mjs 实验支持
Node.js 11
### 2019
Node.js 12
Node.js 13
### 2020
Node.js 14
Node.js 15
### 2021
Node.js 16
Node.js 17

# 如何退出Node.js程序
有多种方法可以终止 Node.js 应用程序。
当在控制台中运行程序时，可以用 ctrl-C 关闭它，但我们这里要讨论的是以编程方式退出。
让我们从最极端的开始，看看为什么最好不要使用它。
process 核心模块提供了一种方便的方法，允许您以编程方式退出 Node.js 程序：process.exit()。
当 Node.js 运行此行时，进程立即被强制终止。
这意味着任何待处理的回调、任何仍在发送的网络请求、任何文件系统访问、或者正在写入 stdout 或 stderr 的进程，所有这些都将立即被非正常地终止。
如果这对您来说没问题，您可以传入一个整数，向操作系统发出退出代码的信号：process.exit(1)
很多时候我们使用 Node.js 启动服务器，比如这个 HTTP 服务器：
```javascript   
const express = require('express')
const app = express()

app.get('/', (req, res) => { 
    res.send('Hi!')
})

app.listen(3000, () => console.log('Server ready'))
```
**Express 是一个在底层使用 http 模块的框架，app.listen() 返回一个 http 实例。 如果您需要使用 HTTPS 为您的应用程序提供服务，则使用 https.createServer，因为 app.listen 仅使用 http 模块。**
这个程序永远不会结束。 如果您调用 process.exit()，则任何当前待处理或正在运行的请求都将被中止。 这并不好。

在这种情况下，您需要向命令发送 SIGTERM 信号，并使用进程信号句柄处理它：

**注意：process 不需要 "require"，它是自动可用的。**
```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => { 
    res.send('Hi!')
})

app.listen(3000, () => console.log('Server ready'))

process.on('SIGTERM', () => { 
    server.close(() => console.log('Process terminated'))
})
```
**什么是信号？信号是一个 POSIX 互通系统：发送给进程的通知，以便通知它发生的事件。**
SIGKILL 是告诉进程立即终止的信号，理想情况下会像 process.exit() 一样。
SIGTERM 是告诉进程正常终止的信号。 这是从 upstart 或 supervisord 等进程管理器发出的信号。
你可以从程序内部，在另一个函数中发送这个信号：
process.kill(process.pid, 'SIGTERM')

或者从另一个 Node.js 运行的程序、或者从您的系统中运行的任何其他应用程序（知道您要终止的进程的 PID）。

# 如何使用Node.js REPL
node
## 探索Javascript对象
尝试输入 JavaScript 类的名称，例如 Number，添加一个点号并按下 tab。
REPL 会打印可以在该类上访问的所有属性和方法：
## 探索全局对象
通过输入 global. 并按下 tab，可以检查可以访问的全局变量：
## 点命令
.help: 显示点命令的帮助。
.editor: 启用编辑器模式，可以轻松地编写多行 JavaScript 代码。当处于此模式时，按下 ctrl-D 可以运行编写的代码。
.break: 当输入多行的表达式时，输入 .break 命令可以中止进一步的输入。相当于按下 ctrl-C。
.clear: 将 REPL 上下文重置为空对象，并清除当前正在输入的任何多行的表达式。
.load: 加载 JavaScript 文件（相对于当前工作目录）。
.save: 将在 REPL 会话中输入的所有内容保存到文件（需指定文件名）。
.exit: 退出 REPL（相当于按下两次 ctrl-C）

# Node.js从命令行接受参数
当使用以下命令调用 Node.js 应用程序时，可以传入任意数量的参数：
node app.js
参数可以是独立的，也可以具有键和值。
node app.js joe
node app.js name=joe
这会改变在 Node.js 代码中获取参数值的方式。
获取参数值的方法是使用 Node.js 中内置的 process 对象。
它公开了 argv 属性，该属性是一个包含所有命令行调用**参数的数组**。
第一个参数是 node 命令的完整路径。
第二个参数是正被执行的文件的完整路径。
所有其他的参数从第三个位置开始。

如果是这种情况：
node app.js name=joe
则 args[0] 是 name=joe，需要对其进行解析。 最好的方法是使用 minimist 库，该库有助于处理参数
const args = require('minimist')(process.argv.slice(2))
args['name'] //joe
但是需要在每个参数名称之前使用双破折号：

BASH
node app.js --name=joe

# 使用Node.js输出到命令行

## console.log
可以通过传入变量和格式说明符来格式化用语。
console.log('我的%s已经%d岁', '猫', 2)
%s 会格式化变量为字符串
%d 会格式化变量为数字
%i 会格式化变量为其整数部分
%o 会格式化变量为对象
console.log('%o', Number)

## 清空控制台
console.clear() 会清除控制台（其行为可能取决于所使用的控制台）。


## 元素计数
console.count() 是一个便利的方法
```javascript
const oranges = ['橙子', '橙子']
const apples = ['苹果']
oranges.forEach(fruit => {
  console.count(fruit)
})
apples.forEach(fruit => {
  console.count(fruit)
})
```

## 打印堆栈踪迹
在某些情况下，打印函数的调用堆栈踪迹很有用，可以回答以下问题：如何到达代码的那一部分？
可以使用 console.trace() 实现：
```javascript
const function2 = () => console.trace()
const function1 = () => function2()
function1()
```

## 计算耗时
可以使用time() 和 timeEnd() 轻松地计算函数运行所需的时间
```javascript
const doSomething = () => console.log('测试')
const measureDoingSomething = () => {
  console.time('doSomething()')
  //做点事，并测量所需的时间。
  doSomething()
  console.timeEnd('doSomething()')
}
measureDoingSomething()
```

## stdout和stderr
console.log 非常适合在控制台中打印消息。 这就是所谓的标准输出（或称为 stdout）。

console.error 会打印到 stderr 流。

它不会出现在控制台中，但是会出现在错误日志中。

## 为输出着色
可以使用转义序列在控制台中为文本的输出着色。 转义序列是一组标识颜色的字符。
例如:
console.log('\x1b[33m%s\x1b[0m', '你好')
当然，这是执行此操作的底层方法。 为控制台输出着色的最简单方法是使用库。 [Chalk](https://github.com/chalk/chalk) 是一个这样的库，除了为其着色外，它还有助于其他样式的设置（例如使文本变为粗体、斜体或带下划线）。

可以使用 npm install chalk 进行安装，然后就可以使用它：
```javascript
const chalk = require('chalk')
console.log(chalk.yellow('你好'))
```
与尝试记住转义代码相比，使用 chalk.yellow 方便得多，并且代码更具可读性。

更多的用法示例，详见上面的项目链接。


## 创建进度条
[Progress](https://www.npmjs.com/package/progress) 是一个很棒的软件包，可在控制台中创建进度条。 使用 npm install progress 进行安装。
以下代码段会创建一个 10 步的进度条，每 100 毫秒完成一步。 当进度条结束时，则清除定时器：

```javascript
const ProgressBar = require('progress')

const bar = new ProgressBar(':bar', { total: 10 })
const timer = setInterval(() => { 
    bar.tick()
    if(bar.complete) { 
        clearInterval(timer)
    }
}, 100)
```


# 在Node.js中从命令行接受输入
如何使 Node.js CLI 程序具有交互性？

从版本 7 开始，Node.js 提供了 [readline 模块](http://nodejs.cn/api/readline.html)来执行以下操作：每次一行地从可读流（例如 process.stdin 流，在 Node.js 程序执行期间该流就是终端输入）获取输入。
```javascript
const readline = require('readline').createInterface({ 
    input: process.stdin,
    output: process.stdout
})

readline.question(`你叫什么名字?`, name => { 
    console.log(`你好 ${name}!`)
    readline.close()
})
```
这段代码会询问用户名，当输入了文本并且用户按下回车键时，则会发送问候语。
question() 方法会显示第一个参数（即问题），并等待用户的输入。 当按下回车键时，则它会调用回调函数。
在此回调函数中，关闭了 readline 接口。

readline 还提供了其他几个方法，详见上面的文档链接。

如果需要密码，则最好不要回显密码，而是显示 * 符号。

最简单的方式是使用 [readline-sync](https://www.npmjs.com/package/readline-sync) 软件包，其在 API 方面非常相似。

[Inquirer.js](https://github.com/SBoudrias/Inquirer.js) 软件包则提供了更完整、更抽象的解决方案。

可以使用 npm install inquirer 进行安装，然后复用上面的代码如下
```javascript
const inquirer = require('inquier')

var questions = [
    { 
        type: 'input',
        name: 'name',
        message: '你叫什么名字?'
    }
]

inquirer.prompt(questions).then(answer => { 
    console.log(`你好 ${answers['name']}!`)
})

```
Inquirer.js 可以执行许多操作，例如询问多项选择、展示单选按钮、确认等。
所有的可选方案都值得了解，尤其是 Node.js 提供的内置方案，但是如果打算将 CLI 输入提升到更高的水平，则 Inquirer.js 是更优的选择。

# 使用exports从Node.js文件中公开功能
Node.js 具有内置的模块系统。
Node.js 文件可以导入其他 Node.js 文件公开的功能。
当想要导入某些东西时，使用

const library = require('./library')

可以导入存在于当前文件夹中的 library.js 文件中公开的功能。

在此文件中，必须先公开功能，然后其他文件才能将其导入。

默认情况下，文件中定义的任何其他对象或变量都是私有的，不会公开给外界。
这就是 module 系统提供的 module.exports API 可以做的事。
当将对象或函数赋值为新的 exports 属性时，这就是要被公开的内容，因此，可以将其导入应用程序的其他部分或其他应用程序中。

可以通过两种方式进行操作。

第一种方式是将对象赋值给 module.exports（这是模块系统提供的对象），这会使文件只导出该对象：
```javascript
const car = { brand: 'Ford', model: 'Fiesta' }
module.exports = car

// 在另一个文件中
const car = require('./car')
```
第二种方式是将要导出的对象添加为 exports 的属性。这种方式可以导出多个对象、函数或数据：

```javascript
exports.car = { 
    brand: 'Ford',
    model: 'Fiesta'
}

const items = require('./items')
items.car
```

# npm 包管理器简介
## npm 简介
npm 是 Node.js 标准的软件包管理器。

在 2017 年 1 月时，npm 仓库中就已有超过 350000 个软件包，这使其成为世界上最大的单一语言代码仓库，并且可以确定几乎有可用于一切的软件包。

它起初是作为下载和管理 Node.js 包依赖的方式，但其现在也已成为前端 JavaScript 中使用的工具。

npm 有很多功能。
## 安装单个软件包
BASH
npm install <package-name>

通常会在此命令中看到更多标志：

--save 安装并添加条目到 package.json 文件的 dependencies。
--save-dev 安装并添加条目到 package.json 文件的 devDependencies。
区别主要是，devDependencies 通常是开发的工具（例如测试的库），而 dependencies 则是与生产环境中的应用程序相关。

## 更新软件包
npm update <package-name>

## 运行任务
package.json 文件支持一种用于指定命令行任务（可通过使用以下方式运行）的格式：
npm run <task-name>
JSON
{
  "scripts": {
    "start-dev": "node lib/server-development",
    "start": "node lib/server-production"
  },
}

使用此特性运行 Webpack 是很常见的：

JSON
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js",
  },
}
因此可以运行如下，而不是输入那些容易忘记或输入错误的长命令：
npm run watch
npm run dev
npm run prod

# npm 将软件包安装到哪里
当使用 npm 安装软件包时，可以执行两种安装类型：

本地安装
全局安装
默认情况下，当输入 npm install 命令时，例如：

BASH
npm install lodash

软件包会被安装到当前文件树中的 node_modules 子文件夹下。
在这种情况下，npm 还会在当前文件夹中存在的 package.json 文件的 dependencies 属性中添加 lodash 条目。

使用 -g 标志可以执行全局安装：

BASH
npm install -g lodash

> npm root -g 命令会告知其在计算机上的确切位置。

* 在 macOS 或 Linux 上，此位置可能是 /usr/local/lib/node_modules。 在 Windows 上，可能是 C:\Users\YOU\AppData\Roaming\npm\node_modules。
但是，如果使用 nvm 管理 Node.js 版本，则该位置会有所不同。

例如，使用 nvm，则软件包的位置可能为 /Users/joe/.nvm/versions/node/v8.9.0/lib/node_modules。

# 如何使用或执行npm 安装的软件包
当使用 npm 将软件包安装到 node_modules 文件夹中或全局安装时，如何在 Node.js 代码中使用它？

假设使用以下命令安装了流行的 JavaScript 实用工具库 lodash：

BASH
npm install lodash

这会把软件包安装到本地的 node_modules 文件夹中。

若要在代码中使用它，则只需使用 require 将其导入到程序中：

JS
const _ = require('lodash')
如果软件包是可执行文件，该怎么办？

在这种情况下，它会把可执行文件放到 node_modules/.bin/ 文件夹下。

验证这一点的简单示例是 cowsay。

cowsay 软件包提供了一个命令行程序，可以执行该程序以使母牛说些话（以及其他动物也可以说话）。

当使用 npm install cowsay 安装软件包时，它会在 node_modules 文件夹中安装自身以及一些依赖包：
可以输入 ./node_modules/.bin/cowsay 来运行它，但是最新版本的 npm（自 5.2 起）中包含的 npx 是更好的选择。 只需运行：
npx cowsay

# package.json指南
它有什么用途？应该了解它的什么，可以使用它完成哪些有趣的事情？

**package.json** 文件是项目的清单。 它可以做很多完全互不相关的事情。 
例如，它是用于工具的配置中心。 它也是 npm 和 yarn 存储所有已安装软件包的名称和版本的地方。
这是一个示例的 package.json 文件：

JSON
{}

它是空的！ 对于应用程序，package.json 文件中的内容没有固定的要求。 唯一的要求是必须遵守 JSON 格式，否则，尝试以编程的方式访问其属性的程序则无法读取它。
这是另一个 package.json：

JSON
{
  "name": "nodejs_cn"
}

它定义了 name 属性，用于告知应用程序或软件包的名称。

这是一个更复杂的示例，该示例是从 Vue.js 应用程序示例中提取的：
这里有很多东西：

> version 表明了当前的版本。
> name 设置了应用程序/软件包的名称。
> description 是应用程序/软件包的简短描述。
> main 设置了应用程序的入口点。
> private 如果设置为 true，则可以防止应用程序/软件包被意外地发布到 npm。
> scripts 定义了一组可以运行的 node 脚本。
> dependencies 设置了作为依赖安装的 npm 软件包的列表。
> devDependencies 设置了作为开发依赖安装的 npm 软件包的列表。
> engines 设置了此软件包/应用程序在哪个版本的 Node.js 上运行。
> browserslist 用于告知要支持哪些浏览器（及其版本）。

## 软件包版本
在上面的描述中，已经看到类似以下的版本号：〜3.0.0 或 ^0.13.0。 它们是什么意思，还可以使用哪些其他的**版本说明符**？
该符号指定了软件包能从该依赖接受的更新。

鉴于使用了 semver（语义版本控制），所有的版本都有 3 个数字，第一个是主版本，第二个是次版本，第三个是补丁版本，详见规则。

还可以在范围内组合以上大部分内容，例如：1.0.0 || >=1.1.0 <1.2.0，即使用 1.0.0 或从 1.1.0 开始但低于 1.2.0 的版本。

# package-lock.json文件
在版本 5 中，npm 引入了 package-lock.json 文件。

那是什么？您可能知道 package.json 文件，它更常见并且存在的时间更长。

该文件旨在跟踪被安装的每个软件包的确切版本，以便产品可以以相同的方式被 100％ 复制（即使软件包的维护者更新了软件包）。

这解决了 package.json 一直尚未解决的特殊问题。 在 package.json 中，可以使用 semver 表示法设置要升级到的版本（补丁版本或次版本），例如：

* 如果写入的是 〜0.13.0，则只更新补丁版本：即 0.13.1 可以，但 0.14.0 不可以。
* 如果写入的是 ^0.13.0，则要更新补丁版本和次版本：即 0.13.1、0.14.0、依此类推。
* 如果写入的是 0.13.0，则始终使用确切的版本。

无需将 node_modules 文件夹（该文件夹通常很大）提交到 Git，当尝试使用 npm install 命令在另一台机器上复制项目时，如果指定了 〜 语法并且软件包发布了补丁版本，则该软件包会被安装。 ^ 和次版本也一样。

如果指定确切的版本，例如示例中的 0.13.0，则不会受到此问题的影响。

因此，原始的项目和新初始化的项目实际上是不同的。 即使补丁版本或次版本不应该引入重大的更改，但还是可能引入缺陷。

package-lock.json 会固化当前安装的每个软件包的版本，当运行 npm install时，npm 会使用这些确切的版本。
这个概念并不新鲜，其他编程语言的软件包管理器（例如 PHP 中的 Composer）使用类似的系统已有多年。

package-lock.json 文件需要被提交到 Git 仓库，以便被其他人获取（如果项目是公开的或有合作者，或者将 Git 作为部署源）。
当运行 npm update 时，package-lock.json 文件中的依赖的版本会被更新。

# 查看npm包安装的版本
若要查看所有已安装的 npm 软件包（包括它们的依赖包）的最新版本，则：

BASH
npm list

npm list -g 也一样，但适用于全局安装的软件包。

若要仅获取顶层的软件包（基本上就是告诉 npm 要安装并在 package.json 中列出的软件包），则运行 npm list --depth=0：
也可以通过指定名称来获取特定软件包的版本：

BASH
❯ npm list cowsay
/Users/joe/dev/node/cowsay
└── cowsay@1.3.1

这也适用于安装的软件包的依赖：

BASH
❯ npm list minimist
/Users/joe/dev/node/cowsay
└─┬ cowsay@1.3.1
  └─┬ optimist@0.6.1
    └── minimist@0.0.10

如果要查看软件包在 npm 仓库上最新的可用版本，则运行 npm view [package_name] version：

BASH
❯ npm view cowsay version

1.3.1

# 将所有Node.js依赖包更新到最新版本
当使用 npm install <packagename> 安装软件包时，该软件包最新的可用版本会被下载并放入 node_modules 文件夹中，并且还会将相应的条目添加到当前文件夹中存在的 package.json 和 package-lock.json 文件中。
npm 会核计依赖，并安装这些依赖最新的可用版本。

假设要安装 cowsay，这是一个很酷的命令行工具，可以让母牛说话。

当 npm install cowsay 时，此条目会被添加到 package.json 文件中：
{
  "dependencies": {
    "cowsay": "^1.3.1"
  }
}

以下是 package-lock.json 的片段，为方便查看，在其中删除了嵌套的依赖：
{
  "requires": true,
  "lockfileVersion": 1,
  "dependencies": {
    "cowsay": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/cowsay/-/cowsay-1.3.1.tgz",
      "integrity": "sha512-3PVFe6FePVtPj1HTeLin9v8WyLl+VmM1l1H/5P+BTTDkMAjufp+0F9eLjzRnOHzVAYeIYFF5po5NjRrgefnRMQ==",
      "requires": {
        "get-stdin": "^5.0.1",
        "optimist": "~0.6.1",
        "string-width": "~2.1.1",
        "strip-eof": "^1.0.0"
      }
    }
  }
}

现在，这两个文件告诉我们，已安装了 cowsay 的 1.3.1 版本，并且更新的规则是 ^1.3.1（这对于 npm 版本控制规则意味着 npm 可以更新到补丁版本和次版本：即 1.3.2、1.4.0、依此类推）。
如果有新的次版本或补丁版本，并且输入了 npm update，则已安装的版本会被更新，并且 package-lock.json 文件会被新版本填充。
package.json 则保持不变。

若要发觉软件包的新版本，则运行 > npm outdated。

以下是一个仓库中一些过时的软件包的列表，该仓库已很长时间没有更新：

这些更新中有些是主版本。 运行 npm update 不会更新那些版本。 主版本永远不会被这种方式更新，因为它们（根据定义）会引入重大的更改，npm 希望为你减少麻烦。

若要将所有软件包更新到新的主版本，则全局地安装 npm-check-updates 软件包：

然后运行：

BASH
ncu -u

这会升级 package.json 文件的 dependencies 和 devDependencies 中的所有版本，以便 npm 可以安装新的主版本。

现在可以运行更新了：

BASH
npm update

如果只是下载了项目还没有 node_modules 依赖包，并且想先安装新的版本，则运行：

BASH
npm install

# 使用npm的语义版本控制
如果 Node.js 软件包中有一件很棒的事情，那就是它们都同意使用语义版本控制作为版本编号。

语义版本控制的概念很简单：所有的版本都有 3 个数字：x.y.z。

 * 第一个数字是主版本。
 * 第二个数字是次版本。
 * 第三个数字是补丁版本。
当发布新的版本时，不仅仅是随心所欲地增加数字，还要遵循以下规则：

 * 当进行不兼容的 API 更改时，则升级主版本。
 * 当以向后兼容的方式添加功能时，则升级次版本。
 * 当进行向后兼容的缺陷修复时，则升级补丁版本。
该约定在所有编程语言中均被采用，每个 npm 软件包都必须遵守该约定，这一点非常重要，因为整个系统都依赖于此。

为什么这么重要？
因为 npm 设置了一些规则，可用于在 package.json 文件中选择要将软件包更新到的版本（当运行 npm update 时）。

规则使用了这些符号：

1. ^
2. ~
3. >
4. >=
5. <
6. <=
7. =
8. -
9. ||
这些规则的详情如下：
^: **只会执行不更改最左边非零数字的更新。** 如果写入的是 ^0.13.0，则当运行 npm update 时，可以更新到 0.13.1、0.13.2 等，但不能更新到 0.14.0 或更高版本。 如果写入的是 ^1.13.0，则当运行 npm update 时，可以更新到 1.13.1、1.14.0 等，但不能更新到 2.0.0 或更高版本。
~: 如果写入的是 〜0.13.0，则当运行 npm update 时，会更新到补丁版本：即 0.13.1 可以，但 0.14.0 不可以。
>: 接受高于指定版本的任何版本。
>=: 接受等于或高于指定版本的任何版本。
<=: 接受等于或低于指定版本的任何版本。
<: 接受低于指定版本的任何版本。
=: 接受确切的版本。
-: 接受一定范围的版本。例如：2.1.0 - 2.6.2。
||: 组合集合。例如 < 2.1 || > 2.6。
可以合并其中的一些符号，例如 1.0.0 || >=1.1.0 <1.2.0，即使用 1.0.0 或从 1.1.0 开始但低于 1.2.0 的版本。

还有其他的规则：

无符号: 仅接受指定的特定版本（例如 1.2.1）。
latest: 使用可用的最新版本。


# 卸载 npm 软件包
若要卸载之前在本地安装（在 node_modules 文件夹使用 npm install <package-name>）的软件包，则从项目的根文件夹（包含 node_modules 文件夹的文件夹）中运行：

BASH
npm uninstall <package-name>

如果使用 -S 或 --save 标志，则此操作还会移除 package.json 文件中的引用。

如果程序包是开发依赖项（列出在 package.json 文件的 devDependencies 中），则必须使用 -D 或 --save-dev 标志从文件中移除：

BASH
npm uninstall -S <package-name>
npm uninstall -D <package-name>

如果该软件包是全局安装的，则需要添加 -g 或 --global 标志：

BASH
npm uninstall -g <package-name>

例如：

BASH
npm uninstall -g webpack

可以在系统上的任何位置运行此命令，因为当前所在的文件夹无关紧要。

#


