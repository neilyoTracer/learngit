[RxJS]
1. 我们在学习新东西时, 往往会从它长得像以前认识的某些东西作为入手. 但如果一个新东西跟以前许多东西像, 但又不像时, 这个方法反而会制造出混乱.

从概念上去理解 Observable 就有点这种混乱的感觉. 因为它带有 Generator Function 的某些特性, 但又缺失一些特性, 然后它又有点观察者模式的味道, 但又不完全是.

所以呢, 我们干脆先把它当作新物种. 在慢慢把旧事物套进去, 这样来学习它.



2. [同步和异步]
由于大部分 RxJS 都是用来处理异步事件. 这让我们以为 RxJS 和 Promise 一样一定是异步的. 但其实不然.

3. [unsubscribe]
Subscription 还有一个 closed 属性, 用来判断 stream 是否已经 completed, error 或者 unsubscribe

4. [iif]
iif(() => true, of(1), of(2)).subscribe(v => console.log(v)); // 1

5. [Subject]
Subject 是典型的观察者模式, 它不是 Observable 那样参杂了 Generator Function 概念, 所以比较容易理解.

当我们说 Subject extends Observable 时, 指的是它可以被订阅. 而不是它拥有所有 Observable 的特性哦.

和 Observable 不同的地方
第一个不同是它们发布的方式.

Observable 的发布逻辑是在初始化方法里面通过 subscriber.next 发布的.

Subject 没有初始化方法. 它这个对象自带 .next 方法来实现发布

第二个不同是 multiple subscribe

Observable multiple subscribe 会参数多条独立的 stream. 

Subjust multiple subscribe 则不会产生多条 stream. 每次 subscurbe 它只是把 callback 函数存起来, 发布时挨个调用而已 (典型的观察者模式实现)

如果有多个地方需要订阅subject,而又让他们互不影响的话，订阅的时候一定要asObservable(), 而不是直接subscribe()

6. [last]
有 first 自然就有 last. 不过 last 比较可爱的地方是, 怎么知道是最后一个呢? 

所以它需要一个 complete 才能确保哪一个是最后一个.

复制代码
const obs = new Observable<number>(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.next(4);
  subscriber.complete(); // 重要
});
obs.pipe(last(v => v % 2 !== 0)).subscribe(v => console.log(v)); // 3
复制代码
如果少了 complete, subscriber 将永远不会接收到 last value.

7. [takeUntil]
const obs = timer(0, 1000); // 0..1..2..3..4..5
obs.pipe(takeUntil(timer(3000))).subscribe(v => console.log(v)); // 0..1..2
一直拿到 3 秒, 往后的都不要了

takeUntil vs unsubscribe
takeUntil 的逻辑是，当 takeUntil 的 parameter 流发布后，takeUntil 会 unsubscribe 自己上游的流并且发布一个 complete 给下游。

unsubscribe 则是退订一个流。

takeUntil 可以在中间，退订上游，complete 下游，unsubscribe 则一定是最下游开始。

takeUntil 有 complete，unsubscribe 没有。

如果把 takeUntil 放到最下游，其效果和 unsubscribe 几乎一样 (除了 takeUntil 会发布 complete)，

如果把 takeUntil 放到中游或上游，它是退订上游，不再接收上游的发布，可是之前已经接收但下游还没有 process 完的依然是会继续执行的，这一点要特别注意。

8. [zip]
zip 和 combineLatest 有点像, 它们都会接收到所有 Observable 最新的值. 只是接收的时机不一样.

多个 Observable 发布的次数往往是没有规律的. 可能 o1 发布了 5 次, o2 才 2 次.

combineLatest 它不管大家的次数, 只要任何一个 Observable 发布, 那就把其它所有的值拉出来, 一起发布出去.

zip 则讲究次数, 只有当每一个 Observable 都达到相同次数, 它才会把每一个 Observable 那一次数的值取出来, 一起发布出去.

看下面这个例子

复制代码
  const s1 = new Subject();
  const s2 = new Subject();
  combineLatest([s1, s2]).subscribe(v => console.log(v));
  s1.next('s1');
  s2.next('s2'); // [s1, s2]
  s1.next('s11'); // [s11, s2]
  s1.next('s12'); // [s12, s2]
  s1.next('s13'); // [s13, s2]
  s2.next('s21'); // [s13, s21]

  zip([s1, s2]).subscribe(v => console.log(v));
  s1.next('s1');
  s2.next('s2'); // [s1, s2]
  s1.next('s11');
  s1.next('s12');
  s1.next('s13');
  s2.next('s21'); // [s11, s21]
复制代码
zip 最终 console 只响了 2 次. 而 combineLatest 响了 5 次.

虽然 s1 发布了 5 次, 但 zip 要求所有 Observable 必须要有相同次数, 而 s2 只有 2 次, 所以最终只能发布 2 次而已. 而第二次的发布, s1 的 value 并不是它最新的 value 而是它第 2 次发布的 value 哦.


9. [joinOper总结]
merge : 任何一个发布, 接收最新发布值

combineLatest : 任何一个发布, 接收所有最新的值 (开始接收条件: 所有 Observable 最少要有一次发布)

zip : 和 combineLatest 一样, 但它 care Observable 发布的次数. 当所有 Observable 都满足 n 次的时候发布, 接收第 n 次所有的值.

concat : 上一个 Observable complete 了才 subscribe 下一个

forkJoin: Promise.all, 所有 Observable complete 后, 接收所有最终的值

race : 第一个发布的 Observable 继续订阅, 退订其余的 Observale

partition : 通过 if else 把一个 Observable 拆分成 2 个

10. [Scheduler]
Types of Scheduler
在讲同步 change to 异步之前, 我们先来看看 RxJS 的有多少种 Scheduler

asyncScheduler
它是 setTimeout 这种 level 的, 异步 Macro

asapScheduler
它是 Promise.resolve 这种 level 的, 异步 Micro

animationFrameScheduler
它是 requestAnimationFrame 这种 level 的, 异步 Macro

queueScheduler
它是同步的, 但它可不是默认的同步机制哦, 默认的同步 (当我们没有设置时) 的效果和 queueScheduler 是有微小区别的, 下面会详细讲. 
11. [custom] operator
a. 直接传输
function myOperator(config: { dependObs: Observable<unknown> }): OperatorFunction<number, string> {

    const { dependObs }= config;  

    // 返回抄作符函数，参数是上游的stream
    return upstreamObs => {
      const downstreamObs = new Observable<string>(subscriber => {
  
        // 订阅 depend
        const dependObsSub = dependObs.subscribe(() => console.log('do something'));
  
        // 当下游stream被订阅，直接订阅上游stream
        const upstreamSub = upstreamObs.subscribe({
          next: upstreamValue => {
            const downStreamValue = upstreamValue + 'downstream value'; // decorate value for downstream
            subscriber.next(downStreamValue); // 发布到 downstream
          },
          error: error => subscriber.error(error), // 转发去 downstream
          complete: () => {
            // 释放 depend
            dependObsSub.unsubscribe();
            subscriber.complete();
          },   
        });
  
        return () => {
          upstreamSub.unsubscribe();
          // 释放 depend
          dependObsSub.unsubscribe();
        };
      });
  
      return downstreamObs;
    };
}
const source = timer(1000);
const dependObs = new Subject();
source.pipe(myOperator({ dependObs })).subscribe(v => console.log(v));

b. 缓存传输
import { Observable, OperatorFunction, Subject, takeUntil } from "rxjs";

const MAX_QUEUE_SIZE = 50;
export function ccbufferTime<T>(interval: Observable<number>): OperatorFunction<Observable<T>, Observable<T>> {
    let queue: T[] | null = [];
    let destroy$: Subject<void> | null = new Subject<void>;

    return upstreamObs => {
        const downstreamObs = new Observable<any>(subscriber => {
            upstreamObs.pipe(takeUntil(destroy$!)).subscribe({
                next: data => {
                    if(queue!.length >= MAX_QUEUE_SIZE) {
                        queue!.shift();
                    }
                    queue!.push(data as T);
                },
                error: error => subscriber.error(error),
                complete: () => {
                    subscriber.complete();
                }
            });

            interval.pipe(takeUntil(destroy$!)).subscribe(() => {
                let bs = 20;
				while (queue!.length > 0 && bs-- > 0) {
					const value = queue!.shift();
					subscriber.next(value);
				}
                // console.log(queue);
            });

            return () => {
                destroy$!.next();
                destroy$!.complete();
                queue = destroy$ = null;
            }

        });

        return downstreamObs;
    }
}
