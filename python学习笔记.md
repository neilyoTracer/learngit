# Python对bytes类型的数据用带b前缀的单引号或双引号表示：

```python
x = b'ABC'
```

# 如何判断一个对象是可迭代对象:

```python
from collections.abs import Iterable
isinstance('abc', Iterable)

# for dict
for value in d.values()

for k, v in d.items()

```

# for循环迭代generator

```python
g = (x * x for x in range(10))
for n in g:
print(n)

def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1
    return 'done'

# 但是用for循环调用generator时，发现拿不到generator的return语句的返回值。如果想要拿到返回值，必须捕获StopIteration错误，返回值包含在StopIteration的value中：

g = fib(6)
while True:
    try:
        x = next(g)
        print('g: ', x)
    except StopIteration as e:
        print('Generator return value: ', e.value)
        break    
```

# 把list, dict, str等Iterable变成Iterator可以使用iter()函数:

>>> isinstance(iter([]), Iterator) 

True

# pip install xxx

# pip install Anaconda

# 多态的好处就是，当我们需要传入Dog、Cat、Tortoise……时，我们只需要接收Animal类型就可以了，因为Dog、Cat、Tortoise……都是Animal类型，然后，按照Animal类型进行操作即可。由于Animal类型有run()方法，因此，传入的任意类型，只要是Animal类或者子类，就会自动调用实际类型的run()方法，这就是多态的意思：

# 对于一个变量，我们只需要知道它是Animal类型，无需确切地知道它的子类型，就可以放心地调用run()方法，而具体调用的run()方法是作用在Animal、Dog、Cat还是Tortoise对象上，由运行时该对象的确切类型决定，这就是多态真正的威力：调用方只管调用，不管细节，而当我们新增一种Animal的子类时，只要确保run()方法编写正确，不用管原来的代码是如何调用的。这就是著名的“开闭”原则：

# 对扩展开放：允许新增Animal子类；

# 对修改封闭：不需要修改依赖Animal类型的run_twice()等函数。

# 文件读写

```python
with open('/path/to/file', 'r') as f:
    print(f.read())
```

如果文件很小，read()一次性读取最方便；如果不能确定文件大小，反复调用read(size)比较保险；如果是配置文件，调用readlines()最方便：

```python
for line in f.readlines():
    print(line.strip()) # 把末尾的'\n'删掉
```

# 文件读写
f = open('/Users/michael/test.txt', 'r');

f = open('/Users/michael/notfound.txt', 'r')
f.read()
f.close()

try:
    f = open('/path/to/file', 'r')
    print(f.read())
finally:
    if f:
        f.close()

with open('/path/to/file', 'r') as f:
    print(f.read())    