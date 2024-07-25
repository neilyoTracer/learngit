function myOperator(config: { dependObs: Observable<unknown> }): OperatorFunction<number, string> {

    const { dependObs }= config;  

    return upstreamObs => {
      const downstreamObs = new Observable<string>(subscriber => {
  
        // 订阅 depend
        const dependObsSub = dependObs.subscribe(() => console.log('do something'));
  
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