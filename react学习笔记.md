# setState
1. **setState()是一个异步方法**，React会将多个setState()方法合并成一个调用，也就是说，在调用setState()后，不能马上反映出状态的变化。例如this.state.text的值原先是“提交”，在像下面这样更新状态后，打印出的值仍然是“提交”
```javascript
this.setState({text: "点击"});
console.log(this.state.text);        //"提交"
```

2. setState()方法在将新数据合并到当前状态之后，就会自动调用render()方法，驱动组件重新渲染。由此可知，**在render()方法中不允许调用setState()方法**，以免造成死循环。


# props
1. 读取， 由于React组件相当于一个纯函数，因此props不能被修改，它的属性都是只读的，像下面这样赋值势必会引起组件的副作用，因而React会马上终止程序，直接抛出错误。
```javascript
class Btn extends React.Component {
  constructor(props) {
    super(props);
    props.name = "freedom";         //错误
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
```javascript
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
  c. 它是一个无副作用的纯函数，可根据组件的props和state得到一个React元素、null或false等返回值，**并且在render()方法中不能调用改变组件状态的this.setState()方法**。**注意: 将元素渲染到页面DOM中的工作都由React负责，而不是render()方法。**
  d. componentDidMount() 此时组件已被挂载到页面中，可以执行DOM相关的操作，例如异步读取服务器中的数据并填充到组件中、调用jQuery代码等
```javascript
class Btn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name
    };
  }
  componentWillMount() {
    this.setState({age: 28});
  }
  render() {
    return <button>{this.state.name}</button>;
  }
  componentDidMount() {
    $.post("server.php", {id:1}, json => {
      this.setState({age: json.data.age});
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
```javascript
class Btn extends React.Component { 
    constructor(props) { 
        super(props); 
        this.state = { 
            name: "strick"
        }
    }

    dot() { 
        this.setState({name: "freedom"});
        this.forceUpdate(); // 强制更新
    }

    @deprecate
    componentWillReceiveProps(nextProps) { }
    @now
    static getDerivedStateFromProps(nextProps, prevState) { return object || null; }
    shouldComponentUpdate(nextProps, nextState) { return true; }
    @deprecate
    componentWillUpdate(nextProps, nextState) { }
    @now
    getSnapshotBeforeUpdate(prevProps, prevState) { return param; }

    render() { 
        return <button onClick={this.dot.bind(this)}>{this.state.name}</button>
    }
    componentDidUpdate(prevProps, prevState, param?) { }
}
```
   1. componentWillReceiveProps(nextProps) 先比较nextProps和this.props中的值是否相同，再决定是否执行同步...为了避免进入一个死循环，在调用this.setState()方法更新组件时就不会触发它
   2. shouldComponentUpdate(nextProps, nextState) 通过比较nextProps、nextState和组件当前的this.props、this.state能得出一个布尔类型的返回结果。
   3. componentWillUpdate(nextProps, nextState) 和 componentDidUpdate(prevProps, prevState) componentWillUpdate()和componentDidUpdate()分别运行在render()之前和之后，它们都能接收2个参数，前者提供更新后的props和state，后者提供更新前的props和state。
   4. 在componentWillUpdate()中，不能调用this.setState()方法，以免发生不必要的死循环。最新版本React中已经废弃**

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