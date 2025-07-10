[RNode][RElement]
RNode 全称是 Render Node，RElement 全称 Render Element。

它们是 Angular 对 [DOMNode] 和 [HTMLElement] 的接口。Angular 不想直接依赖 DOM，所以它搞了这两个接口。
如果环境是游览器，那最终实现这两个接口的就是 DOM Node 和 HTMLElement。

[TNode]
TNode 全称是 Template Node。顾名思义，它是节点的模型，用于生产出 [RNode]，就像 Template 生产出 View 那样。
TNode -> RNode

[TView]
TView 全称是 Template View。顾名思义，Template 意味着它也是个模型。

View 意味着它是一组 nodes 的 frame。合在一起大致意思就是一个 nodes frame 的模型。

按推理，*一组 TNode 会形成一个 [TView]*，然后 [TView] 用于生产 [RView]。

这个推理只对了一半，TView 确实包裹着一组 TNode，但 TView 并不生产 RView，它生产的是 [LView]。

[LView] 就是一个javascript对象，*类似React的Virtual DOM*





1. [providers 和 viewProviders 的区别是，providers 在遇到 transclude 的组件时不会隔离服务，而后者可以]
2. (a ??= []).push(b); 没有就是建立空数组[]
3. angular 类的 constructor 函数体内就是[injecter context],这里面才能执行 inject 函数
4. 问：我们可以监听到 [QueryList] 的变化吗?

答：可以，通过 QueryList.changes 方法，它会返回一个 RxJS Observable，subscribe 它就可以了，每当 QueryList 有变化 (append / removeChild) 它就会发布。

```javascript
console.log('Old Length', this.titleQueryList.length);
this.titleQueryList.changes.subscribe(() => {
console.log('New Length', this.titleQueryList.length);
});
```

5. [createComponent]
   ```javascript
   const dynamicComponentRef = createComponent(DyncComponent, {
    enviromentInjector: appNodeInjector.get(EnviromentInjector),
    elementInjector: appNodeInjector // 这里传入 appNodeInjector 后，dynamicComponentRef 可以 inject(AppComponent, {optional: true})
    })
    ```

6.  [ViewContainerRef] 就是让我们把 Dynamic Component 插入 Logical View Tree 的工具。
7.  [ViewContainerRef] remove 和 detech 最大的不同是，
    detech 只是把 LView 抽出 LContainer，
    remove 则是 LView.destroy 摧毁它。

8.  [TemplateContextTypeGuard 指令]
   ```javascript
    import { Directive, Input } from '@angular/core';

    @Directive({
    selector: 'ng-template[templateContextType]',
    standalone: true,
    })
    export class TemplateContextTypeGuardDirective<T> {
    @Input('templateContextType')
    type!: T;

    static ngTemplateContextGuard<T>(

        _dir: TemplateContextTypeGuardDirective<T>,
        ctx: unknown

    ): ctx is T {

        return true;

    }
    }
    ```
  <ng-template [templateContextType]="type" />

1.  动态组件里的[content-project]

方法 1: 通过 DOM Manipulation 和 reflectConponentType
首先，定义 template (不是 ng-template)
<template #template>

  <h1 slot="title"></h1>
</template>

接着 query template
@ViewChild('template')
template!: ElementRef<HTMLTemplateElement>

然后 clone template and reflectComponentType
// 1. clone template
const template = this.template.nativeElement;
const content = template.content.cloneNode(true) as DocumentFragment;

const projectableNodes: Node[][] = [];
// 2. 通过反射调出动态组件的 ng-content selector，这个反射挺好用的, ** 注意这里是不用 new 这个组件的就可以拿到组件的各种属性 **
```javascript
const dynComponentMirror = reflectComponentType(DynComponent);

for (const cssSelector of dynComponentMirror.ngContentSelectors) {

    const notes = Array.from(content.querySelectorAll(cssSelector)) {
      projectableNodes.push(nodes);
    }

}

const dynComponentRef = createComponent(DynComponent, {
enviromentInjector: appStandaloneInjector,
elementInjector: appNodeInjector,
projectableNodes
});
```

我们通过 DOM Manipulation 搞定了第一个问题 -- 外部渲染。

再通过 reflectComponentType 函数拿到 SayHi 的 ng-content 顺序和 selector，解决了第二个问题 -- no more CSS Selector 匹配。

方法 2: 使用 ng-template 版本... 也可以用 NgTemplateOutlet
<ng-template #template>

  <h1 slot="title"></h1>
</ng-template>

```javascript
@ViewChild('template'): tplRef!: TemplateRef<void>;
@ViewCHild('container', {read: ViewContainerRef})
viewContainerRef!: ViewContainerRef;

private injector = inject(injector);
async append() {
const {DynComponent} = await import('./dyn-component');
const embeddedView = this.tplRef.createEmbeddedView();
// 如果是插入embeddedView
// 1. viewContainerRef.createEmbeddedView(this.tplRef);
// 2. viewContainerRef.insert(embeddedView); 
// dyncomponentRef.hostView和ng-template的embeddedView的抽象都是ViewRef
const dynComponentRef = viewContainerRef.createComponent(DynComponent, {

    enviromentInjector: this.injector.get(EnvironmentInjector),
    elementInjector: this.injector,
    projectableNodes: [embeddedView.rootNodes]

})
}

NOTE:
动态组件和ng-template的重要区别
1. 动态组件
通过viewContainerRef.createComponent()方法生成的动态组件，其injector没有传入的话，会自动使用viewContainerRef.parentViewInjector,通常就是用于动态组件生成的容器组件
2. ng-template
通过templateRef.createEmbeddedView()生成的embeddedview,如果没有传入injector的话，默认是undefined，不能inject NodeInjector(这里指注册在某个组件上的服务)
```

10. [NgForOf] 指令会以 person.name 作为识别 person 对象的 key，在 people 发生变成 (比如排序) 时，以 ViewContainerRef.move 取代 ViewContainerRef.createEmbededView 来进行需改，这样性能就会比较好。

11. _ngIf="person$ | async, let person, else loadingTemplate" 微语法解析
    _:prefix="( :let | :expression ) ('; ' | ', ')? (:let | :as | :keyExp)"
    \*: 会在元素外层 wrap 一个 ng-template
    ngIf 就是指令[ngIf], 只是省略了方括号
    person$ | async 作为传递给 NgIf 指令的参数
    let person 就是 let-person
    , 是分割符，用分号; 也是可以的， 不放也是可以的
    else 会变成[ngIfElse], 它以 ngIf 作为 prefix 把 else 拼接上去
    loadingTemplate 是[ngIfElse]的参数

12. 我们可以通过 [runInInjectionContext] 来处理不在 constructor 中 inject 的情况。

复制代码
```javascript
class ServiceA {
injector = inject(Injector);
method() {

    runInInjectionContext(this.injector, () => {
      const serviceB = inject(ServiceB);
    });

}
}
```

13. [3 种提供 Provider 的方式]
# 通过@Injectable 的 provideIn
```javascript
@Injectable({

        providedIn: 'root'

})
export class TestService
```
或者 InjectionToken 的 providedIn
class TestService
```javascript
const TEST_SERVICE_TOKEN = new InjectionToken('TestService', {

    providedIn: 'root',
    factory() {
      return new TestService()
    }

});
```

# 通过 ApplicationConfig.providers rootInjector

# 通过组建/指令 Decorator 的 providers

14. [我该使用 NgModule 管理 Provider 吗]
    NgModule providers 对 Tree Shaking 不友好。

NgModule 管理 Provider 和管理组件的逻辑不一致，这很容易造成混淆。

**_providedIn: 'root' 完全可以取代 NgModule Provider，它俩唯一的区别是 NgModule 需要一个 “激活动作” -- import NgModule。_**

15. [当 NgModule 遇上 Dynamic Component 和 Dynamic Import (lazyload)]
    所以大家记起来：每当你要动态创建一个由 NgModule 管理的组件时，你一定要先 import 它的 NgModule，这个 import 指的是 TypeScript import 而不是 @Component.imports 哦。
    \*\*\*总结！
    当 NgModule 遇上 Dynamic Component 会产生一些化学反应：
    动态创建 NgModule 的组件时，记得要 import '/example.module.ts'，不然 ng serve 会报错。
    动态创建一个 Standalone Component，该组件 import 了带有 providers 的 NgModule，
    NgModule providers 将会 provide to Dynamic Standalone Injector 而不是 Root Injector。
    动态创建一个 NgModule 内的组件，该 NgModule 带有 providers，
    我们需要 create NgModuleRef，把 NgModuleRef.injector 用于创建 Dynamic Component。
    这样 Dynamic Component 才能 inject 到 NgModule providers。
    第二和第三条都和 NgModule providers 有关，所以奉劝大家谨用 NgModule providers。

16.[HttpClient]
当 Observable 被立刻 subscribe 执行，同时它内部是一个异步发布，而且只发布一次，这个时候它和 Promise 最像，通常使用 Promise 会更恰当。
我们上面发请求的例子就完全满足了 Observable to Promise 的条件。这种时候用 Promise 会更恰当。

通过 await + firstValueFrom 我们可以把 Observable 转换成 Promise，这样代码就整齐了。(optinal)
```javascript
async sendRequest() {

    const products = await firstValueFrom(
      this.httpClient.get<Product[]>('https://192.168.1.152:44300/products'));
    console.log(products); // [{ id: 1, name: 'iPhone14' }, { id: 2, name: 'iPhone15' }]

}
```

17.[Download]

# download text file // arraybuffer
```javascript
const memoryStream = await firstValueFrom(
this.httpClient.get('https://192.168.1.152:44300/data.txt', {
responseType: 'arraybuffer',
})
);
const bytes = new Uint8Array(memoryStream);
const textDecoder = new TextDecoder();
const text = textDecoder.decode(bytes);
console.log(text); // 'Hello World'
```
关键是 responseType: 'arraybuffer'，它会返回 ArrayBuffer，再通过 Uint8Array 和 TextDecoder 从 ArrayBuffer 读取 data.txt 的内容。

# download video // blob
Video 通常 size 比较大，用 ArrayBuffer 怕内存会不够，所以用 Blob 会比较合适。
```javascript
const blob = await firstValueFrom(
this.httpClient.get('https://192.168.1.152:44300/video.mp4', {
responseType: 'blob',
})
);
console.log(blob.size / 1024); // 124,645 kb
console.log(blob.type);
```

# download progress

首先是 HttpClient.get 的设置
```javascript
const httpEvent$ = this.httpClient.get('https://192.168.1.152:44300/video.mp4', {
responseType: 'blob', // response 类型是 blob
observe: 'events', // 返回 Observable<HttpEvent>
reportProgress: true, // 要监听 progress
});

// 接着过滤出 download progress event
const downloadProgressEvent$ = httpEvent$.pipe(
// 过滤出 download progress event
filter((e): e is HttpDownloadProgressEvent => e.type === HttpEventType.DownloadProgress)
)
//接着 subscribe
downloadProgressEvent$.subscribe(e => {
const percentage = ((e.loaded / e.total!) * 100).toFixed(2) + '%';
console.log(percentage);
console.log(e.partialText);
});
```
HttpDownloadProgressEvent 有 loaded 和 total 属性，可以计算出 percentage。

# retry
由于 HttpClient 基于 RxJS，所以它很容易实现 retry。
```javascript
try {
const products = await firstValueFrom(
this.httpClient.get<Product[]>('https://192.168.1.152:44300/products').pipe(
retry({
delay: (error, retryCount) => {
console.log('failed', retryCount);
// 条件：只可以 retry 3 次，只有 status 503 才 retry
if (retryCount <= 3 && error instanceof HttpErrorResponse && error.status === 503) {
return timer(1000); // 延迟 1 秒后才发出 retry request
}
else {
return error; // 其它情况不 retry，直接返回 error
}
},
resetOnSuccess: true, // reset retry count when success
})
)
);

console.log('succeeded', products); // 成功
}
catch {
console.log('total failed 4 times'); // retry 3 次还是失败，加第一次总共 4 次 request
}
```
e. [HttpContext] HttpClient 和 Interceptors 们之间的沟通

```javascript
const byPassInterceptorToken = new HttpContextToken(() => false); // false 是 default value

javascript
let context = new HttpContext();
context = context.set(byPassInterceptorToken, true);
const products = await firstValueFrom(
this.httpClient.get<Product[]>('https://192.168.1.152:44300/products', {
context,
})
);

const httpInterceptorFn: HttpInterceptorFn = (request, next) => {
// 如果是 by pass 直接 next
if(request.context.get(byPassInterceptorToken)) {return next(request)}
}
```

18. [FormGroup]
另外，FormGroup.value 的更新时机也需要留意。
```javascript
formGroup.controls.name.valueChanges.subscribe(v => console.log(formGroup.value)); 
// { name: 'Derrick', email: 'derrick@gmail.com' }

formGroup.controls.name.setValue('Alex');

console.log(formGroup.value); // { name: 'Alex', email: 'derrick@gmail.com' }
```

在 FormControl.valueChanges 时 FormGroup.value 是还没有更新的。它一直等到所有 FormControl event 都发布完了后才更新 (即使是使用 FormGroup.setValue 也是一样)。

拿个 value 而已，又要顾虑 disabled 又要顾虑 timing，有没有简简单单直接拿到当下所有 value 的办法？哎哟，还真的有哦。
```javascript
formGroup.controls.name.disable();
formGroup.controls.email.valueChanges.subscribe(() =>
// 1. 使用 getRawValue 方法
console.log(formGroup.getRawValue()) // { name: 'Derrick', email: 'alex@gmail.com' }
);
formGroup.patchValue({ email: 'alex@gmail.com' });
// getRawValue 方法可以获得当下所有 FormControl value。
```

19.[Route]
# UrlTree
通过 Router.parseUrl 可以把一个 URL string 转换成 UrlTree 对象。
```javascript
export class AppComponent {
constructor() {
const router = inject(Router);
const urlTree = router.parseUrl('/about(secondary:contact)');
console.log(urlTree.root.children['secondary'].segments[0].path); // 'contact'
}
}
```

只要执行 UrlTree.toString 方法，就可以把 UrlTree 对象转换成 URL string。
```javascript
export class AppComponent {
constructor() {
const router = inject(Router);
const urlTree = router.parseUrl('/about(secondary:contact)');
console.log(urlTree.toString()); // '/about(secondary:contact)'
}
}
```

用 Router.parseUrl 生成 UrlTree 不是一个好主意，更方便的方式是通过 command。
```javascript
export class AppComponent {
constructor() {
const router = inject(Router);
const urlTree = router.createUrlTree([
{ outlets: { primary: ['about'], secondary: ['contact'] } },
]);
console.log(urlTree.toString() === '/about(secondary:contact)'); // true
}
}
```

使用 Router.createUrlTree 方法可以通过 command 的方式创建 UrlTree
router.createUrlTree(['about']).toString(); // '/about'

# Query Parameters
```javascript
router.createUrlTree(['about'], {queryParams: {key1: 'value1'}}).toString(); 
// 'about?key1=value' ，注: Angular 会替我们 encode
```

# Fragment
```javascript
router.createUrlTree(['about'], {fragment: 'target-id'}).toString(); // '/about#target-id'
router.createUrlTree(['products', 'iphone-14']).toString(); // 'products/iphone-14'
```

# Segment Parameters (a.k.a Matrix Parameters)
```javascript
router.createUrlTree(['products', { key1: 'value1' }, 'iphone-14']).toString(); 
// '/products;key1=value1/iphone-14'
```

# Multiple Segment Group
```javascript
router.createUrlTree([{ outlets: { primary: ['about'], secondary: ['contact'], tertiary: ['blog'] } }]); 
// '/about(secondary:contact//tertiary:blog)'
```
# Multilayer + Multiple Segment Group
```javascript
router.createUrlTree(
  [
    'products', 
    { outlets: { primary: ['iphone-14'], secondary: ['contact'], tertiary: ['blog'] } }
  ]); // Note: '/products/(iphone-14//secondary:contact//tertiary:blog)'
```
# [Route]
UrlTree、Route Tree、ActivatedRoute Tree、OutletContext Tree
[UrlTree]
UrlTree 是 URL string 的树形版本，这个树形结构是依据 URL string 解析出来的，它跟 Route、ActivatedRoute、Outlet 都没有关系。
只要给 Angular 一个 URL string 它就可以生成出 UrlTree 对象。

[Route Tree]
Route Tree 指的是我们配置的 Routes Array。
Route 的树形结构完全是由我们自己掌控的。

[ActivatedRoute Tree]
ActivatedRoute Tree 是配对成功的 Route Tree，所以它的树形结构不会脱离 Route Tree。

[OutletContext Tree]
通过 inject ChildrenOutletContexts，我们可以获取到 OutletContext Tree。
```javascript
export class AppComponent {
constructor() {
const router = inject(Router);
const childrenOutletContexts = inject(ChildrenOutletContexts);
router.events.subscribe((e) => {
if (e.type === EventType.NavigationEnd) {
console.log('childrenOutletContexts', childrenOutletContexts);
}
});
}
}
```

c.[Routing 相关服务]
[PlatformLocation]
所以在 Angular 内部，它们不直接操作 window.location 和 window.history，取而代之的是通过 PlatformLocation 间接操作。
**[LocationStrategy]**
LocationStrategy 是对 PlatformLocation 的又一层封装。
下面这个是默认的 URL，又称为 path 版本 URL

http://localhost:4200/products/iphone-14

下面这个则是 hash 版本 URL

http://localhost:4200/#/products/iphone-14

关键是在中间多了个 /#/

它的用意是在 refresh browser 的时候，服务端是否需要处理多种不同路径还是只需要处理一种路径。

在 refresh browser 的时候，游览器一定会发请求到服务端。

如果使用 path URL，路径可能是

[http://localhost:4200/products/iphone-14]

[http://localhost:4200/about]

[http://localhost:4200/contact]

只要是前端能匹配的路径都有可能在 refresh browser 时被发送到服务端作为请求

服务端需要处理所有的路径，通通返回同样的 index.html 内容。

如果使用 hash URL 情况就不同了

[http://localhost:4200/#/products/iphone-14]

[http://localhost:4200/#/about]

[http://localhost:4200/#/contact]

只要是前端能匹配的路径都有可能在 refresh browser 时被发送到服务端作为请求

由于 # 后面的路径是不会被发送到服务端的 (这个是 browser 的行为)，所以上面所有请求路径，通通会变成 http://localhost:4200/。

那服务端就只需要处理这一个路径就够了。

[Location]
# 看名字就猜到了，Location 是对 LocationStrategy 的又又一层封装。 Angular Team 真的是好喜欢一层一层啊 😔

[UrlSerializer]
# UrlSerializer 负责把 URL string 转换成 UrlTree 和把 UrlTree 转换成 URL string
# Router.parseUrl 内部就是调用了 UrlSerializer.parse 方法
# UrlTree.toString 方法内部就是调用了 UrlSerializer.serialize 方法

[StateManager]
# StateManager 负责维护当前的 UrlTree 和 RouterState (ActivatedRoute Tree)，同时也负责更新 browser URL

[NavigationTransitions]
# NavigationTransitions 负责启动导航和处理导航中的各个阶段，比如：UrlTree 与 Route 配对 
# -> 创建 ActivatedRoute Tree 
# -> 创建组件插入 router-outlet 等等。

[ViewportScroller]
# ViewportScroller 的职责是控制游览器的 scrollbar。
# 它之所以与 Routing 有关是因为导航后移动 scrollbar 是游览器的默认行为，比如 next page scroll to top，history back 恢复之前的 scrolled position。

[RouterScroller]
# RouterScroller 的职责是监听 NavigationTransitions 发出的导航事件，然后调用 ViewportScroller 完成 next page scroll to top，history back 恢复之前的 scrolled position 等等操作。

[Router]
parseUrl
createUrlTree
routerState
navigate
navigateByUrl
events

20.[Signal]
# [Writable] signals

```javascript
cosnt count = signal(0)
console.log(`The count is: ${count()}`)

count.set(3)

count.update(value => value + 1);
```

# [Computed] signals

```javascript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

# [Effects]

```javascript
effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

# Injection [context]

```javascript
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  constructor() {
    // Register a new effect.
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    });
  }
}

@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  private loggingEffect = effect(() => {
    console.log(`The count is: ${this.count()}`);
  });
}

@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  constructor(private injector: Injector) {}
  initializeLogging(): void {
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    }, {injector: this.injector});
  }
}
```

# Reading [without] [tracking] dependencies

```javascript
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${counter()}`);
});

effect(() => {
  console.log(`User set to ${currentUser()}` and the counter is ${untracked(counter)})
})

effect(() => {
  // If the `loggingService` reads signals, they won't be counted as
    // dependencies of this effect.
  this.logginService.log(`User set to ${user}`);
})
```

# Effect [cleanup] functions
```javascript
effect(ondestroy => {
  const user = currentUser();
  const timer = setTimeout(() => {
    console.log(`1 second ago, the user became ${user}`);
  },1000);

  ondestroy(() => {
    clearTimeout(timer)
  })
})
```

# [Signal] [inputs]
```javascript
import {Component, input} from '@angular/core';
@Component({...})
export class MyComp {
  // optional
  firstName = input<string>();         // InputSignal<string|undefined>
  age = input(0);                      // InputSignal<number>
  // required
  lastName = input.required<string>(); // InputSignal<string>

  age = input(0, {alias: 'studentAge'});

  ageMultiplied = computed(() => this.age() * 2);

  disabled = input(false, {
    transform: (value: boolean|string) => typeof value === 'string' ? value === '' : value,
  });

  constructor() {
    effect(() => {
      console.log(this.firstName());
    });
  }
}

<my-custom-comp disabled>
```

# [Model] [inputs]
```javascript
import {Component, model, input} from '@angular/core';
@Component({
  selector: 'custom-checkbox',
  template: '<div (click)="toggle()"> ... </div>',
})
export class CustomCheckbox {
  checked = model(false);
  disabled = input(false);
  toggle() {
    // While standard inputs are read-only, you can write directly to model inputs.
    this.checked.set(!this.checked());
  }
}
```
# Two-way binding with signals

```javascript
@Component({
  ...,
  // `checked` is a model input.
  // The parenthesis-inside-square-brackets syntax (aka "banana-in-a-box") creates a two-way binding
  template: '<custom-checkbox [(checked)]="isAdmin" />',
})
export class UserProfile {
  protected isAdmin = signal(false);
}
```
# Two-way binding with plain properties
```javascript
@Component({
  ...,
  // `checked` is a model input.
  // The parenthesis-inside-square-brackets syntax (aka "banana-in-a-box") creates a two-way binding
  template: '<custom-checkbox [(checked)]="isAdmin" />',
})
export class UserProfile {
  protected isAdmin = false;
}
```

# Implicit change events
```javascript
@Directive({...})
export class CustomCheckbox {
  // This automatically creates an output named "checkedChange".
  // Can be subscribed to using `(checkedChange)="handler()"` in the template.
  checked = model(false);
}
```
# Model inputs do not support input transforms.

j. [Signal] [queries]
[viewChild]
[viewChildren]
[contentChild]
[contentChildren]
```javascript
@Component({
    template: `
        <div #el></div>
        <my-component />

        <div #el></div>
        @if (show) {
            <div #el></div>
        }
    `
})
export class TestComponent {
    // query for a single result by a string predicate  
    divEl = viewChild<ElementRef>('el');       // Signal<ElementRef|undefined>
    // query for a single result by a type predicate
    cmp = viewChild(MyComponent, {read: ElementRef}); 
    
    // Signal<MyComponent|undefined>

    divEls = viewChildren<ElementRef>('el');
    headerEl = contentChild<ElementRef>('h');
    header = contentChild(MyHeader);
    divEls = contentChildren<ElementRef>('h');
}
```