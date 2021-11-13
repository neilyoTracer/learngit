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
  b. static getDerivedStateFromProps() @deprecate componentWillMount() 方法会运行在render()之前，它是渲染之前的回调函数。不过，由于在这个方法中执行的任务都能提前到constructor()中，因此实际项目中很少会用到它。
  c. render() 它是一个无副作用的纯函数，可根据组件的props和state得到一个React元素、null或false等返回值，**并且在render()方法中不能调用改变组件状态的this. setState()方法**。**注意: 将元素渲染到页面DOM中的工作都由React负责，而不是render()方法。**
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
  第二种，通过改变自身state（即调用this.setState()方法）引起的更新，会忽略componentWillReceiveProps()方法，只执行四个回调函  数。
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

   a. static getDerivedStateFromProps() /** @deprecate componentWillReceiveProps(nextProps) 先比较nextProps和this. props中的值是否相同，再决定是否执行同步... 为了避免进入一个死循环，在调用this. setState()方法更新组件时就不会触发它**/ , 
   b. shouldComponentUpdate(nextProps, nextState) 通过比较nextProps、nextState和组件当前的this.props、this.state能得出一个布尔类型的返回结果。
   #. @deprecate componentWillUpdate(nextProps, nextState) 和 componentDidUpdate(prevProps, prevState) componentWillUpdate()和componentDidUpdate()分别运行在render()之前和之后，它们都能接收2个参数，前者提供更新后的props和state，后者提供更新前的props和state。
   #. @deprecate 在componentWillUpdate()中，不能调用this. setState()方法，以免发生不必要的死循环。最新版本React中已经废弃**
   c. render()
   d. getSnapshotBeforeUpdate()
   f. componentDidUpdate()

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

6. 参考
**render()**
render() 方法是class组件中唯一必须实现的方法
当render被调用的时候，它会检查this.props和this.state的变化并返回一下类型之一
  a. React元素 DOM节点或者自定义组件
  b. 数组或fragments
  c. Portals
  ``` javascript
    render() {
      // React 并*没有*创建一个新的 div。它只是把子元素渲染到 `domNode` 中。
      // `domNode` 是一个可以在任何位置的有效 DOM 节点。
      return ReactDOM.createPortal(
        this.props.children,
        domNode
      );
    }
  ```
  d. 字符串或数值类型
  e. 布尔类型或null
  **render() 函数应该为纯函数，这意味着在不修改组件 state 的情况下，每次调用时都返回相同的结果，并且它不会直接与浏览器交互。**
  **如需与浏览器进行交互，请在 componentDidMount() 或其他生命周期方法中执行你的操作。保持 render() 为纯函数，可以使组件更容易思考。**
  **注意，如果 shouldComponentUpdate() 返回 false，则不会调用 render()。**

**constructor()**
**如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数。**
在 React 组件挂载之前，会调用它的构造函数。在为 React.Component 子类实现构造函数时，**应在其他语句之前前调用 super(props)。**否则，this.props 在构造函数中可能会出现未定义的 bug。
在 constructor() 函数中**不要调用 setState() 方法。**如果你的组件需要使用内部 state，请直接在构造函数中为 **this.state 赋值初始 state：**
```javascript
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }
```
只能在构造函数中直接为 this.state 赋值。如需在其他方法中赋值，你应使用 this.setState() 替代。
**要避免在构造函数中引入任何副作用或订阅。如遇到此场景，请将对应的操作放置在 componentDidMount 中。**

**componentDidUpdate(prevProps, prevState, snapshot)**
componentDidUpdate() 会在更新后会被立即调用。首次渲染不会执行此方法。
```javascript
componentDidUpdate(prevProps) {
  // 典型用法（不要忘记比较 props）：
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```
你也可以在 componentDidUpdate() 中直接调用 setState()，**但请注意它必须被包裹在一个条件语句里,正如上述的例子那样进行处理，否则会导致死循环。**
如果组件实现了 getSnapshotBeforeUpdate() 生命周期（不常用），则它的返回值将作为 componentDidUpdate() 的第三个参数 “snapshot” 参数传递。否则此参数将为 undefined。
如果 shouldComponentUpdate() 返回值为 false，则不会调用 componentDidUpdate()。

**shouldComponentUpdate(nextProps, nextState)**
**getSnapshotBeforeUpdate(prevProps, prevState)**
```javascript
  class ScrollingList extends React.Component { 
    constructor(props) { 
      super(props);
      this.listRef = React.createRef();
    }

    getSnapshotBeforeUpdate(prevProps, prevState) { 
      // 我们是否在List中添加新的items？
      // 捕获滚动位置以便我们稍后调整滚动位置。
      if(prevProps.list.length < this.props.list.length) { 
        const list = this.listRef.current;
        return list.scrollHeight - list.scrollTop;
      }
      return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) { 
      // 如果我们的snapshot有值，说明我们刚刚添加了新的items
      // 调整滚动位置使得这些新的items不会将旧的items推出视图
      //（这里的snapshot是getSnapshotBeforeUpdate的返回值）
      if(snapshot !== null) { 
        const list = this.listRef.current;
        list.scrollTop = list.scrollHeight - snapshot
      }
    }

    render() { 
      return (
        <div ref={this.listRef}>{/*content*/}</div>
      )
    }
  }
```

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
            <NameContext.Consumer>{context => <p>{context.name}</p>}</NameContext.Consumer>
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




# 高阶组件(HOC High Order Component)
高阶组件（High Order Component，简称HOC）不是一个真的组件，而是一个没有副作用的纯函数，以组件作为参数，返回一个功能增强的新组件，在很多第三方库（例如Redux、Relay等）中都有高阶组件的身影。
由于遵循了装饰者模式的设计思想，因此不会入侵传递进来的原组件，而是对其进行抽象、包装和拓展，改变原组件的行为。

高阶组件有两种常见的实现方式：代理和继承，下面会分别做讲解。
## 代理方式
高阶组件作为原组件的代理，不但会将其包裹住，还会给它添加新特性，并且提供了众多控制原组件的功能，例如操纵props、抽取state、访问实例和再包装等。
1. 操纵props
```javascript
class Btn extends React.Component { 
    render() { 
        return <button>{this.props.name}</button>
    }
}

function HOC(Wrapped) { 
    class Enhanced extends React.Component { 
        constructor(props) { 
            super(props);
            this.state = { name: 'strick' };
        }

        render() { 
            return <Wrapped {...this.state} />
        }
    }
    return Enhanced;
}

const EnhancedBtn = HOC(Btn);
```
2. 抽取state
```javascript
function stateHOC(Wrapped) {
  class Enhanced extends React.Component {
    constructor(props) {
      super(props);
      this.state = { value: "" };
      this.handle = this.handle.bind(this);
    }
    handle(e) {
      this.setState({ value: e.target.value });
    }
    render() {
      let newProps = {
        value: this.state.value,
        onChange: this.handle
      };
      return <Wrapped {...newProps} />;
    }
  }
  return Enhanced;
}

class Input extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <input type="text" {...this.props} />;
  }
}
```
3. Refs
```javascript
class Btn extends React.Component {
  render() {
    return <button>提交</button>;
  }
}
function refHOC(Wrapped) {
  class Enhanced extends React.Component {
    render() {
      return <Wrapped ref={btn => { this.myBtn = btn }} />;
    }
    componentDidMount() {
      console.log(this.myBtn);        //Btn组件的实例
    }
  }
  return Enhanced;
}
```
**注意，ref属性不会传递给原组件，如果在上面的Btn组件中读取this.props.ref，那么得到的值将是undefined，如下所示。**
4. 包装
```javascript
function wrappedHOC(Wrapped) {
  class Enhanced extends React.Component {
    render() {
      return (
        <div style={{ padding: 10 }}>
          <input type="text" />
          <Wrapped />
        </div>
      );
    }
  }
  return Enhanced;
}
```

## 继承
继承是另一种构建高阶组件的方式，即新组件直接继承原组件（如下代码所示），从而实现通用逻辑的复用，并且还能使用原组件的state和props，以及生命周期等方法。
```javascript
function inheritHOC(Wrapped) {
  class Enhanced extends Wrapped { }
  return Enhanced;
}
```
在代理方式下的新组件和原组件会各自经历一次完整的生命周期，而在继承方式下，两者会共用一次生命周期。

1. 渲染劫持
在高阶组件中，可以通过super.render()渲染原组件，从而就能控制高阶组件的渲染结果，即渲染劫持。例如在新组件的render()方法中克隆原组件并为其传递新的props，如下所示。
```javascript
function inheritHOC(Wrapped) { 
    class Enhanced extends Wrapped { 
        render() { 
            // 获取原组件
            const origin = super.render();

            // 合并原组件的属性，并新增value属性的值
            const props = Object.assign({}, origin.props, { value: 'strick' });
            return React.cloneElement(origin, props, origin.props.children);
        }
    }

    return Enhanced;
}
```
除了render()方法，其余诸如componentWillMount()、componentWillUpdate()等生命周期中的方法也是能劫持的。
2. 使用state
```javascript
class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }
  render() {
    return <input type="text" value={this.state.value} />;
  }
}
function stateHOC(Wrapped) {
  class Enhanced extends Wrapped {
    constructor(props) {
      super(props);
      this.state.name = "strick";        //增加状态
      this.state.value = "init";         //修改状态
    }
    render() {
      return super.render();
    }
  }
  return Enhanced;
}
let EnhancedInput = stateHOC(Input);
```

## 参数传递
高阶组件除了一个组件参数之外，还能接收其它类型的参数，例如为高阶组件额外传递一个区分类别的type参数，如下所示。
HOC(Wrapped, type)
不过，在React中，函数式编程的参数传递更为常用，即使用柯里化的形式，如下代码所示，其中HOC(type)会返回一个高阶组件。
HOC(type)(Wrapped)
而在第三方库中，这种形式的高阶组件被大量应用，例如Redux中用于连接React组件与其Store的connect()函数，它是一个能返回高阶组件的高阶函数，其参数可以是两个函数，如下所示。
```javascript
const Enhanced = connect(mapStateToProps, mapDispatchToProps)(Wrapped);
```
虽然这种形式的高阶组件会让人困惑，但是更易于组合。因为它会把参数序列处理到只剩一个组件参数，而高阶组件的返回值也是一个组件，也就是说，前一个高阶组件的返回值可以作为后一个高阶组件的参数，从而使得这些高阶组件可以组合在一起。例如有三个高阶组件f、g和h，它们可以像下面这样组合在一起。

f(g(h(Wrapped)))

如果要嵌套的高阶组件很多，那么这种写法将变得异常丑陋且难以阅读。这个时候，就可以引入compose()函数，它能将函数串联起来，即用平铺的写法实现函数的组合，如下代码所示，省略了compose()函数的具体实现。

compose(f, g, h)

compose()函数的执行方向是自右向左，并且还有一个限制，那就是第一个高阶组件（即h）可以接收多个参数，但之后的就只能接收一个参数。

## 命名
在高阶组件中创建的新组件，不会再沿用原组件的名称。为了便于在React Developer Tools中调试，需要为新组件设置一个显示名称，例如新组件的名称是“Enhanced”，原组件的名称是“Input”，那么就以“Enhanced(Input)”为显示名称。
```javascript
function HOC(Wrapped) {
  class Enhanced extends React.Component { }
  Enhanced.displayName = `Enhanced(${getDisplayName(Wrapped)})`;
  return Enhanced;
}
```

# Redux
Redux是一个可预测的状态容器，不但融合了函数式编程思想，还严格遵循了单向数据流的理念。
在Redux中，状态是不能直接被修改的，而是通过Action、Reducer和Store三部分协作完成的。具体的运作流程可简单的概括为三步，首先由Action说明要执行的动作，然后让Reducer设计状态的运算逻辑，最后通过Store将Action和Reducer关联并触发状态的更新
```javascript
function calculate(previoursState = { digit: 0 }, action) { // Reducer
  const state = Object.assign({}, previoursState);
  switch(action.type) { 
    case 'ADD': 
      state.digit++;
    case 'MINUS':
      state.digit--;
  }

  return state;
}

const store = createStore(calculate); // Store
const action = { type: 'ADD' }; // Action
store.dispatch(action);  // 触发更新
store.getState();  // 获取状态
```
通过上面的代码可知，Action是一个普通的JavaScript对象，Reducer是一个纯函数，Store是一个通过createStore()函数得到的对象，如果要触发状态的更新，那么需要调用它的dispatch()方法。

## 三大原则
1. 单一数据源(Signal source of truth)
2. 保持状态只读(State is read-only)
3. 状态的改变由纯函数来完成(Changes are made with pure functions)

## 主要组成
1. Action
由开发者定义的Action本质上就是一个普通的JavaScript对象，Redux约定该对象必须包含一个字符串类型的**type**属性，
其值是一个常量，用来描述动作意图
```javascript
{ type: "ADD", step: 1 }

function add() {
  return { type: "ADD", step: 1 };
}
```
2. Reducer
Reducer函数对状态只计算不存储，开发者可根据当前业务对其进行自定义。
此函数能接收2个参数：previousState和action，前者表示上一个状态（即**当前应用的状态**），后者是一个被派发的Action对象，
函数体中的返回值是根据这两个参数生成的一个**处理过的新状态**。
在编写Reducer函数时，有三点需要注意：
* 遵守纯函数的规范，例如不修改参数、不执行有副作用的函数等.
* 函数中可以先用Object.assign(),创建一个状态对象的副本 或者用**immutable.js**处理数据状态，随后就只修改这个新对象，注意，方法的第一个参数要像上面这样传一个空对象。
* 在发生异常情况（例如无法识别传入的Action对象），返回原来的状态。
当业务变得复杂时，Reducer函数中处理状态的逻辑也会随之变得异常庞大。此时，就可以采用分而治之的设计思想，将其拆分成一个个小型的独立子函数，而这些Reducer函数各自只负责维护一部分状态。如果需要将它们合并成一个完整的Reducer函数，那么可以使用Redux提供的combineReducers()函数。
```javascript
  function add(previousState, action) {
  let state = Object.assign({}, previousState);
  state.digit = "digit" in state ? (state.digit + 1) : 0;
  return state;
}
function minus(previousState, action) {
  let state = Object.assign({}, previousState);
  state.number = "number" in state ? (state.number - 1) : 0;
  return state;
}
let reducers = combineReducers({add, minus});
```
3. Store
Store为Action和Reducer架起了一座沟通的桥梁，它是Redux中的一个对象，发挥了容器的作用，保存着应用的状态，包含4个方法：
(1) **getState()**：获取当前状态。
(2) **dispatch(action)**：派发一个Action对象，引起状态的修改。
(3) **subscribe(listener)**：注册状态更新的监听器，其返回值可以注销该监听器。
(4) **replaceReducer(nextReducer)**：更新Store中的Reducer函数，在实现Redux热加载时可能会用到。
```javascript
let store = createStore(caculate, {digit: 1});
```

caculate()函数会增加或减少状态对象的digit属性，其中增量或减量都是1。接下来为Store注册一个监听器（如下代码所示），当状态更新时，就会打印出最新的状态；而在注销监听器（即调用unsubscribe()函数）后，控制台就不会再有任何输出。
```javascript
let unsubscribe = store.subscribe(() =>     //注册监听器
  console.log(store.getState())
);
store.dispatch({ type: "ADD" });            //{digit: 2}
store.dispatch({ type: "ADD" });            //{digit: 3}
unsubscribe();                    　　　　　//注销监听器
store.dispatch({ type: "MINUS" });        　//没有输出
```

## 绑定React
虽然Redux和React可以单独使用（即没有直接关联），但是将两者搭配起来能发挥更大的作用。React应用的规模一旦上去，那么对状态的维护就变得愈加棘手，而在引入Redux后就能规范状态的变化，从而扭转这种窘境。Redux官方提供了一个用于绑定React的库：react-redux，它包含一个connect()函数和一个Provider组件，能很方便的将Redux的特性融合到React组件中。
1. 容器组件和展示组件
容器组件（Container Component），也叫**智能组件（Smart Component）**，由react-redux库生成，负责应用逻辑和源数据的处理，
为**展示组件**传递必要的props，可与Redux配合使用，不仅能监听Redux的状态变化，还能向Redux派发Action。

展示组件（Presentational Component），也叫**木偶组件（Dumb Component）**，由开发者定义，负责渲染界面，接收
从**容器组件**传来的props，可通过props中的**回调函数**同步源数据的变更。
容器组件和展示组件是根据职责划分的，两者可互相嵌套，并且它们内部都可以包含或省略状态，一般容器组件是一个有状态的类，而展示组件是一个无状态的函数。

2. connect()
react-redux提供了一个柯里化函数：connect()，它包含4个可选的参数（如下代码所示），用于连接React组件与Redux的Store（即让展示组件关联Redux），生成一个容器组件。
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options]);
在使用connect()时会有两次函数执行，如下代码所示，第一次是获取要使用的保存在Store中的状态，connect()函数的返回结果是一个函数；第二次是把一个展示组件Dumb传到刚刚返回的函数中，继而将该组件装饰成一个容器组件Smart。
```javascript
const Smart = connect()(Dumb);
```

3. MapStateToProps
这是一个包含2个参数的函数（如下代码所示），其**作用是从Redux的Store中提取出所需的状态并计算成展示组件的props**。
如果connect()函数省略这个参数，那么展示组件将无法监听Store的变化。
mapStateToProps(state, [ownProps])
第一个state参数是Store中保存的状态，
第二个可选的ownProps参数是传递给容器组件的props对象。
```javascript
let store = createStore(calculate);
function Btn(props) { // 展示组件
  return <button>{props.txt}</button>
}
function mapStateToProps(state, ownProps) { 
  console.log(state);            //{digit: 0}
  console.log(ownProps);         //{txt: "提交"}
  return state;
}

const Smart = connect(mapStateToProps)(Btn); // 生成容器组件
ReactDOM.render(
  <Provider store={store}>
    <Smart txt="提交" />
  </Provider>,
  document.getElementById('container')
);
```
Btn是一个无状态的展示组件，Store中保存的初始状态不是undefined，容器组件Smart接收到了一个txt属性，在mapStateToProps()函数中打印出了两个参数的值。

**当Store中的状态发生变化或组件接收到新的props时，mapStateToProps()函数就会被自动调用。**
4. mapDispatchToProps
它既可以是一个对象，也可以是一个函数，如下代码所示。
其作用是绑定Action创建函数与Store实例所提供的dispatch()方法，
再将绑好的方法映射到展示组件的props中
```javascript
function add() {            //Action创建函数
  return {type: "ADD"};
}
var mapDispatchToProps = { add };                　　　　 //对象
var mapDispatchToProps = (dispatch, ownProps) => {        //函数
  return {add: bindActionCreators(add, dispatch)};
}
```
  * 当mapDispatchToProps是一个对象时，
    其包含的方法会作为Action创建函数，自动传递给Redux内置的bindActionCreators()方法，生成的新方法会合并到props中，
    属性名沿用之前的方法名。

  * 当mapDispatchToProps是一个函数时，会包含2个参数，
    第一个dispatch参数就是Store实例的dispatch()方法；
    第二个ownProps参数的含义与mapStateToProps中的相同，并且也是可选的。
```javascript
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
```
展示组件能通过读取props的属性来调用传递过来的方法，例如在Btn组件的点击事件中执行props.add()，触发状态的更新，如下所示。
```javascript
function Btn(props) { 
  return <button onClick={props.add}>{props.txt}</button>
}
```
通过上面的分析可知，
mapStateToProps负责展示组件的**输入**，即将所需的应用状态映射到props中；
mapDispatchToProps负责展示组件的**输出**，即将需要执行的更新操作映射到props中。

## Provider
react-redux提供了Provider组件，它能将Store保存在自己的Context（在第9篇做过讲解）中。如果要正确使用容器组件，那么得让其成为Provider组件的后代，并且只有这样才能接收到传递过来的Store。Provider组件常见的用法如下所示。

<Provider store={store}>
  <Smart />
</Provider>
　　Provider组件位于顶层的位置，它会接收一个store属性，属性值就是createStore()函数的返回值，Smart是一个容器组件，被嵌套在Provider组件中。

# Redux中间件

## 开发模式
在设计中间件函数时，会遵循一个固定的模式，如下代码所示，使用了柯里化、高阶函数等函数式编程中的概念。
```javascript
function middleware(store) { 
  return function(next) { 
    return function(action) { 
      return next(action);
    }
  }
}
```
之所以将中间件函数写成层层嵌套的模式，有以下几个原因。
1. 扩展Redux需要遵循函数式编程的设计思想。
2. 柯里化让中间件更容易处理数据流，即便于形成数据处理管道。
3. 每个中间件的职责单一（即函数代码尽量少），通过嵌套组合完成复杂功能。
利用ES6中的箭头函数能将middleware()函数改写得更加简洁，如下所示。
```javascript
const middleware = store => next => action => next(action);
```

## applyMiddleware
Redux提供了组织中间件的applyMiddleware()函数，在阅读过此函数的源码（如下所示）之后，才能更好的理解中间件的开发模式。
```javascript
function applyMiddleware(...middlewares) { 
  return createStore => (...args) => { 
    const store = createStore(...args);
    let dispatch = () => { 
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. " +
          "Other middleware would not be applied to this dispatch."
      );
    };

    const middlewareApi = { 
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };

    const chain = middlewares.map(middleware => middleware(middlewareApi));
    dispatch = compose(...chain)(store.dispatch);
    return {...store, dispatch};
  }
}
```
1. 源码分析
2. 使用方式
applyMiddleware()函数有两种使用方式，下面用一个例子来演示，先定义两个中间件：m1和m2，以及一个Reducer函数：caculate()。
1. 1）applyMiddleware()是一个三级柯里化的函数，如果要使用，那么可以像下面这样调用，先传两个中间件，再传createStore()函数，最后传caculate()函数。
```javascript
const m1 = store => next => action => {
  console.log("m1");
  return next(action);
};
const m2 = store => next => action => {
  console.log("m2");
  return next(action);
};
function calculate(previousState = {digit:0}, action) {
  let state = Object.assign({}, previousState);
  switch (action.type) {
    case "ADD":
      state.digit += 1;
      break;
    case "MINUS":
      state.digit -= 1;
  }
  return state;
}
let store = applyMiddleware(m1, m2)(createStore)(calculate);
```
2. applyMiddleware()函数还可以作为createStore()的最后一个参数，如下代码所示，第一个参数是caculate()函数，第二个参数是applyMiddleware()函数的结果。
```javascript
let store = createStore(calculate, applyMiddleware(m1, m2));
```
在applyMiddleware()函数的内部，chain数组的值是[m1(next), m2(next)]，由m1和m2返回的包含next参数的函数组成。增强后的dispatch()方法通过m1(m2(store.dispatch))得到，具体如下所示。
```javascript
dispatch = action => {
  console.log("m1");
  return next(action);
};
```
当调用store实例的dispatch()方法（如下代码所示）时，会先输出“m1”；然后调用next()函数，也就是m2(next)，输出“m2”；最后调用m2中的next()函数，也就是dispatch()方法。
**注意，不能在中间件中直接调用dispatch()方法，以免造成死循环。**

## redux-thunk
如果要在Redux中处理异步请求，那么可以借助中间件实现，目前市面上已有很多封装好的中间件可供使用，例如redux-thunk、redux-promise或redux-saga等。本节将着重讲解redux-thunk中间件，其核心代码如下所示。
```javascript
function createThunkMiddleware(extraArgument) { 
  return ({ dispatch, getState }) => next => action => { 
    if(typeof action === 'function') { 
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  }
}
```
首先检测action的类型，如果是函数，那么就直接调用并将dispatch、getState和extraArgument作为参数传入；否则就调用next参数，转移控制权。redux-thunk其实扩展了dispatch()方法，使其参数既可以是JavaScript对象，也可以是函数。

用法
```javascript
// store
import thunk from 'redux-thunk';

export const store = createStore(
  combineReducers({...reducer1, ...reducer2}),
  applyMiddleware(thunk)
);

**store.dispatch(asyncAction());**
// action
export const ascynAction = () => { 
  return async dispatch => { 
    try { 
      let response = await fetch('test.url');
      dispatch(response.json());
    } catch (err) { 
      console.error(err);
    }
  }
}
```

# React Router

## 版本
在2015年的11月，官方发布了React Router的第一个版本，实现了声明式的路由。
随后在2016年，主版本号进行了两次升级，一次是在2月的v2；另一次是在10月的v3。
v3能够兼容v2，删除了一些会引起警告的弃用代码，在未来只修复错误，所有的新功能都被添加到了2017年3月发布的v4版本中。
v4不能兼容v3，在内部完全重写，推崇组件式应用开发，放弃了之前的静态路由而改成动态路由的设计思路。
所谓静态路由是指事先定义好一堆路由配置，在应用启动时，再将其加载，从而构建出一张路由表，记录URL和组件之间的映射关系。
虽然v4版本精简了许多API，降低了学习成本，但是增加了项目升级的难度。

目前最新的版本已到v5，但官方团队本来只是想发布v4.4版本。由于人为的操作失误，导致不得不撤销v4.4，直接改成v5，因此其API能完全兼容v4.x版本。
React Router被拆分成了4个库（包），如表3所列。
react-router         提供核心的路由组件，对象和函数
react-router-dom     提供浏览器所需的核心组件
react-router-native  提供react-native所需要的特定组件
react-router-config  提供静态路由的配置

当运行在浏览器环境中时，只需要安装react-router-dom即可。因为react-router-dom会依赖react-router，所以默认就能使用react-router提供的API。
v5版本的React Router提供了三大类组件：路由器、路由和导航，将它们组合起来就能实现一套完整的路由系统，如图11所示。首先根据URL导航到路由器中相应的路由，然后再渲染出指定的组件。

## 路由器
Router是React Router提供的基础路由器组件，一般不会直接使用。在浏览器运行环境中，通常引用的是封装了Router的高级路由器组件：BrowserRouter或HashRouter。
以BrowserRouter为例，其部分源码如下所示。
```javascript
class BrowserRouter extends React.Component { 
  history = createBrowserHistory(this.props);
  render() { 
    return <Router history={this.history} children={this.props.children} />
  }
}
```
在v4.x的版本中，路由器组件可以包裹任意类型的子元素，但数量只能是一个，而在v5.0版本中已经解除了这个限制。下面的BrowserRouter组件包含了两个子元素，如果将其执行于v4.x中，那么将抛出错误。
```javascript
<BrowserRouter>
  <div>1</div>
  <div>2</div>
</BrowserRouter>
```
1. history
每个路由器组件都会创建一个history对象，由它来管理会话历史。
history不但会监听URL的变化，还能将其解析成**location对象**，触发路由的匹配和相应组件的渲染。

history有三种形式，各自对应一种创建函数，应用于不同的路由器组件，具体如表4所示。其中MemoryRouter适用于非浏览器环境，例如React Native。
形式              创建函数                   路由器组件
browserHistory   createBrowserHistory()    BrowserRouter
hashHistory      createHashHistory()       HashRouter
memoryHistory    createMemoryHistory()     MemoryRouter

history会将浏览过的页面组织成有序的堆栈，无论使用哪种history，其属性和方法大部分都能保持一致。表5列出了history通用的API。
interface History
length                 堆栈长度
action                 执行的动作，push or replace
location               一个对象，**在hashHistory中没有key和state**
{
  key: "z4ihbf",            //唯一标识
  pathname: "/libs/d.html"  //路径和文件名
  search: "?page=1",        //查询字符串
  hash: "#form",            //锚点
  state: {                　//状态对象
    count: 10            
  }
}
push                  在栈顶添加一条新的页面纪录
replace               替换当前的页面纪录
go(number)            跳转到指定页
goBack()              上一页，相当于go(-1)
goForward()           下一页，相当于go(1)
block(prompt)         阻止跳转

2. BrowserRouter
此组件会通过HTML5提供的History来保持页面和URL的同步，其创建的URL格式如下所示。
http://pwstrick.com/page.html

如果使用BrowserRouter组件，那么需要服务器配合部署。以上面的URL为例，当页面刷新时，浏览器会向服务器请求根目录下的page.html，但根本就没有这个文件，于是页面就会报404的错误。
若要避免这种情况，就需要配置Web服务器软件（例如Nginx、自建的Node服务器等），具体参数的配置可参考网上的资料。
BrowserRouter组件包含5个属性，接下来将一一讲解。
 * 1. basename属性用于设置根目录，URL的首部需要一个斜杠，而尾部则省略，例如“/pwstrick”，如下所示。
```javascript
<BrowserRouter basename="/pwstrick" />
<Link to="/article" />                //渲染为<a href="/pwstrick/article">
```
 * 2. forceRefresh是一个布尔属性，只有当浏览器不支持HTML5的History时，才会设为true，从而可刷新整个页面。
 * 3. keyLength属性是一个数字，表示location.key的长度。
 * 4. children属性保存着组件的子元素，这是所有的React组件都自带的属性。
 * 5. getConfirmation属性是一个确认函数，可拦截Prompt组件，注入自定义逻辑。
      以下面代码为例，当点击链接企图离开当前页面时，会执行action()函数，弹出里面的确认框，其提示就是Prompt组件message属性的值，只有点击确定后才能进行跳转（即导航）。
```javascript
const action = (msg, cb) => { 
  const allowTransition = window.confirm(msg);
  callback(allowTransition);
}

<BrowserRouter getConfirmation={action}>
 <div>
  <Prompt msg="确认要离开吗?">
  <Link to="page.html">首页</Link>
 </div>
</BrowserRouter>
```
3. HashRouter
此组件会通过window.location.hash来保持页面和URL的同步，其创建的URL格式比较特殊，需要包含井号（#），如下所示。
http://pwstrick.com/#/page.html
在使用HashRouter时，不需要配置服务器。因为服务器会**忽略锚点**（即#/page.html），只会处理锚点之前的部分，所以刷新上面的URL也不会报404的错误。

HashRouter组件包含4个属性，其中3个与BrowserRouter组件相同，分别是basename、children和getUserConfirmation。
独有的hashType属性用来设置hash类型，有三个关键字可供选择，如下所列。
 * slash 默认值，井号后面跟一个斜杠，例如“#/page”。
 * noslash 井号后面没有斜杠，例如“#page”。
 * hashbang 采用Google风格，井号后面跟感叹号和斜杠，例如“#!/page”。

## 路由
Route是一个配置路由信息的组件，其职责是当页面的URL能匹配Route组件的path属性时，就渲染出对应的组件，而渲染方式有三种。
接下来会讲解Route组件的属性、渲染方式以及其它的相关概念。
1. 路径
与路径相关的属性有3个，分别是**path、exact和strict**，接下来会一一讲解。
* **path**是一个记录路由匹配路径的属性，
当路由器是BrowserRouter时，path会匹配location中的pathname属性；
而当路由器是HashRouter时，path会匹配location中的hash属性。
path属性的值既可以是普通字符串，也可以是能被path-to-regexp解析的正则表达式。
下面是一个示例，如果没有特殊说明，默认使用的路由器是BrowserRouter。
```javascript
<Route path="/main" component={Main} />
<Route path="/list/:page+" component={List} />
```
第一个Route组件能匹配“/main”或以“/main”为前缀的pathname属性，下面两条URL能正确匹配。
http://www.pwstrick.com/main
http://www.pwstrick.com/main/article
第二个Route组件能匹配以“/list”为前缀的pathname属性，下面两条URL**只能匹配第二条。**
http://www.pwstrick.com/list
http://www.pwstrick.com/list/1

React Router内部依赖了path-to-regexp库，此库定义了一套正则语法，例如命名参数、修饰符（*、+或?）等，具体规则可参考官方文档，本文不做展开。
在“/list/:page+”中，带冒号前缀的“:page”是命名参数，类似于一个函数的形参，可以传递任何值；正则末尾的加号要求至少匹配一个命名参数，没有命名参数就匹配失败。
注意，如果省略path属性，那么路由将总是匹配成功。

* **exact**是一个布尔属性，当设为true时，路径要与pathname属性完全匹配，如表6所示。
* **strict**也是一个布尔属性，当设为true时，路径末尾如果有斜杠，那么pathname属性匹配到的部分也得包含斜杠。在表7的第三行中，虽然pathname属性的末尾没有斜杠，但是依然能正确匹配。

2. 渲染方式
Route组件提供了3个用来渲染组件的属性：component、render和children，每个属性对应一种渲染方式，**每种方式传递的props都会包含3个路由属性：match、location和history**。  
 * **component**属性的值是一个组件（如下代码所示），当路由匹配成功时，会创建一个新的React元素（调用了React.createElement()方法）。
```javascript
<Route path="/name" component={Name} />
```
如果组件以内联函数的方式传给component属性，那么会产生不必要的重新挂载。对于内联渲染，可以用render属性替换。

 * **render**属性的值是一个返回React元素的内联函数，当路由匹配成功时，会调用这个函数，此时可以传递额外的参数进来，如下代码所示。由于React元素不会被反复创建，因此不会出现重新挂载的情况。
```javascript
<Route path="/name" render={(props) => {
  return <Name {...props} age="30">Strick</Name>
}}/>
```

 * **children**children属性的值也是一个返回React元素的内联函数，它的一大特点是无论路由是否匹配成功，这个函数都会被调用，该属性的工作方式与render属性基本一致。
**注意，当匹配不成功时，props的match属性的值为null**

Route会将路由匹配后的信息记录到match对象中，然后将此对象作为props的match属性传递给被渲染的组件。
match对象包含4个属性，在表8中，不仅描述了各个属性的作用，还在第三列记录了点击read链接后，各个属性被赋的值。
```javascript
<Link to="/list/article/1">read</Link>
<Route path="/list/:type" component={Name} />
```

属性        描述                                      示例中的值
params     由路径的参数名和解析URL匹配到的值组成的对象     {type: 'article'}
isExact    是否完全匹配，等同于Route的exact属性          false
path       要匹配的路径，等同于Route的path属性           /list/:type
url        匹配到的URL部分                            /list/article

3. Switch
如果将一堆Route组件放在一起（如下代码所示），那么会对每个Route组件依次进行路由匹配，例如当前pathname的属性值是“/age”，那么被渲染的组件是Age1和Age3。
```javascript
<Route path='/' component={Age1} />
<Route path='/article' component={Age2} />
<Route path='/:list' component={Age3} />
```
而如果将这三个Route用Switch组件包裹（如下代码所示），那么只会对第一个路径匹配的组件进行渲染。
```javascript
<Switch>
  <Route path='/' component={Age1} />
  <Route path='/article' component={Age2} />
  <Route path='/:list' component={Age3} />
</Switch>
```
Switch的子元素既可以是Route，也可以是Redirect。其中Route元素匹配的是path属性，而Redirect元素匹配的是to属性

4. 嵌套路由
从v4版本开始，嵌套路由不再通过多个Route组件相互嵌套实现，而是在被渲染的组件中声明另外的Route组件，以这种方式实现嵌套路由。
下面用一个例子来演示嵌套路由，首先用Switch组件包裹两个Route组件，第一个只有当处在根目录时才会渲染Main组件，第二个路径匹配成功渲染的是Children组件。
```javascript
<Switch>
  <Route exact path='/' component={Main} />
  <Route path='/list/:article' component={Children} />
</Switch>
```

然后定义Children组件，它也包含一个Route组件，从而形成了嵌套路由。
**注意，其路径读取了match对象的path属性，通过沿用父路由中要匹配的路径，可减少许多重复代码。**
```javascript
let Children = (props) => { 
  return <Route path={`${props.match.path}/:id`} component={Article} />;
}

let Article = (props) => { 
  return <h5>文章内容</h5>
}
```

## 导航
当需要在页面之间进行切换时，就该轮到Link、NavLink和Redirect三个导航组件登场了。其中Link和NavLink组件最终会被解析成HTML中的<a>元素。

1. Link 
当点击Link组件时会渲染匹配路由中的组件，并且能在更新URL时，不重载页面。
它有两个属性：to和replace，
其中**to**属性用于定义导航地址，其值的类型既可以是**字符串**，
也可以是**location对象**（包含pathname、search等属性），如下所示。
```javascript
<Link to="/main">字符串</Link>
<Link to={{pathname: '/main', search: '?type=1'}}>对象</Link>
```
**replace**是一个布尔属性，默认值为false，当设为true时，能用新地址替换掉会话历史里的原地址。

2.NavLink
它是一个封装了的Link组件，其功能包括定义路径匹配成功后的样式、限制匹配规则、优化无障碍阅读等，接下来将依次讲解多出的属性。

首先是**activeClassName**和**activeStyle**，
两个属性都会在路径匹配成功时，赋予元素样式（如下代码所示）。
�����中前者定义的是CSS类，默认值为“active”；
后者定义的是内联样式，书写规则可参照React元素的style属性。

然后是**exact**和**strict**，两个布尔属性的功能可分别参考Route元素的exact和strict，它们的用法相同。
如果将exact和strict设为true（如下代码所示），那么匹配规则会改变，其中前者要路径完全匹配，后者得符合strict的路径匹配规则。
只有当匹配成功时，才能将activeClassName或activeStyle属性的值赋予元素。

```javascript
<style>
.btn { 
  color: blue;
}
</style>
<NavLink to="/list" activeClassName="btn">CSS类</NavLink>
<NavLink to="/list" activeStyle={{color: 'blue'}}>内联样式</NavLink>

<NavLink to="/list" exact>完全</NavLink>
<NavLink to="/list" strict>斜杠</NavLink>
```
接着是函数类型的**isActive**属性，此函数能接收2个对象参数：match和location，返回一个布尔值。
在函数体中可添加路径匹配时的额外逻辑，当返回值是true时，才能赋予元素定义的匹配样式。
**注意，无论匹配是否成功，isActive属性中的函数都会被回调一次，因此如果要使用match参数，那么需要做空值判断（如下代码所示），以免出错。**
```javascript
let fn = (match, location) => { 
  if(!match) { 
    return;
  }

  return match.url.indexOf('article') >= 0;
}

<NavLink to="/list" isActive={fn}>函数</NavLink>
```
最后是两个特殊功能的属性：**location**和**aria-current**，
前者是一个用于比对的location对象；
后者是一个为存在视觉障碍的用户服务的ARIA属性，用于标记屏幕阅读器可识别的导航类型，
例如页面、日期、位置等。可供选择的关键字包括page、step、location、date、time和true，默认值为page。

3. Redirect
此组件用于导航到一个新地址，类似于服务端的重定向（HTTP的状态码为3XX），其属性如表9所示。
**to**   重定向的目的地址，可以是字符串，也可以是location对象
**from** 需要进行重定向的地址，只有匹配成功后才会跳转到to属性定义的目标地址
**push** 布尔属性，当设置为true时，重定向地址将会加入到会话历史中
Redirect可与Switch搭配使用，如下代码所示，当URL与“/main”匹配时，重定向到“/page”，并渲染Page组件。
```javascript
<Switch>
  <Redirect from="/main" to="/page" />
  <Route path="/page" component={Page} />
</Switch>
```

## 路由集成redux
示例分三步来描述React Router集成Redux的过程，第一步是创建Redux的三个组成部分：Action、Reducer和Store，如下所示。
```javascript
function caculate(previousState = {digit: 0}, action) {        //Reducer
  let state = Object.assign({}, previousState);
  switch (action.type) {
    case "ADD":
      state.digit += 1;
      break;
    case "MINUS":
      state.digit -= 1;
  }
  return state;
}
function add() {                　　　　　　//Action创建函数
  return {type: "ADD"};
}
let store = createStore(caculate);        //Store
```

1. WithRouter
在说明第二步之前，需要先了解一下React Router提供的一个高阶组件：withRouter。
它能将**history、location和match**三个路由对象传递给被包装的组件，其中match对象来自于离它最近的父级Route组件的match属性。
正常情况下，只有Route要渲染的组件（例如下面的List）会自带这三个对象，
但如果List组件还有一个子组件，那么这个子组件就无法自动获取到这三个对象了，除非**显式地传递**。

在使用withRouter后，就能避免逐级传递。并且当把withRouter应用于react-redux库中的connect()函数后（如下代码所示），就能让函数返回的容器组件监听到路由的变化。
```javascript
withRouter(connect(...)(MyComponent))
```

2. 路由
```javascript
class Btn extends React.Component {
  render() {
    return (
      <div>
        <Link to="/list">列表</Link>
        <Route path="/list" component={List} />
        <button onClick={this.props.add}>提交</button>
      </div>
    );
  }
}
let List = (props) => {
  return <WithArticle content="内容"/>;
};
let Article = (props) => {
  const { match, location, history } = props;
  return <h5>{props.content}</h5>;
};
let WithArticle = withRouter(Article);    //withRouter包装后的Article组件
```

3. 渲染
```javascript
let Smart = connect(state => state, { add })(Btn);        //容器组件
let Router = <Provider store={store}>
  <BrowserRouter>
    <Smart />
  </BrowserRouter>
</Provider>;
ReactDOM.render(Router, document.getElementById("container"));
```
