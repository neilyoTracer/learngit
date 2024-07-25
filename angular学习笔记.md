01. [providers和viewProviders的区别是，providers在遇到transclude的组件时不会隔离服务，而后者可以]
02. [(xxx ??= []).push(xxx);  没有就是建立空数组]
03. angular类的constructor函数体内就是[injecter context],这里面才能执行inject函数
04. 问：我们可以监听到 [QueryList] 的变化吗?

答：可以，通过 QueryList.changes 方法，它会返回一个 RxJS Observable，subscribe 它就可以了，每当 QueryList 有变化 (append / removeChild) 它就会发布。

console.log('Old Length', this.titleQueryList.length); 

this.titleQueryList.changes.subscribe(() => {
  console.log('New Length', this.titleQueryList.length); 
}); 

05. [createComponent]const dynamicComponentRef = createComponent(DyncComponent, {
  enviromentInjector: appNodeInjector.get(EnviromentInjector), 
  elementInjector: appNodeInjector // 这里传入appNodeInjector后，dynamicComponentRef 可以inject(AppComponent, {optional: true})
})

06. [ViewContainerRef] 就是让我们把 Dynamic Component 插入 Logical View Tree 的工具。
07. [ViewContainerRef] remove 和 detech 最大的不同是，
detech 只是把 LView 抽出 LContainer，
remove 则是 LView.destroy摧毁它。

08. [TemplateContextTypeGuard指令]
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

<ng-template [templateContextType]="type" />

09. 动态组件里的[content-project]

方法1: 通过DOM Manipulation和reflectConponentType
首先，定义template (不是ng-template)
<template #template>
  <h1 slot="title"></h1>
</template>  

接着 query template
@ViewChild('template')
template!: ElementRef<HTMLTemplateElement>

然后clone template and reflectComponentType
// 1. clone template
const template = this.template.nativeElement; 
const content = template.content.cloneNode(true) as DocumentFragment; 

const projectableNodes: Node[][] = []; 
// 2. 通过反射调出动态组件的ng-content selector，这个反射挺好用的, ** 注意这里是不用new 这个组件的就可以拿到组件的各种属性 **
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

我们通过 DOM Manipulation 搞定了第一个问题 -- 外部渲染。

再通过 reflectComponentType 函数拿到 SayHi 的 ng-content 顺序和 selector，解决了第二个问题 -- no more CSS Selector 匹配。

方法2: 使用ng-template版本... 也可以用NgTemplateOutlet
<ng-template #template>
  <h1 slot="title"></h1>
</ng-template> 

@ViewChild('template'): tplRef!: TemplateRef<void>; 
@ViewCHild('container', {read: ViewContainerRef})
viewContainerRef!: ViewContainerRef; 

private injector = inject(injector); 
async append() {
  const {DynComponent} = await import('./dyn-component'); 
  const embeddedView = this.tplRef.createEmbeddedView(); 
  const dynComponentRef = viewContainerRef.createComponent(DynComponent, {

    enviromentInjector: this.injector.get(EnvironmentInjector),
    elementInjector: this.injector,
    projectableNodes: [embeddedView.rootNodes]

  })
}

10. [NgForOf] 指令会以 person.name 作为识别 person 对象的 key，在 people 发生变成 (比如排序) 时，以 ViewContainerRef.move 取代 ViewContainerRef.createEmbededView 来进行需改，这样性能就会比较好。

11. *ngIf="person$ | async, let person, else loadingTemplate" 微语法解析 
*:prefix="( :let | :expression ) ('; ' | ', ')? (:let | :as | :keyExp)"
*: 会在元素外层wrap一个ng-template
ngIf就是指令[ngIf], 只是省略了方括号
person$ | async 作为传递给NgIf指令的参数
let person就是let-person
, 是分割符，用分号; 也是可以的， 不放也是可以的
else 会变成[ngIfElse], 它以ngIf作为prefix把else拼接上去
loadingTemplate是[ngIfElse]的参数

12. 我们可以通过 [runInInjectionContext] 来处理不在constructor中inject的情况。

复制代码
class ServiceA {
  injector = inject(Injector); 
  method() {

    runInInjectionContext(this.injector, () => {
      const serviceB = inject(ServiceB);
    });

  }
}

13. [3种提供Provider的方式]
a. 通过@Injectable的provideIn
  @Injectable({

    providedIn: 'root'

  })
  export class TestService

或者 InjectionToken的providedIn
  class TestService
  const TEST_SERVICE_TOKEN = new InjectionToken('TestService', {

    providedIn: 'root',
    factory() {
      return new TestService()
    }

  })

b. 通过ApplicationConfig.providers rootInjector

c. 通过组建/指令 Decorator的providers

14. [我该使用 NgModule 管理 Provider 吗]
NgModule providers 对 Tree Shaking 不友好。

NgModule 管理 Provider 和管理组件的逻辑不一致，这很容易造成混淆。

***providedIn: 'root' 完全可以取代 NgModule Provider，它俩唯一的区别是 NgModule 需要一个 “激活动作” -- import NgModule。***

15. [当 NgModule 遇上 Dynamic Component 和 Dynamic Import (lazyload)]
所以大家记起来：每当你要动态创建一个由 NgModule 管理的组件时，你一定要先 import 它的 NgModule，这个 import 指的是 TypeScript import 而不是 @Component.imports 哦。
***总结！
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

通过 await + firstValueFrom 我们可以把 Observable 转换成 Promise，这样代码就整齐了。
  async sendRequest() {

    const products = await firstValueFrom(
      this.httpClient.get<Product[]>('https://192.168.1.152:44300/products'));
    console.log(products); // [{ id: 1, name: 'iPhone14' }, { id: 2, name: 'iPhone15' }]

  }


17.[Download]

a. download text file // arraybuffer
const memoryStream = await firstValueFrom(
  this.httpClient.get('https://192.168.1.152:44300/data.txt', {
    responseType: 'arraybuffer',
  })
);
const bytes = new Uint8Array(memoryStream);
const textDecoder = new TextDecoder();
const text = textDecoder.decode(bytes);
console.log(text); // 'Hello World'
关键是 responseType: 'arraybuffer'，它会返回 ArrayBuffer，再通过 Uint8Array 和 TextDecoder 从 ArrayBuffer 读取 data.txt 的内容。

b. download video // blob
Video 通常 size 比较大，用 ArrayBuffer 怕内存会不够，所以用 Blob 会比较合适。
const blob = await firstValueFrom(
  this.httpClient.get('https://192.168.1.152:44300/video.mp4', {
    responseType: 'blob',
  })
);
console.log(blob.size / 1024); // 124,645 kb
console.log(blob.type);     

c. download progress

首先是 HttpClient.get 的设置

const httpEvent$ = this.httpClient.get('https://192.168.1.152:44300/video.mp4', {
  responseType: 'blob', // response 类型是 blob
  observe: 'events',    // 返回 Observable<HttpEvent>
  reportProgress: true, // 要监听 progress
});
接着过滤出 download progress event

const downloadProgressEvent$ = httpEvent$.pipe(
  // 过滤出 download progress event
  filter((e): e is HttpDownloadProgressEvent => e.type === HttpEventType.DownloadProgress)
)
接着 subscribe

downloadProgressEvent$.subscribe(e => {
  const percentage = ((e.loaded / e.total!) * 100).toFixed() + '%';
  console.log(percentage);
  console.log(e.partialText);
});
HttpDownloadProgressEvent 有 loaded 和 total 属性，可以计算出 percentage。

d. retry
由于 HttpClient 基于 RxJS，所以它很容易实现 retry。
try {
  const products = await firstValueFrom(
    this.httpClient.get<Product[]>('https://192.168.1.152:44300/products').pipe(
      retry({
        delay: (error, retryCount) => {
          console.log('failed', retryCount);
          // 条件：只可以 retry 3 次，只有 status 503 才 retry
          if (retryCount <= 3 && error instanceof HttpErrorResponse && error.status === 503) {
            return timer(1000);        // 延迟 1 秒后才发出 retry request
          } 
          else {
            return error;              // 其它情况不 retry，直接返回 error
          }
        },
        resetOnSuccess: true,          // reset retry count when success
      })
    )
  );
  console.log('succeeded', products);  // 成功
} 
catch {
  console.log('total failed 4 times'); // retry 3 次还是失败，加第一次总共 4 次 request
}

e. [HttpContext] HttpClient 和 Interceptors 们之间的沟通
const byPassInterceptorToken = new HttpContextToken(() => false); // false 是 default value

let context = new HttpContext();
context = context.set(byPassInterceptorToken, true);
const products = await firstValueFrom(
  this.httpClient.get<Product[]>('https://192.168.1.152:44300/products', {
    context,
  })
);

const httpInterceptorFn: HttpInterceptorFn = (request, next) => {
  // 如果是 by pass 直接next
  if(request.context.get(byPassInterceptorToken)) {return next(request)}
}

18. [FormGroup]
另外，FormGroup.value 的更新时机也需要留意。
formGroup.controls.name.valueChanges
  .subscribe(v => console.log(formGroup.value)); // { name: 'Derrick', email: 'derrick@gmail.com' }

formGroup.controls.name.setValue('Alex');

console.log(formGroup.value);                    // { name: 'Alex', email: 'derrick@gmail.com' }

在 FormControl.valueChanges 时 FormGroup.value 是还没有更新的。它一直等到所有 FormControl event 都发布完了后才更新 (即使是使用 FormGroup.setValue 也是一样)。

拿个 value 而已，又要顾虑 disabled 又要顾虑 timing，有没有简简单单直接拿到当下所有 value 的办法？哎哟，还真的有哦。

formGroup.controls.name.disable();
formGroup.controls.email.valueChanges.subscribe(() =>
  // 1. 使用 getRawValue 方法
  console.log(formGroup.getRawValue()) // { name: 'Derrick', email: 'alex@gmail.com' }
);
formGroup.patchValue({ email: 'alex@gmail.com' });
getRawValue 方法可以获得当下所有 FormControl value。

19.[Route]
a.[UrlTree]
通过 Router.parseUrl 可以把一个 URL string 转换成 UrlTree 对象。
export class AppComponent {
  constructor() {
    const router = inject(Router);
    const urlTree = router.parseUrl('/about(secondary:contact)');
    console.log(urlTree.root.children['secondary'].segments[0].path); // 'contact'
  }
}

只要执行 UrlTree.toString 方法，就可以把 UrlTree 对象转换成 URL string。
export class AppComponent {
  constructor() {
    const router = inject(Router);
    const urlTree = router.parseUrl('/about(secondary:contact)');
    console.log(urlTree.toString()); // '/about(secondary:contact)'
  }
}

用 Router.parseUrl 生成 UrlTree 不是一个好主意，更方便的方式是通过 command。
export class AppComponent {
  constructor() {
    const router = inject(Router);
    const urlTree = router.createUrlTree([
      { outlets: { primary: ['about'], secondary: ['contact'] } },
    ]);
    console.log(urlTree.toString() === '/about(secondary:contact)'); // true
  }
}

使用Router.createUrlTree方法可以通过command的方式创建UrlTree
router.createUrlTree(['about']).toString(); // '/about'

// Query Parameters
router.createUrlTree(['about'], {queryParams: {key1: 'value1'}}).toString(); // 'about?key1=value' ，注: Angular会替我们encode

// Fragment
router.createUrlTree(['about'], {fragment: 'target-id'}).toString(); // '/about#target-id'

router.createUrlTree(['products', 'iphone-14']).toString(); // 'products/iphone-14'

// Segment Parameters (a.k.a Matrix Parameters)
router.createUrlTree(['products', { key1: 'value1' }, 'iphone-14']).toString(); // '/products;key1=value1/iphone-14'

// Multiple Segment Group
router.createUrlTree([{ outlets: { primary: ['about'], secondary: ['contact'], tertiary: ['blog'] } }]); // '/about(secondary:contact//tertiary:blog)'

// Multilayer + Multiple Segment Group
router.createUrlTree(['products', { outlets: { primary: ['iphone-14'], secondary: ['contact'], tertiary: ['blog'] } }]); // '/products/(iphone-14//secondary:contact//tertiary:blog)'

b.[Route]
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

http://localhost:4200/products/iphone-14

http://localhost:4200/about

http://localhost:4200/contact

只要是前端能匹配的路径都有可能在 refresh browser 时被发送到服务端作为请求

服务端需要处理所有的路径，通通返回同样的 index.html 内容。

如果使用 hash URL 情况就不同了

http://localhost:4200/#/products/iphone-14

http://localhost:4200/#/about

http://localhost:4200/#/contact

只要是前端能匹配的路径都有可能在 refresh browser 时被发送到服务端作为请求

由于 # 后面的路径是不会被发送到服务端的 (这个是 browser 的行为)，所以上面所有请求路径，通通会变成 http://localhost:4200/。

那服务端就只需要处理这一个路径就够了。

[Location]
看名字就猜到了，Location 是对 LocationStrategy 的又又一层封装。 Angular Team 真的是好喜欢一层一层啊😔


[UrlSerializer]
UrlSerializer 负责把 URL string 转换成 UrlTree 和把 UrlTree 转换成 URL string
Router.parseUrl 内部就是调用了 UrlSerializer.parse 方法
UrlTree.toString 方法内部就是调用了 UrlSerializer.serialize 方法

[StateManager]
StateManager 负责维护当前的 UrlTree 和 RouterState (ActivatedRoute Tree)，同时也负责更新 browser URL

[NavigationTransitions]
NavigationTransitions 负责启动导航和处理导航中的各个阶段，比如：UrlTree 与 Route 配对 -> 创建 ActivatedRoute Tree -> 创建组件插入 router-outlet 等等。

[ViewportScroller]
ViewportScroller 的职责是控制游览器的 scrollbar。它之所以与 Routing 有关是因为导航后移动 scrollbar 是游览器的默认行为，比如 next page scroll to top，history back 恢复之前的 scrolled position。

[RouterScroller]
RouterScroller 的职责是监听 NavigationTransitions 发出的导航事件，然后调用 ViewportScroller 完成 next page scroll to top，history back 恢复之前的 scrolled position 等等操作。

[Router]
parseUrl
createUrlTree
routerState
navigate
navigateByUrl
events