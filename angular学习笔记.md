1. [providers和viewProviders的区别是，providers在遇到transclude的组件时不会隔离服务，而后者可以]
2. [(xxx ??= []).push(xxx);  没有就是建立空数组]
3. angular类的constructor函数体内就是[injecter context],这里面才能执行inject函数
4. 问：我们可以监听到 [QueryList] 的变化吗?

答：可以，通过 QueryList.changes 方法，它会返回一个 RxJS Observable，subscribe 它就可以了，每当 QueryList 有变化 (append / removeChild) 它就会发布。

console.log('Old Length', this.titleQueryList.length);

this.titleQueryList.changes.subscribe(() => {
  console.log('New Length', this.titleQueryList.length);
});

5. [createComponent]const dynamicComponentRef = createComponent(DyncComponent, {
  enviromentInjector: appNodeInjector.get(EnviromentInjector),
  elementInjector: appNodeInjector // 这里传入appNodeInjector后，dynamicComponentRef 可以inject(AppComponent, {optional: true})
})

6. [ViewContainerRef] 就是让我们把 Dynamic Component 插入 Logical View Tree 的工具。
7. [ViewContainerRef] remove 和 detech 最大的不同是，
detech 只是把 LView 抽出 LContainer，
remove 则是 LView.destroy摧毁它。

8. [TemplateContextTypeGuard指令]
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

9. 动态组件里的[content-project]

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


方法2: 使用ng-template版本...也可以用NgTemplateOutlet
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
*:prefix="( :let | :expression ) (';' | ',')? (:let | :as | :keyExp)"
*: 会在元素外层wrap一个ng-template
ngIf就是指令[ngIf],只是省略了方括号
person$ | async 作为传递给NgIf指令的参数
let person就是let-person
,是分割符，用分号; 也是可以的， 不放也是可以的
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

