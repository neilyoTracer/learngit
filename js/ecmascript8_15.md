# es8 2017
1. [尾随逗号]
2. [async/await]
3. [Object.values()]
4. [padStart/End]
   ```javascript
    const name = 'tari';
    console.log(name.padStart(9, ' ')); // '       tari'
   ```
5. [Object.getOwnPropertyDescriptors()]

# es9 2018
6. [异步生成器喝迭代]
   ```javascript
    function* asyncGenerator() { 
        yield new Promise(() => setTimeout(() => resolve('done this'), 2000));
        yield new Promise(() => setTimeout(() => resolve('done that'), 3000));
    }

    const asyncGen = asyncGenerator();
    asyncGen.next().value.then(console.log);
    asyncGen.next().value.then(console.log);

    //这是一个强大的工具，可以在web应用中以结构化+可读的方式流式传输数据 — 看看这个为类似YouTube的视频分享应用缓冲和流式传输数据的函数：

    async function* streamVideo({ id }) {
        let endOfVideo = false;
        const downloadChunk = async (sizeInBytes) => {
            const response = await fetch(`api.example.com/videos/${id}`);
            const {chunk, done} = await response.json();
            if(done) endOfVideo = true;
            return chunk;
        };

        while(!endOfVideo) {
            const bufferSize = 500 * 1024 * 1024;
            yield await downloadChunk(bufferSize);
        }
    }
    // 现在要消费这个生成器，我们将使用for await of — 异步迭代：
    for await (const chunk of streamVideo({id:2341})) { 
        // process video chunk
    }
   ```
7. [String.raw]
   ```javascript
    // 不再需要转义反斜杠，我们不用写：
    const filePath = 'C:\\Code\\JavaScript\\tests\\index.js';

    console.log(`The file path is ${filePath}`);

    // 而是写：
    const filePath = String.raw`C:\Code\JavaScript\tests\index.js`;
    console.log(`The file path is ${filePath}`);

    // Output: The file path is C:\Code\JavaScript\tests\index.js

    const patternString = 'The (\\w+) is (\\d+)';
    const pattern = new RegExp(patternString);

    const message = 'The number is 100';

    console.log(pattern.exec(message));
    // ['The number is 100', 'number', '100']


    const patternString = String.raw`The (\w+) is (\d+)`;
    const pattern = new RegExp(patternString);

    const message = 'The number is 100';

    console.log(pattern.exec(message));
    // ['The number is 100', 'number', '100']
   ```
8. [命名捕获组]
   ```javascript
    const str = 'The cat sat on a map';

    // $1 -> [a-z]
    // $2 -> a
    // $3 -> t

    // () indicates group
    str.replace(/([a-z])(a)(t)/g, '$1*$3');
    // -> The c*t s*t on a map

    // 通常，这些组按照它们在正则表达式中的相对位置命名：1, 2, 3...

    // 但这使得理解和更改那些愚蠢的长正则表达式变得更加困难。

    // 所以ES9通过?<name>来命名捕获组解决了这个问题：

    const str = 

    // left & right
    console.log(str.replace(/(?<left>[a-z])(a)(?<right>t)/g, '$<left>*$<right>'));
    
   ```

# es10 2019
9. [动态import]
   ```javascript
    if(user.is_admin) {
        const admin = await import('./admin.js');
        admin.setupDashboard(); 
    }

    // 基于用户或变量输入加载模块...
    const language = 'french';
    const translations = await import(`./translations/${language}.js`);
   ```
10. [Object.fromEntries()]
    ```javascript
        const entries = [['name', 'John'], ['age', 30]];
        const obj = Object.fromEntries(entries);
        console.log(obj); // { name: 'John', age: 30 }
    ```   
11. [trimStart()和trimEnd()]    
    ```javascript
        const str = '   Hello, World!   ';
        console.log(str.trimStart()); // 'Hello, World!   '
        console.log(str.trimEnd());   // '   Hello, World!'
    ```
12. [BigInt]
    ```javascript
    const bigInt = BigInt('23483329048902384092830489902384023840823');
    ```

# es13 
13. [顶级await]
    
# es14
14. [toSorted()toReversed()toSpliced()]
    ```javascript
        const numbers = [3, 1, 4, 1, 5];
        const sorted = numbers.toSorted((a, b) => a - b);
        console.log(sorted); // [1, 1, 3, 4, 5]
        console.log(numbers); // [3, 1, 4, 1, 5]
    ```

15. [findLast()和findLastIndex()]
16. [数组的with()]

# es15
17. [groupBy]
    ```javascript

        const fruits = [  { name: 'pineapple🍍', color: '🟡' },  { name: 'apple🍎', color: '🔴' },  { name: 'banana🍌', color: '🟡' },  { name: 'strawberry🍓', color: '🔴' },];const groupedByColor = Object.groupBy(  fruits,  (fruit, index) => fruit.color);// 原生 group by 示例console.log(groupedByColor);

        const array = [1, 2, 3, 4, 5];
        const odd = { odd: true };
        const even = { even: true };
        Map.groupBy(array, (num, index) => {  return num % 2 === 0 ? even : odd;});// => Map { {odd: true}: [1, 3, 5], {even: true}: [2, 4] }
    ```