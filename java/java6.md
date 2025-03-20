# 泛型
## 什么是泛型
```java
/**
 * 在讲解什么是泛型之前，我们先观察Java标准库提供的ArrayList，它可以看作“可变长度”的数组，因为用起来比数组更方便。

实际上ArrayList内部就是一个Object[]数组，配合存储一个当前分配的长度，就可以充当“可变数组”：
 */

public class ArrayList {
    private Object[] array;
    private int size;
    public void add(Object e) {}
    public void remove(int index) {}
    public Object get(int index) {}
}

/**
 * 如果用上述ArrayList存储String类型，会有这么几个缺点：

需要强制转型；
不方便，易出错。
例如，代码必须这么写：
 */

ArrayList list = new ArrayList();
list.add("Hello");
// 获取到Object, 必须强制转型为String
String first = (String) list.get(0);

// 很容易出现ClassCastException, 因为容易"误转型"
list.add(new Integer(123));
// ERROR: ClassCastException:
String second = (String) list.get(1);

// 要解决上述问题，我们可以为String单独编写一种ArrayList：

public class StringArrayList {
    private String[] array;
    private int size;
    public void add(String e) {...}
    public void remove(int index) {...}
    public String get(int index) {...}
}

// 然而，新的问题是，如果要存储Integer，还需要为Integer单独编写一种ArrayList：

public class IntegerArrayList {
    private Integer[] array;
    private int size;
    public void add(Integer e) {...}
    public void remove(int index) {...}
    public Integer get(int index) {...}
}

// 实际上，还需要为其他所有class单独编写一种ArrayList：

LongArrayList
DoubleArrayList
PersonArrayList
...
// 这是不可能的，JDK的class就有上千个，而且它还不知道其他人编写的class。

// 为了解决新的问题，我们必须把ArrayList变成一种模板：ArrayList<T>，代码如下：

public class ArrayList<T> {
    private T[] array;
    private int size;
    public void add(T e) {...}
    public void remove(int index) {...}
    public T get(int index) {...}
}

T可以是任何class。这样一来，我们就实现了：编写一次模版，可以创建任意类型的ArrayList：

// 创建可以存储String的ArrayList:
ArrayList<String> strList = new ArrayList<String>();
// 创建可以存储Float的ArrayList:
ArrayList<Float> floatList = new ArrayList<Float>();
// 创建可以存储Person的ArrayList:
ArrayList<Person> personList = new ArrayList<Person>();

因此，泛型就是定义一种模板，例如ArrayList<T>，然后在代码中为用到的类创建对应的ArrayList<类型>：

ArrayList<String> strList = new ArrayList<String>();
strList.add("hello"); // OK
String s = strList.get(0); // OK
strList.add(new Integer(123)); // compile error!
Integer n = strList.get(0); // compile error!
// 这样一来，既实现了编写一次，万能匹配，又通过编译器保证了类型安全：这就是泛型。

向上转型

// 在Java标准库中的ArrayList<T>实现了List<T>接口，它可以向上转型为List<T>：

public class ArrayList<T> implements List<T> {
    ...
}

List<String> list = new ArrayList<String>();

/**
 * 要特别注意：不能把ArrayList<Integer>向上转型为ArrayList<Number>或List<Number>。

这是为什么呢？假设ArrayList<Integer>可以向上转型为ArrayList<Number>，观察一下代码：
 */

// 创建ArrayList<Integer>类型：
ArrayList<Integer> integerList = new ArrayList<Integer>();
// 添加一个Integer：
integerList.add(new Integer(123));
// “向上转型”为ArrayList<Number>：
ArrayList<Number> numberList = integerList;
// 添加一个Float，因为Float也是Number：
numberList.add(new Float(12.34));
// 从ArrayList<Integer>获取索引为1的元素（即添加的Float）：
Integer n = integerList.get(1); // ClassCastException!

/**
 * 我们把一个ArrayList<Integer>转型为ArrayList<Number>类型后，这个ArrayList<Number>就可以接受Float类型，因为Float是Number的子类。但是，ArrayList<Number>实际上和ArrayList<Integer>是同一个对象，也就是ArrayList<Integer>类型，它不可能接受Float类型， 所以在获取Integer的时候将产生ClassCastException。
 */

实际上，编译器为了避免这种错误，根本就不允许把ArrayList<Integer>转型为ArrayList<Number>。

用一个图来表示泛型的继承关系，就是T不变时，可以向上转型，T本身不能向上转型：

  List<Integer>     ArrayList<Number>
    ▲                            ▲
    │                            │
    │                            X
    │                            │
ArrayList<Integer>  ArrayList<Integer>


```

小结
泛型就是编写模板代码来适应任意类型；

泛型的好处是使用时不必对类型进行强制转换，它通过编译器对类型进行检查；

注意泛型的继承关系：可以把ArrayList<Integer>向上转型为List<Integer>（T不能变！），但不能把ArrayList<Integer>向上转型为ArrayList<Number>（T不能变成父类）。

## 使用泛型
```java
// 使用ArrayList时，如果不定义泛型类型时，泛型类型实际上就是Object：
List list = new ArrayList();
list.add("Hello");
list.add("World");
String first = (String) list.get(0);
String second = (String) list.get(1);

/**
 * 此时，只能把<T>当作Object使用，没有发挥泛型的优势。

当我们定义泛型类型<String>后，List<T>的泛型接口变为强类型List<String>：
 */

// 无编译器警告
List<String> list = new ArrayList<String>();
list.add("Hello");
list.add("World");

// 无强制转型
String first = list.get(0);
String second = list.get(1);

// 当我们定义泛型类型<Number>后，List<T>的泛型接口变为强类型List<Number>：

List<Number> list = new ArrayList<Number>();
list.add(new Integer(123));
list.add(new Double(12.34));
Number first = list.get(0);
Number second = list.get(1);

// 编译器如果能自动推断出泛型类型，就可以省略后面的泛型类型。例如，对于下面的代码：
List<Number> list = new ArrayList<Number>();

//编译器看到泛型类型List<Number>就可以自动推断出后面的ArrayList<T>的泛型类型必须是ArrayList<Number>，因此，可以把代码简写为：

// 可以省略后面的Number，编译器可以自动推断泛型类型：
List<Number> list = new ArrayList<>();

泛型接口
/**
 * 除了ArrayList<T>使用了泛型，还可以在接口中使用泛型。例如，Arrays.sort(Object[])可以对任意数组进行排序，但待排序的元素必须实现Comparable<T>这个泛型接口：
 */

public interface Comparable<T> {
     /**
     * 返回负数: 当前实例比参数o小
     * 返回0: 当前实例与参数o相等
     * 返回正数: 当前实例比参数o大
     */
    int compareTo(T o);
}

// sort
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        String[] ss = new String[] {"Orange", "Apple", "Pear"};
        Array.sort(ss);
        System.out.println(Array.toString(ss));
    }
}

// 这是因为String本身已经实现了Comparable<String>接口。如果换成我们自定义的Person类型试试：

// sort
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Person[] ps = new Person[] {
            new Person("Bob", 61),
            new Person("Alice", 88),
            new Person("Lily", 75),
        };
        Arrays.sort(ps);
        System.out.println(Arrays.toString(ps));
    }
}

class Person {
    String name;
    int score;
    Person(String name, int score) {
        this.name = name;
        this.score = score;
    }
    public String toString() {
        return this.name + "," + this.score;
    }
}

// 运行程序，我们会得到ClassCastException，即无法将Person转型为Comparable。我们修改代码，让Person实现Comparable<T>接口：

// sort
import java.util.Array;

public class Main {
    public static void main(String[] args) {
        Person[] ps = new Person[] {
            new Person("Bob", 61);
            new Person("Alice", 88);
            new Person("Lily", 75);
        };
        Arrays.sort(ps);
        System.out.println(Arrays.toString(ps));
    }
}

class Person implements Comparable<Person> {
    String name;
    int score;
    Person(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public int compareTo(Person other) {
        return this.name.compareTo(other.name);
    }

    public String toString() {
        return this.name + "," + this.score;
    }
}

/**
 * 运行上述代码，可以正确实现按name进行排序。

也可以修改比较逻辑，例如，按score从高到低排序。请自行修改测试。
 */
```
小结
使用泛型时，把泛型参数<T>替换为需要的class类型，例如：ArrayList<String>，ArrayList<Number>等；

可以省略编译器能自动推断出的类型，例如：List<String> list = new ArrayList<>();；

不指定泛型参数类型时，编译器会给出警告，且只能将<T>视为Object类型；

可以在接口中定义泛型类型，实现此接口的类必须实现正确的泛型类型。

## 编写泛型
```java
/**
 * 编写泛型类比普通类要复杂。通常来说，泛型类一般用在集合类中，例如ArrayList<T>，我们很少需要编写泛型类。

如果我们确实需要编写一个泛型类，那么，应该如何编写它？

可以按照以下步骤来编写一个泛型类。

首先，按照某种类型，例如：String，来编写类：
 */

public class Pair {
    private String first;
    private String last;
    public Pair(String first, String last) {
        this.first = first;
        this.last = last;
    }

    public String getFirst() {
        return first;
    }

    public String getLast() {
        return last;
    }
}

// 然后，标记所有的特定类型，这里是String，把特定类型String替换为T，并申明<T>：
public class Pair<T> {
    private T first;
    private T last;
    public Pair(T first, T last) {
        this.first = first;
        this.last = last ;
    }

    public T getFirst() {
        return first;
    }

    public T getLast() {
        return last;
    }
}

// 熟练后即可直接从T开始编写。

静态方法
// 编写泛型类时，要特别注意，泛型类型<T>不能用于静态方法。例如：

public class Pair<T> {
    private T first;
    private T last;
    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }
    public T getFirst() { ... }
    public T getLast() { ... }

    // 对静态方法使用<T>:
    public static Pair<T> create(T first, T last) {
        return new Pair<T>(first, last);
    }
}

对于静态方法，我们可以单独改写为“泛型”方法，只需要使用另一个类型即可。对于上面的create()静态方法，我们应该把它改为另一种泛型类型，例如，<K>

public class Pair<T> {
    private T first;
    private T last;
    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }
    public T getFirst() { ... }
    public T getLast() { ... }

    // 静态泛型方法应该使用其他类型区分:
    public static Pair<K> create(K first, K last) {
        return new Pair<K>(first, last);
    }
}

// 这样才能清楚地将静态方法的泛型类型和实例类型的泛型类型区分开。

多个泛型类型
// 泛型还可以定义多种类型。例如，我们希望Pair不总是存储两个类型一样的对象，就可以使用类型<T, K>：

public class Pair<T, K> {
    private T first;
    private K last;
    public Pair(T first, K last) {
        this.first = first;
        this.last = last;
    }
    public T getFirst() {}
    public K getLast() {}
}

// 使用的时候，需要指出两种类型：
Pair<String, Integer> p = new Pair<>("test", 123);

//Java标准库的Map<K, V>就是使用两种泛型类型的例子。它对Key使用一种类型，对Value使用另一种类型。
```

编写泛型时，需要定义泛型类型<T>；

静态方法不能引用泛型类型<T>，必须定义其他类型（例如<K>）来实现静态泛型方法；
原因:
1. 泛型的本质
   在Java中，泛型的类型信息是在实例化类时才确定的，并且运行时通过类型擦除被移除
2. 静态方法的作用域
   静态方法属于类本身，不依赖于类的实例
   因为静态方法在类加载时就已经存在，而类的泛型是在创建对象实例时才确定的，这会导致静态方法无法知道泛型的具体类型
泛型可以同时定义多种类型，例如Map<K, V>。

## 擦拭法
```java
/**
 * 泛型是一种类似”模板代码“的技术，不同语言的泛型实现方式不一定相同。

Java语言的泛型实现方式是擦拭法（Type Erasure）。

所谓擦拭法是指，虚拟机对泛型其实一无所知，所有的工作都是编译器做的。

例如，我们编写了一个泛型类Pair<T>，这是编译器看到的代码：
 */
public class Pair<T> {
    private T first;
    private T last;

    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }

    public T getFirst() {
        return first;
    }

    public T getLast() {
        return last;
    }
}

/**
 * 因此，Java使用擦拭法实现泛型，导致了：

编译器把类型<T>视为Object；
编译器根据<T>实现安全的强制转型。
使用泛型的时候，我们编写的代码也是编译器看到的代码：
 */

Pair<String> p = new Pair<>("Hello", "world");
String first = p.getFirst();
String last = p.getLast();

// 而虚拟机执行的代码并没有泛型
Pair p = new Pair("Hello", "world");
String first = (String) p.getFirst();
String last = (String) p.getLast();

/**
 * 所以，Java的泛型是由编译器在编译时实行的，编译器内部永远把所有类型T视为Object处理，但是，在需要转型的时候，编译器会根据T的类型自动为我们实行安全地强制转型。
 */
了解了Java泛型的实现方式——擦拭法，我们就知道了Java泛型的局限：

局限一：<T>不能是基本类型，例如int，因为实际类型是Object，Object类型无法持有基本类型：
Pair<int> p = new Pair<>(1, 2); // compile error!

局限二：无法取得带泛型的Class。观察以下代码：

public class Main {
    public static void main(String[] args) {
        Pair<String> p1 = new Pair<>("Hello", "world");
        Pair<Integer> p2 = new Pair<>(123, 456);
        Class c1 = p1.getClass();
        Class c2 = p2.getClass();
        System.out.println(c1==c2); // true
        System.out.println(c1==Pair.class); // true
    }
}

class Pair<T> {
    private T first;
    private T last;
    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }
    public T getFirst() {
        return first;
    }
    public T getLast() {
        return last;
    }
}

/**
 * 因为T是Object，我们对Pair<String>和Pair<Integer>类型获取Class时，获取到的是同一个Class，也就是Pair类的Class。

换句话说，所有泛型实例，无论T的类型是什么，getClass()返回同一个Class实例，因为编译后它们全部都是Pair<Object>。
 */

局限三：无法判断带泛型的类型：

Pair<Integer> p = new Pair<>(123, 456);
// Compile error:
if (p instanceof Pair<String>) {
}

// 原因和前面一样，并不存在Pair<String>.class，而是只有唯一的Pair.class。

局限四：不能实例化T类型：

public class Pair<T> {
    private T first;
    private T last;
    public Pair() {
        // Compile error:
        first = new T();
        last = new T();
    }
}

// 上述代码无法通过编译，因为构造方法的两行语句：

first = new T();
last = new T();
// 擦拭后实际上变成了：

first = new Object();
last = new Object();


// 这样一来，创建new Pair<String>()和创建new Pair<Integer>()就全部成了Object，显然编译器要阻止这种类型不对的代码。

要实例化T类型，我们必须借助额外的Class<T>参数：

public class Pair<T> {
    private T first;
    private T last;
    public Pair(Class<T> clazz) {
        first = clazz.newInstance();
        last = clazz.newInstance();
    }
}

// 上述代码借助Class<T>参数并通过反射来实例化T类型，使用的时候，也必须传入Class<T>。例如：


// 因为传入了Class<String>的实例，所以我们借助String.class就可以实例化String类型。

// 有些时候，一个看似正确定义的方法会无法通过编译。例如：

public class Pair<T> {
    public boolean equals(T t) {
        return this == t;
    }
}

// 这是因为，定义的equals(T t)方法实际上会被擦拭成equals(Object t)，而这个方法是继承自Object的，编译器会阻止一个实际上会变成覆写的泛型方法定义。
// 换个方法名，避开与Object.equals(Object)的冲突就可以成功编译：

public class Pair<T> {
    public boolean same(T t) {
        return this == t;
    }
}

泛型继承

// 一个类可以继承自一个泛型类。例如：父类的类型是Pair<Integer>，子类的类型是IntPair，可以这么继承：
public class IntPair extends Pair<Integer> {}

// 使用的时候，因为子类IntPair并没有泛型类型，所以，正常使用即可：
IntPair ip = new IntPair(1, 2);

/**
 * 前面讲了，我们无法获取Pair<T>的T类型，即给定一个变量Pair<Integer> p，无法从p中获取到Integer类型。

但是，在父类是泛型类型的情况下，编译器就必须把类型T（对IntPair来说，也就是Integer类型）保存到子类的class文件中，不然编译器就不知道IntPair只能存取Integer这种类型。

在继承了泛型类型的情况下，子类可以获取父类的泛型类型。例如：IntPair可以获取到父类的泛型类型Integer。获取父类的泛型类型代码比较复杂：
 */

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public class Main {
    public static void main(String[] args) {
        Class<IntPair> clazz = IntPair.class;
        Type t = clazz.getGenericSuperclass();
        if(t instanceof ParameterizedType) {
            ParameterizedType pt = (ParameterizedType) t;
            Type[] types = pt.getActualTypeArguments(); // 可能有多个泛型类型
            Type fistType = types[0];
            Class<?> typeClass = (Class<?>) firstType;
            System.out.println(typeClass); // Integer
        }
    }
}

class Pair<T> {
    private T first;
    private T last;
    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }
    public T getFirst() {
        return first;
    }
    public T getLast() {
        return last;
    }
}

class IntPair extends Pair<Integer> {
    public IntPair(Integer first, Integer last) {
        super(first, last);
    }
}

// 因为Java引入了泛型，所以，只用Class来标识类型已经不够了。实际上，Java的类型系统结构如下：
┌────┐
                      │Type│
                      └────┘
                         ▲
                         │
   ┌────────────┬────────┴─────────┬───────────────┐
   │            │                  │               │
┌─────┐┌─────────────────┐┌────────────────┐┌────────────┐
│Class││ParameterizedType││GenericArrayType││WildcardType│
└─────┘└─────────────────┘└────────────────┘└────────────┘
小结
Java的泛型是采用擦拭法实现的；

擦拭法决定了泛型<T>：

不能是基本类型，例如：int；
不能获取带泛型类型的Class，例如：Pair<String>.class；
不能判断带泛型类型的类型，例如：x instanceof Pair<String>；
不能实例化T类型，例如：new T()。
泛型方法要防止重复定义方法，例如：public boolean equals(T obj)；

子类可以获取父类的泛型类型<T>。
```

## extends 通配符
```java
// 我们前面已经讲到了泛型的继承关系：Pair<Integer>不是Pair<Number>的子类。
// 假设我们定义了Pair<T>：
public class Pair<T> { ... }

// 然后，我们又针对Pair<Number>类型写了一个静态方法，它接收的参数类型是Pair<Number>：
public class PairHelper {
    static int add(Pair<Number> p) {
        Number first = p.getFirst();
        Number last = p.getLast();
        return first.intValue() + last.intValue();
    }
}

// 上述代码是可以正常编译的。使用的时候，我们传入：

init sum = PairHelper.add(new Pair<Number>(1, 2));

/**
 * 注意：传入的类型是Pair<Number>，实际参数类型是(Integer, Integer)。

既然实际参数是Integer类型，试试传入Pair<Integer>：
 */

public class Main {
    public static void main(String[] args) {
        Pair<Integer> p = new Pair<>(123, 456);
        int n = add(p);
        System.out.println(n);
    }
}

class Pair<T> {
    private T first;
    private T last;
    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }

    public T getFirst() {
        return first;
    }

    public T getLast() {
        return last;
    }
}
/**
 * 直接运行，会得到一个编译错误：

incompatible types: Pair<Integer> cannot be converted to Pair<Number>
原因很明显，因为Pair<Integer>不是Pair<Number>的子类，因此，add(Pair<Number>)不接受参数类型Pair<Integer>。

但是从add()方法的代码可知，传入Pair<Integer>是完全符合内部代码的类型规范，因为语句：
 */

Number first = p.getFirst();
Number last = p.getLast();

/**
 * 实际类型是Integer，引用类型是Number，没有问题。问题在于方法参数类型定死了只能传入Pair<Number>。

有没有办法使得方法参数接受Pair<Integer>？办法是有的，这就是使用Pair<? extends Number>使得方法接收所有泛型类型为Number或Number子类的Pair类型。我们把代码改写如下：
 */

public class Main {
    public static void main(String[] args) {
        Pair<Integer> p = new Pair<>(123, 456);
        int n = add(p);
        System.out.println(n);
    }

    static int add(Pair<? extends Number> p) {
        Number first = p.getFirst();
        Number last = p.getLast();
        return first.intValue() + last.intValue();
    }
}

class Pair<T> {
    private T first;
    private T last;
    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }
    public T getFirst() {
        return first;
    }
    public T getLast() {
        return last;
    }
}

这样一来，给方法传入Pair<Integer>类型时，它符合参数Pair<? extends Number>类型。这种使用<? extends Number>的泛型定义称之为上界通配符（Upper Bounds Wildcards），即把泛型类型T的上界限定在Number了。

除了可以传入Pair<Integer>类型，我们还可以传入Pair<Double>类型，Pair<BigDecimal>类型等等，因为Double和BigDecimal都是Number的子类。

如果我们考察对Pair<? extends Number>类型调用getFirst()方法，实际的方法签名变成了：

<? extends Number> getFirst();

即返回值是Number或Number的子类，因此，可以安全赋值给Number类型的变量：

Number x = p.getFirst();

// 然后，我们不可预测实际类型就是Integer，例如，下面的代码是无法通过编译的：

Integer x = p.getFirst();

// 这是因为实际的返回类型可能是Integer，也可能是Double或者其他类型，编译器只能确定类型一定是Number的子类（包括Number类型本身），但具体类型无法确定。

// 我们再来考察一下Pair<T>的set方法：

public class Main {
    public static void main(String[] args) {
        Pair<Integer> p = new Pair<>(123, 456);
        int n = add(p);
        System.out.println(n);
    }

    static int add(Pair<? extends Number> p) {
        Number first = p.getFirst();
        Number last = p.getLast();
        p.setFirst(new Integer(first.intValue() + 100));
        p.setLast(new Integer(last.intValue() + 100));
        return p.getFirst().intValue() + p.getLast().intValue();
    }
}

class Pair<T> {
    private T first;
    private T last;

    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }

    public T getFirst() {
        return first;
    }
    public T getLast() {
        return last;
    }
    public void setFirst(T first) {
        this.first = first;
    }
    public void setLast(T last) {
        this.last = last;
    }
}
/**
 * 不出意外，我们会得到一个编译错误：

incompatible types: Integer cannot be converted to CAP#1
where CAP#1 is a fresh type-variable:
    CAP#1 extends Number from capture of ? extends Number
编译错误发生在p.setFirst()传入的参数是Integer类型。有些童鞋会问了，既然p的定义是Pair<? extends Number>，那么setFirst(? extends Number)为什么不能传入Integer？

原因还在于擦拭法。如果我们传入的p是Pair<Double>，显然它满足参数定义Pair<? extends Number>，然而，Pair<Double>的setFirst()显然无法接受Integer类型。

这就是<? extends Number>通配符的一个重要限制：
 */

方法参数签名setFirst(? extends Number)无法传递任何Number的子类型给setFirst(? extends Number)。

这里唯一的例外是可以给方法参数传入null：

p.setFirst(null); // ok, 但是后面会抛出NullPointerException
p.getFirst().intValue(); // NullPointerException

extends通配符的作用

// 如果我们考察Java标准库的java.util.List<T>接口，它实现的是一个类似“可变数组”的列表，主要功能包括：
public interface List<T> {
    int size(); // 获取个数
    T get(int index); // 根据索引获取指定元素
    void add(T t); // 添加一个新元素
    void remove(T t);
}

// 现在，让我们定义一个方法来处理列表的每个元素：
int sumOfList(List<? extends Integer> list) {
    int sum = 0;
    for (int i = 0; i < list.size(); i++) {
        Integer n = list.get(i);
        sum += n;
    }
    return sum;
}

/**
 * 为什么我们定义的方法参数类型是List<? extends Integer>而不是List<Integer>？从方法内部代码看，传入List<? extends Integer>或者List<Integer>是完全一样的，但是，注意到List<? extends Integer>的限制：

允许调用get()方法获取Integer的引用；
不允许调用set(? extends Integer)方法并传入任何Integer的引用（null除外）。
因此，方法参数类型List<? extends Integer>表明了该方法内部只会读取List的元素，不会修改List的元素（因为无法调用add(? extends Integer)、remove(? extends Integer)这些方法。换句话说，这是一个对参数List<? extends Integer>进行只读的方法（恶意调用set(null)除外）。
 */

使用extends限定T类型
// 在定义泛型类型Pair<T>的时候，也可以使用extends通配符来限定T的类型：

public class Pair<T extends Number> { ... }
// 现在，我们只能定义：

Pair<Number> p1 = null;
Pair<Integer> p2 = new Pair<>(1, 2);
Pair<Double> p3 = null;
// 因为Number、Integer和Double都符合<T extends Number>。

// 非Number类型将无法通过编译：

Pair<String> p1 = null; // compile error!
Pair<Object> p2 = null; // compile error!
// 因为String、Object都不符合<T extends Number>，因为它们不是Number类型或Number的子类。

小结
使用类似<? extends Number>通配符作为方法参数时表示：

方法内部可以调用获取Number引用的方法，例如：Number n = obj.getFirst();；
方法内部无法调用传入Number引用的方法（null除外），例如：obj.setFirst(Number n);。
即一句话总结：使用extends通配符表示可以读，不能写。

使用类似<T extends Number>定义泛型类时表示：

泛型类型限定为Number以及Number的子类。
```

## super通配符
```java
// 我们前面已经讲到了泛型的继承关系：Pair<Integer>不是Pair<Number>的子类。
// 考察下面的set方法:
void set(Pair<Integer> p, Integer first, Integer last) {
    p.setFirst(first);
    p.setLast(last);
}

// 传入Pair<Integer>是允许的，但是传入Pair<Number>是不允许的。
// 和extends通配符相反，这次，我们希望接受Pair<Integer>类型，以及Pair<Number>、Pair<Object>，因为Number和Object是Integer的父类，setFirst(Number)和setFirst(Object)实际上允许接受Integer类型。

我们使用super通配符来改写这个方法：

void set(Pair<? super Integer> p, Integer first, Integer last) {
    p.setFirst(first);
    p.setLast(last);
}

// 注意到Pair<? super Integer>表示，方法参数接受所有泛型类型为Integer或Integer父类的Pair类型。

// 下面的代码可以被正常编译：
public class Main {
    public static void main(String[] args) {
        Pair<Number> p1 = new Pair<>(12.3, 4.56);
        Pair<Integer> p2 = new Pair<>(123, 456);
        setSame(p1, 100);
        setSame(p2, 200);
        System.out.println(p1.getFirst() + ", " + p1.getLast());
        System.out.println(p2.getFirst() + ", " + p2.getLast());
    }

    static void setSave(Pair<? super Integer> p, Integer n) {
        p.setFirst(n);
        p.setLast(n);
    }
}

class Pair<T> {
    private T first;
    private T last;

    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }

    public T getFirst() {
        return first;
    }
    public T getLast() {
        return last;
    }
    public void setFirst(T first) {
        this.first = first;
    }
    public void setLast(T last) {
        this.last = last;
    }
}

// 考察Pair<? super Integer>的setFirst()方法，它的方法签名实际上是：
void setFirst(? super Integer);

// 再考察Pair<? super Integer>的getFirst()方法，它的方法签名实际上是：
? super Integer getFirst();

// 这里注意到我们无法使用Integer类型来接收getFirst()的返回值，即下面的语句将无法通过编译：
Interger x = p.getFirst(); // compile error!

/**
 * 因为如果传入的实际类型是Pair<Number>，编译器无法将Number类型转型为Integer。

注意：虽然Number是一个抽象类，我们无法直接实例化它。但是，即便Number不是抽象类，这里仍然无法通过编译。此外，传入Pair<Object>类型时，编译器也无法将Object类型转型为Integer。

唯一可以接收getFirst()方法返回值的是Object类型：
 */
Object obj = p.getFirst();

/**
 * 因此，使用<? super Integer>通配符表示：

允许调用set(? super Integer)方法传入Integer的引用；
不允许调用get()方法获得Integer的引用。
唯一例外是可以获取Object的引用：Object o = p.getFirst()。

 */
换句话说，使用<? super Integer>通配符作为方法参数，表示方法内部代码对于参数只能写，不能读。

对比extends和super通配符
/**
 * 
 * 我们再回顾一下extends通配符。作为方法参数，<? extends T>类型和<? super T>类型的区别在于：

<? extends T>允许调用读方法T get()获取T的引用，但不允许调用写方法set(T)传入T的引用（传入null除外）；
<? super T>允许调用写方法set(T)传入T的引用，但不允许调用读方法T get()获取T的引用（获取Object除外）。
一个是允许读不允许写，另一个是允许写不允许读。

先记住上面的结论，我们来看Java标准库的Collections类定义的copy()方法：
 */
public class Collections {
    // 把src的每个元素复制到dest中:
    public static <T> void copy(List<? super T> dest, List<? extends T> src) {
        for(int i = 0; i < src.size(); i++) {
            T t = src.get(i);
            dest.add(t);
        }
    }
}

/**
 * 它的作用是把一个List的每个元素依次添加到另一个List中。它的第一个参数是List<? super T>，表示目标List，第二个参数List<? extends T>，表示要复制的List。我们可以简单地用for循环实现复制。在for循环中，我们可以看到，对于类型<? extends T>的变量src，我们可以安全地获取类型T的引用，而对于类型<? super T>的变量dest，我们可以安全地传入T的引用。

这个copy()方法的定义就完美地展示了extends和super的意图：

copy()方法内部不会读取dest，因为不能调用dest.get()来获取T的引用；
copy()方法内部也不会修改src，因为不能调用src.add(T)。
这是由编译器检查来实现的。如果在方法代码中意外修改了src，或者意外读取了dest，就会导致一个编译错误：
 */

public class Collections {
    // 把src的每个元素复制到dest中:
    public static <T> void copy(List<? super T> dest, List<? extends T> src) {
        ...
        T t = dest.get(0); // compile error!
        src.add(t); // compile error!
    }
}

// 这个copy()方法的另一个好处是可以安全地把一个List<Integer>添加到List<Number>，但是无法反过来添加：
// copy List<Integer> to List<Number> ok:
List<Number> numList = ...;
List<Integer> intList = ...;
Collections.copy(numList, intList);

// ERROR: cannot copy List<Number> to List<Integer>:
Collections.copy(intList, numList);

// 而这些都是通过super和extends通配符，并由编译器强制检查来实现的。

PECS 原则
何时使用extends，何时使用super？为了便于记忆，我们可以用PECS原则：Producer Extends Consumer Super。

// 即：如果需要返回T，它是生产者（Producer），要使用extends通配符；如果需要写入T，它是消费者（Consumer），要使用super通配符。

// 还是以Collections的copy()方法为例：
public class Collections {
    public static <T> void copy(List<? super T> dest, List<? extends T> src) {
        for(int i = 0; i < src.size(); i++) {
            T t = src.get(i); // src 是producer
            dest.add(t); // dest 是consumer
        }
    }
}

需要返回T的src是生产者，因此声明为List<? extends T>，需要写入T的dest是消费者，因此声明为List<? super T>。

无限定通配符

// 我们已经讨论了<? extends T>和<? super T>作为方法参数的作用。实际上，Java的泛型还允许使用无限定通配符（Unbounded Wildcard Type），即只定义一个?：

void sample(Pair<?> p) {
}

/* 因为<?>通配符既没有extends，也没有super，因此：

不允许调用set(T)方法并传入引用（null除外）；
不允许调用T get()方法并获取T引用（只能获取Object引用）。
换句话说，既不能读，也不能写，那只能做一些null判断： */

static boolean isNull(Pair<?> p) {
    return p.getFirst() == null || p.getLast() == null;
}
// 大多数情况下，可以引入泛型参数<T>消除<?>通配符：

static <T> boolean isNull(Pair<T> p) {
    return p.getFirst() == null || p.getLast() == null;
}

// <?>通配符有一个独特的特点，就是：Pair<?>是所有Pair<T>的超类：

public class Main {
    public static void main(String[] args) {
        Pair<Integer> p = new Pair<>(123, 456);
        Pair<?> p2 = p; // 安全地向上转型
        System.out.println(p2.getFirst() + ", " + p2.getLast());
    }
}

class Pair<T> {
    private T first;
    private T last;

    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }

    public T getFirst() {
        return first;
    }
    public T getLast() {
        return last;
    }
    public void setFirst(T first) {
        this.first = first;
    }
    public void setLast(T last) {
        this.last = last;
    }
}
// 上述代码是可以正常编译运行的，因为Pair<Integer>是Pair<?>的子类，可以安全地向上转型。

小结
使用类似<? super Integer>通配符作为方法参数时表示：

方法内部可以调用传入Integer引用的方法，例如：obj.setFirst(Integer n);；
方法内部无法调用获取Integer引用的方法（Object除外），例如：Integer n = obj.getFirst();。
即使用super通配符表示只能写不能读。

使用extends和super通配符要遵循PECS原则。

无限定通配符<?>很少使用，可以用<T>替换，同时它是所有<T>类型的超类。
```
