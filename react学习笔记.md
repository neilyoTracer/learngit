# setState

1. **setState()是一个异步方法**，React会将多个setState()方法合并成一个调用，也就是说，在调用setState()后，不能马上反映出状态的变化。例如this.state.text的值原先是“提交”，在像下面这样更新状态后，打印出的值仍然是“提交”

``` javascript
this.setState({
    text: "点击"
});
console.log(this.state.text); //"提交"
```

2. setState()方法在将新数据合并到当前状态之后，就会自动调用render()方法，驱动组件重新渲染。由此可知，**在render()方法中不允许调用setState()方法**，以免造成死循环。

# props

1. 读取， 由于React组件相当于一个纯函数，因此props不能被修改，它的属性都是只读的，像下面这样赋值势必会引起组件的副作用，因而React会马上终止程序，直接抛出错误。

``` javascript
class Btn extends React.Component {
    constructor(props) {
        super(props);
        props.name = "freedom"; //错误
    }
}
```

2. defaultProps, 组件的静态属性defaultProps可为props指定默认值
3. children, 每个props都会包含一个特殊的属性：children，表示组件的内容，即所包裹的子组件。官方通过React.Children给出了专门处理children的辅助方法,eg:

map()           当children不是null或undefined时，遍历children并返回一个数组，否则返回null或undefined
forEach()       功能与map()类似，但不返回数组
count()         计算children的数量
only()          当children是一个React元素时，返回该元素，否则抛错
toArray()       将children转换成数组

4. 属性校验

``` javascript
static propTypes = {
    formData: PropTypes.object.isRequired,
    saveFormData: PropTypes.func.isRequired,
    saveImg: PropTypes.func.isRequired,
    clearData: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired
}
```

# 生命周期

组件的生命周期（Life Cycle）包含三个阶段：**挂载（Mounting）**、**更新（Updating）**和**卸载（Unmounting)**

1. 挂载(Mounting)

  a. constructor() 在生命周期中，类的构造函数constructor()会率先被执行，用于初始化组件的状态、接收外部传递进来的数据、绑定成员方法的this指向等工作。
  b. componentWillMount() 方法会运行在render()之前，它是渲染之前的回调函数。不过，由于在这个方法中执行的任务都能提前到constructor()中，因此实际项目中很少会用到它。
  c. 它是一个无副作用的纯函数，可根据组件的props和state得到一个React元素、null或false等返回值，**并且在render()方法中不能调用改变组件状态的this. setState()方法**。**注意: 将元素渲染到页面DOM中的工作都由React负责，而不是render()方法。**
  d. componentDidMount() 此时组件已被挂载到页面中，可以执行DOM相关的操作，例如异步读取服务器中的数据并填充到组件中、调用jQuery代码等

``` javascript
class Btn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name
        };
    }
    componentWillMount() {
        this.setState({
            age: 28
        });
    }
    render() {
        return <button > {
            this.state.name
        } < /button>;
    }
    componentDidMount() {
        $.post("server.php", {
            id: 1
        }, json => {
            this.setState({
                age: json.data.age
            });
        }, "json");
    }
}
```

2. 更新(Updating) 

  引起组件更新（即重新渲染）的方式有**三种**
  第一种，是由父组件向下传递props（即调用父组件的render()方法）引起的更新
   依次会调用五个方法：componentWillReceiveProps()、shouldComponentUpdate()、componentWillUpdate()、render()和componentDidUpdate()。
  第二种，通过改变自身state（即调用this. setState()方法）引起的更新，会忽略componentWillReceiveProps()方法，只执行四个回调函  数。
  第三种，通过组件的forceUpdate()方法强制更新，只有后三个回调函数会被执行。

``` javascript
class Btn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "strick"
        }
    }

    dot() {
        this.setState({
            name: "freedom"
        });
        this.forceUpdate(); // 强制更新
    }

    @deprecate
    componentWillReceiveProps(nextProps) {}
    @now
    static getDerivedStateFromProps(nextProps, prevState) {
        return object || null;
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    @deprecate
    componentWillUpdate(nextProps, nextState) {}
    @now
    getSnapshotBeforeUpdate(prevProps, prevState) {
        return param;
    }

    render() {
        return <button onClick = {
            this.dot.bind(this)
        } > {
            this.state.name
        } < /button>
    }
    componentDidUpdate(prevProps, prevState, param ? ) {}
}
```

   1. componentWillReceiveProps(nextProps) 先比较nextProps和this. props中的值是否相同，再决定是否执行同步... 为了避免进入一个死循环，在调用this. setState()方法更新组件时就不会触发它
   2. shouldComponentUpdate(nextProps, nextState) 通过比较nextProps、nextState和组件当前的this. props、this. state能得出一个布尔类型的返回结果。
   3. componentWillUpdate(nextProps, nextState) 和 componentDidUpdate(prevProps, prevState) componentWillUpdate()和componentDidUpdate()分别运行在render()之前和之后，它们都能接收2个参数，前者提供更新后的props和state，后者提供更新前的props和state。
   4. 在componentWillUpdate()中，不能调用this. setState()方法，以免发生不必要的死循环。最新版本React中已经废弃**

3. 卸载(Unmounting)

  componentWillUnmount

4. 流程图 

  见桌面图片

5. **过时和新增的回调方法**

   a. deprecated componentWillMount()、componentWillReceiveProps()和componentWillUpdate()
   b. 新增的方法

      ### static getDerivedStateFromProps(nextProps, prevState) 
      静态方法getDerivedStateFromProps()用来替代componentWillReceiveProps()。它在render()方法之前触发，包含两个参数：nextProps和prevState，分别表示新的props和旧的state。如果返回一个对象，那么更新state；如果返回null，那么就不更新state
      ### getSnapshotBeforeUpdate(prevProps, prevState) 
      getSnapshotBeforeUpdate()方法用来替代componentWillUpdate()。它在最近一次渲染输出（即更新DOM）之前触发，包含两个参数：prevProps和prevState，分别表示旧的props和旧的state，返回值会成为componentDidUpdate()的第三个参数。

# React和DOM

## ReactDOM

1. findDOMNode() 它只能存在于componentDidMount()和componentDidUpdate()两个回调函数中，在其它地方调用会抛出一个错误

``` javascript
    class Btn extends React.Component {
        render() {
            ReactDOM.findDOMNode(this); //抛出错误  
            return <button > 提交 < /button>;
        }
        componentDidMount() {
            ReactDOM.findDOMNode(this); //<button>提交</button>
        }
    }
```

**有一点要注意，如果组件中的render()返回null或false，那么findDOMNode()只会返回null。**

2. createPortal() 在React v16中，新增了Portal特性，能让组件渲染到父组件以外的DOM节点中。

``` javascript
class Btn extends React.Component {
    render() {
        return ReactDOM.createPortal(this.props.children, document.body);
    }
}
ReactDOM.render( < Btn > < p > 按钮 < /p></Btn > , document.getElementById("container"));
```

## Refs

Refs是一种访问方式，通过它可读取render()方法内生成的组件实例和DOM元素，常用来处理元素的焦点、触发动画、集成第三方DOM库等
**注意，在组件的生命周期中，要让Refs有效，得将其放在componentDidMount()和componentDidUpdate()两个回调函数中才行。虽然Refs能给某些场景带来便利，但是它破坏了React通过props传递数据的典型数据流，因此要尽量避免使用Refs。**

如果要使用Refs的功能，那么就得设置React元素的ref属性，它的值可以是**对象**、**回调函数**和**字符串**

1. 对象 此处的对象是React.createRef()方法的返回值，包含一个current属性，而该属性指向的正是要读取的组件实例或DOM元素。

``` javascript
class Btn extends React.Component {
    constructor(props) {
        super(props);
        this.myBtn = React.createRef();
    }

    render() {
        return <button ref = {
            this.myBtn
        } > 提交 < /button>
    }

    componentDidMount() {
        let btn = this.myBtn.current;
        console.log(btn);
    }
}
```

步骤: 
 1. 首先在组件的构造函数中调用React. createRef()；
 2. 再将返回值赋给this. myBtn，这样就能在组件内部的任意位置使用该对象了；
 3. 然后让this. myBtn成为<button>元素的ref属性的值；
 4. 最后在componentDidMount()中就能成功读取到current属性的值，从而完成了一次Refs式的访问

2. 回调函数 这个回调函数能接收一个参数（如下代码所示），当组件被挂载时，参数的值为组件实例或DOM元素；当组件被卸载时，参数的值为null。

``` javascript
class Btn extends React.Component {
    render() {
        return ( <
            button ref = {
                btn => this.myBtn = btn
            } > 提交 < /button>
        )
    }

    componentDidMount() {
        let btn = this.myBtn;
        console.log(btn); //<button>提交</button>
    }
}
```

与前一种使用方式最大的不同是解除了对React. createRef()方法的依赖，在回调函数中直接将其参数赋给this. myBtn，就能得到预期的结果，不用再调用一次current属性。

3. 字符串 @deprecated

``` javascript
class Btn extends React.Component {
    render() {
        return <button ref = "myBtn" > 提交 < /button>;
    }
    componentDidMount() {
        let btn = this.refs.myBtn;
        console.log(btn); //<button>提交</button>
    }
}
```

4. 适用场景

ref属性不仅能像之前示例那样应用于DOM元素上，还能在类组件中使用ref属性，如下代码所示

``` javascript
class Btn extends React.Component {
    render() {
        return <button > 提交 < /button>;
    }
}

class Container extends React.Component {
    render() {
        return <Btn ref = {
            btn => this.myBtn = btn
        } > < /Btn>
    }

    componentDidMount() {
        let btn = this.myBtn;
        console.log(btn); //Btn组件的实例
    }
}
```

**由于函数组件没有实例，因此不能对其添加ref属性**

# 事件

## 注册事件

``` jsx
<button onClick={handle}></button>
```

（1）事件要采用小驼峰的命名法，而不是全部小写，例如onclick要写成onClick。

（2）在JSX中的事件处理程序是一个函数引用，而不是一段字符串，如下代码所示，其中handle()是一个函数。

## 事件传播

***React中的事件最终都会转换成原生事件，但不会注册到某个真实的DOM元素，而是绑定到根元素，使用事件委托技术进行事件代理，再由一个总的事件监听器管理所有的事件处理程序。***

## 事件对象

合成事件是被池化的，在执行完事件处理程序后，其参数（即事件对象）的属性将会被丢弃，例如通过定时器异步调用事件对象的type属性，如下所示。

``` javascript
class Btn extends React.Component {
    handle(e) {
        console.log(e.type); //"click"
        setTimeout(function() {
            console.log(e.type); //null
        }, 0);
    }
    render() {
        return <button onClick = {
            this.handle
        } > 提交 < /button>;
    }
}

handle(e) {
    console.log(e.type); //"click"
    setTimeout(function() {
        console.log(e.type); //"click"
    }, 0);
    e.persist();
}
```

## 事件处理程序的参数

 * 第一种是用箭头函数，如下代码所示，显式地将所有参数传递给事件处理程序。
 

``` javascript
 class Btn extends React.Component {
     handle(e, name) {
         console.log(e, name);
     }
     render() {
         return <button onClick = {
             (e) => this.handle(e, "strick")
         } > 提交 < /button>;
     }
 }
```

 * 第二种是用bind()方法，如下代码所示，事件对象会被隐式的传递过去，并且必须位于事件处理程序参数列表的最后

``` javascript
class Btn extends React.Component {
    handle(name, e) {
        console.log(name, e);
    }
    render() {
        return <button onClick = {
            this.handle.bind(this, "strick")
        } > bind < /button>;
    }
}
```

## 表单

HTML中的表单元素（例如<input>、<select>和<radio>等）在React中都有相应的组件实现，不仅如此，React还将它们分成两种：***受控组件和非受控组件。***

## 受控组件

受控组件（Controlled Component）是指那些受React控制的表单元素，其状态（value、checked等属性）的变更由组件的state管理。对于不同的表单元素，其受控组件的形式会有所差异，接下来会讲解其中的三类。
 1. 文本框
 2. 单选框和复选框
 
``` javascript
 class Radio extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
             gender: ''
         };
        this.handle = this.handle.bind(this);
     }

     handle(e) { 
         this.setState({
             gender: e.target.value
         });
     }

     render() { 
         return ( 
             <>
                <input name="gender" value="1" onChange={this.handle} type="radio" 
                    checked={this.state.gender === '1'} /> 男
                <input name="gender" value="2" onChange={this.handle} type="radio" 
                    checked={this.state.gender === '2'} /> 女
             </>
         );
     }
 }

 class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { colors: [] };        //保存复选框值的数组
    this.handle = this.handle.bind(this);
  }
  handle(e) {
    const { checked, value } = e.target;
    let { colors } = this.state;
    if (checked && !colors.includes(value)) {
      colors.push(value);               //已选中并且数组中未有该值，就在末尾插入
    } else {    
      colors = colors.filter(item => item !== value);        //未选中，就将该值过滤掉
    }
    this.setState({ colors });
  }
  render() {
    return (
      <>
        <input name="colors" value="1" onChange={this.handle} type="checkbox"
          checked={this.state.colors.includes("1")}
        />红
        <input name="colors" value="2" onChange={this.handle} type="checkbox"
          checked={this.state.colors.includes("2")}
        />绿
        <input name="colors" value="3" onChange={this.handle} type="checkbox"
          checked={this.state.colors.includes("3")}
        />蓝
      </>
    );
  }
```
 3. 选择框
在HTML中，<select>元素（选择框）会包含多个用来表示选项的<option>元素，而选中的项会被定义一个selected属性，如下代码所示，第二个<option>元素处于选中状态。

```html
<select>
    <option value="1">strick</option>
    <option value="2" selected>freedom</option>
    <option value="3">jane</option>
</select>
```

```javascript
class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handle = this.handle.bind(this);
  }
  handle(e) {
    this.setState({ value: e.target.value });
  }
  render() {
    return (
      <select value={this.state.value} onChange={this.handle}>
        <option value="1">strick</option>
        <option value="2">freedom</option>
        <option value="3">jane</option>
      </select>
    );
  }
}

class MulSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { values: [] };
    this.handle = this.handle.bind(this);
  }
  handle(e) {
    const { options } = e.target;             //options是一个类数组对象
    const values = Object.keys(options)       //将options的索引组成一个数组
      .filter(i => options[i].selected)       //过滤出选中项
      .map(i => options[i].value);            //提取选中项组成新数组
    this.setState({ values });
  }
  render() {
    return (
      <select value={this.state.values} onChange={this.handle} multiple={true}>
        <option value="1">strick</option>
        <option value="2">freedom</option>
        <option value="3">jane</option>
      </select>
    );
  }
}
```
## 非受控组件
非受控组件（Uncontrolled Component）的定义正好与受控组件的相左，其状态由自己管理，通常使用ref属性（第5篇中讲解过）获取表单元素的值。
```javascript
class Text extends React.Component {
  constructor(props) {
    super(props);
    this.handle = this.handle.bind(this);
  }
  handle() {
    this.input.value = this.input.value.toUpperCase();
  }
  render() {
    return <input onBlur={this.handle} type="text" ref={ input => {this.input = input}}/>;
  }
}
```
**在React中，有一个表单元素比较特殊，那就是上传按钮。它只有非受控组件的形式，因为其值只能由用户传入，不能被组件的state所控制。**

 * 默认值
 如果要指定非受控组件的默认值，那么可通过定义defaultValue或defaultChecked属性实现，前者适用于文本框、选择框等元素，后者适用于单选框和复选框。

```javascript
class Text extends React.Component {
  render() {
    return <input type="text" defaultValue="init"/>;
  }
}
class Radio extends React.Component {
  render() {
    return (
      <>
        <input name="gender" value="1" type="radio"/>男
        <input name="gender" value="2" type="radio" defaultChecked={true}/>女
      </>
    );
  }
}
```



# 组件通信
根据组件之间的嵌套关系（即层级关系）可分为4种通信方式：父子、兄弟、跨级和无级。

## 父子通信
1. 父传子
```javascript
class Parent extends React.Component {
  render() {
    return <Child name="strick">子组件</Child>;
  }
}
class Child extends React.Component {
  render() {
    return <input name={this.props.name} type="text" />;
  }
}
```
2. 子传父
```javascript
class Parent extends React.Component {
  callback(value) {
    console.log(value);        //输出从子组件传递过来的值
  }
  render() {
    return <Child callback={this.callback} />;
  }
}
class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
  }
  handle(e) {
    this.props.callback(e.target.value);        //调用父组件的回调函数
    this.setState({ name: e.target.value });    //更新文本框中的值
  }
  render() {
    return <input value={this.state.name} type="text" onChange={this.handle.bind(this)} />;
  }
}
```

## 兄弟通信
兄弟之间不能直接通信，需要借助状态提升的方式间接实现信息的传递，即把组件之间要共享的状态提升至最近的父组件中，由父组件来统一管理。
```javascript
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { type: "p", digit: 0 };
    this.plus = this.plus.bind(this);
    this.minus = this.minus.bind(this);
  }
  plus(digit) {
    this.setState({ type: "p", digit });
  }
  minus(digit) {
    this.setState({ type: "m", digit });
  }
  render() {
    let { type, digit } = this.state;
    let pdigit = type == "p" ? digit : (digit+1);
    let mdigit = type == "m" ? digit : (digit-1);
    return (
      <>
        <Child type="p" digit={pdigit} onDigitChange={this.plus} />
        <Child type="m" digit={mdigit} onDigitChange={this.minus} />
      </>
    );
  }
}
class Child extends React.Component {
  constructor(props) {
    super(props);
    this.handle = this.handle.bind(this);
  }
  handle(e) {
    this.props.onDigitChange(+e.target.value);
  }
  render() {
    return (
      <input value={this.props.digit} type="text" onChange={this.handle} />
    );
  }
}
```

## 跨级通信
在React中，还可用Context实现跨级通信。Context能存放组件树中需要全局共享的数据，也就是说，一个组件可以借助Context跨越层级直接将数据传递给它的后代组件。随着React v16.3的发布，引入了一种**全新的Context**，修正了旧版本中较为棘手的问题，接下来的篇幅将着重分析这两个版本的Context。

1. 旧的Context
在旧版本的Context中，首先要在**顶层组件内添加getChildContext()方法和静态属性childContextTypes**，
前者用于生成一个context对象（即初始化Context需要携带的数据），
后者通过prop-types库限制该对象的属性的数据类型，
**两者缺一不可**。
然后给后代组件（例如下面的Grandson）添加静态属性contextTypes，限制要接收的属性的数据类型，最后就能通过读取this.context得到由顶层组件提供的数据。
```javascript
class Grandpa extends React.Component { 
    // getChildContext方法
    getChildContext() { 
        return { name: 'strick' };
    }

    render() { 
        return <Son />;
    }
}

// 静态属性childContextTypes
Grandpa.childContextTypes = { 
    name: PropTypes.string
}

// 中间组件
class Son extends React.Component { 
    render() { 
        return <Grandson />
    }
}

class Grandson extends React.Component { 
    render() { 
        return <p>{this.context.name}</p>
    }
}

Grandson.contextTypes = { 
    name: PropTypes.string
}
```
虽然在功能上Context实现了跨级通信，但本质上数据还是像props一样逐级传递的，因此**如果某个中间组件的shouldComponentUpdate()方法返回false的话，就会阻止下层的组件更新Context中的数据**。
接下来会演示这个致命的缺陷，沿用上一个示例，对两个组件做些调整。在Grandpa组件中，先让Context保存组件的name状态，再新增一个按钮，并为其注册一个能更新组件状态的点击事件；在Son组件中，添加shouldComponentUpdate()方法，它的返回值是false。在把Grandpa组件挂载到DOM中后，点击按钮就能发现Context的更新传播终止于Son组件。
```javascript
class Grandpa extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "strick" };
    this.click = this.click.bind(this);
  }
  getChildContext() {
    return { name: this.state.name };
  }
  click() {
    this.setState({ name: "freedom" });
  }
  render() {
    return (
      <>
        <Son />
        <button onClick={this.click}>提交</button>
      </>
    );
  }
}
class Son extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <Grandson />;
  }
}
```
2. 新的Context
这个版本的Context不仅采用了更符合React风格的声明式写法，还可以直接将数据传递给后代组件而不用逐级传递，一举冲破了shouldComponentUpdate()方法的限制。
```javascript
const NameContext = React.createContext({ name: 'strick' });
class Grandpa extends React.Component { 
    render() { 
        return ( 
            <NameContext.Provider value={{name: 'freedom'}}>
                <Son />
            </NameContext.Provider>
        );
    }
}

class Son extends React.Component { 
    render() { 
        return <Grandson />
    }
}

class Grandson extends React.Component { 
    render() { 
        return (
            <NameContext.Consumer>{}</NameContext.Consumer>
        );
    }
}
```

## 无级通信
当两个没有嵌套关系（即无级）的组件需要通信时，可以借助消息队列实现。下面是一个用观察者模式实现的简易消息队列库，其处理过程类似于事件系统，如果将消息看成事件，那么订阅消息就是绑定事件，而发布消息就是触发事件.
当两个没有嵌套关系（即无级）的组件需要通信时，可以借助消息队列实现。下面是一个用观察者模式实现的简易消息队列库，其处理过程类似于事件系统，如果将消息看成事件，那么订阅消息就是绑定事件，而发布消息就是触发事件。
```javascript
class EventEmitter { 
    constructor() { 
        this.events = {};
    }

    // 订阅
    sub(event, listener) { 
        if(!this.events[event]) { 
            this.events[event] = { listeners: [] };
        }

        this.events[event].listeners.push(listener);
    }

    // 发布
    pub(event, ...params) { 
        for (const listener of this.events[name].listeners) {
            listener.apply(null, params);
        }
    }
}

    let emitter = new EventEmitter();
    class Sub extends React.Component {
        constructor(props) {
            super(props);
            emitter.sub("TextBox", value => console.log(value));
        }
        render() {
            return <p>订阅消息</p>;
        }
    }

    class Pub extends React.Component {
        constructor(props) {
            super(props);
            this.state = { value: "" };
        }
        handle(e) {
            const value = e.target.value;
            emitter.pub("TextBox", value);
            this.setState({ value });
        }
        render() {
            return <input value={this.state.value} onChange={this.handle.bind(this)} />;
        }
    }
```

当业务逻辑复杂到一定程度时，普通的消息队列可能就捉襟见肘了，此时可以考虑引入****Mobx、Redux***等专门的状态管理工具来实现组件之间的通信。