# Day1: 


## Java程序基本结构
1. 注意public是访问修饰符，表示该class是公开的。不写public，也能正确编译，但是这个类将无法从命令行执行。
2. Java入口程序规定的方法必须是静态方法，方法名必须为main，括号内的参数必须是String数组。



## 变量和数据类型
1. 定义变量:
`int x = 1`
上述语句定义了一个整型int类型的变量，名称为x，初始值为1。
不写初始值，就相当于给它指定了默认值。**默认值总是0**。
2. 基本数据类型
   * 整数类型：byte，short，int，long
   * 浮点数类型：float，double
   * 字符类型：char
   * 布尔类型：boolean
3. 基本数据类型概念
   * Java定义的这些基本数据类型有什么区别呢？要了解这些区别，我们就必须简单了解一下计算机内存的基本结构。
     计算机内存的最小存储单元是**字节（byte）**，一个字节就是一个8位二进制数，即8个bit。
     它的二进制表示范围从**00000000~11111111**，换算成十进制是**0~255**，换算成十六进制是**00~ff**。
     内存单元从0开始编号，称为内存地址。每个内存单元可以看作一间房间，内存地址就是门牌号
4. **一个字节是1byte，1024字节是1K，1024K是1M，1024M是1G，1024G是1T。一个拥有4T内存的计算机的字节数量就是**
```
4T = 4 x 1024G
   = 4 x 1024 x 1024M
   = 4 x 1024 x 1024 x 1024K
   = 4 x 1024 x 1024 x 1024 x 1024byte
   = 4398046511104 x 8bit
```

5. 不同的数据类型占用的字节数不一样。我们看一下Java基本数据类型占用的字节数：
   * byte          1 byte
   * short         2 byte
   * int           4 byte
   * long          8 byte
   * float         4 byte
   * double        8 byte
   * char          2 byte
6. 整型
   * byte          -128 ~ 127
   * short         -32768 ~ 32767
   * int           -2147483648 ~ 2147483647
   * long          -9223372036854775808 ~ 9223372036854775807
7. 浮点型 对于float类型，需要加上f后缀
8. 布尔类型 Java语言对布尔类型的存储并没有做规定，因为理论上存储布尔类型只需要1 bit，但是通常JVM内部会把boolean表示为4字节整数
9. 字符类型
   * 字符类型char表示一个字符。Java的char类型除了可表示标准的ASCII外，还可以表示一个Unicode字符
   * **注意char类型使用单引号'，且仅有一个字符，要和双引号"的字符串类型区分开**
10. 常量 定义变量的时候，如果加上final修饰符，这个变量就变成了常量
   `final double PI = 3.14;`
11. var 想省略变量类型，可以使用var关键字
12. 小结 Java提供了两种变量类型：基本类型和引用类型

**************************************************************************************************************
# Day2: 

## 整数运算
1. 移位运算 对byte和short类型进行移位时，会首先转换为int再进行位移。仔细观察可发现，左移实际上就是不断地×2，右移实际上就是不断地÷2
2. 位运算 异或运算的规则是，如果两个数不同，结果为1，否则为0

## 浮点数运算
1. 浮点数运算和整数运算相比，只能进行加减乘除这些数值计算，不能做位运算和移位运算
2. 浮点数有个非常重要的特点，就是浮点数常常无法精确表示
3. 浮点数0.1在计算机中就无法精确表示，因为十进制的0.1换算成二进制是一个无限循环小数
4. 正确的比较方法是判断两个浮点数之差的绝对值是否小于一个很小的数
```java
   double r = Math.abs(x - y);
   // 再判断绝对值是否足够小:
   if (r < 0.00001) {
      // 可以认为相等
   } else {
      // 不相等
   }
```
5. 整数运算在除数为0时会报错，而浮点数运算在除数为0时，不会报错，但会返回几个特殊值
   * NaN
   * Infinity
   * -Infinity
6. 整型和浮点型运算时，整型会自动提升为浮点型

## 字符和字符串
1. 要显示一个字符的Unicode编码，只需将char类型直接赋值给int类型即可
2. 还可以直接用转义字符\u+Unicode编码来表示一个字符
`char c4 = '\u4e2d'; // '中'，因为十六进制4e2d = 十进制20013`
3. 和char类型不同，字符串类型String是引用类型，我们用双引号"..."表示字符串。
4. 常见的转义字符包括
   \" 表示字符"
   \' 表示字符'
   \\ 表示字符\
   \n 表示换行符
   \r 表示回车符
   \t 表示Tab
   \u#### 表示一个Unicode编码的字符
`String s = "ABC\n\u4e2d\u6587"; // 包含6个字符: A, B, C, 换行符, 中, 文`

**************************************************************************************************************
# Day3:

5. 从Java 13开始，字符串可以用"""..."""表示多行字符串（Text Blocks）了
6. 不可变特性

## 数组类型
1. 数组所有元素初始化为默认值，整型都是0，浮点型是0.0，布尔型是false
2. 数组是同一数据类型的集合,数组一旦创建后，大小就不可改变
3. 可以通过索引访问数组元素，但索引超出范围将报错
4. 数组元素可以是值类型（如int）或引用类型（如String），但数组本身是引用类型


## 输出和输入
1. System.out.println(). 
2. System.out.print().
3. System.out.printf("%.2f\n", d).
4. Java的格式化功能提供了多种占位符，可以把各种数据类型“格式化”成指定的字符串
%d	格式化输出整数
%x/%08x	格式化输出十六/八进制整数
%f	格式化输出浮点数
%e	格式化输出科学计数法表示的浮点数
%s	格式化字符串
`System.out.printf("n=%d, hex=%08x", n, n); // 注意，两个%占位符必须传入两个数`


**************************************************************************************************************
# Day4: 

## 流程语句
1. 判断引用类型相等,要用equals()方法判断的是结构或值是否相同， == 判断的是饮用是否相同
```java
public class Main {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = "HELLO".toLowerCase();
        System.out.println(s1);
        System.out.println(s2);
        if (s1.equals(s2)) {
            System.out.println("s1 equals s2");
        } else {
            System.out.println("s1 not equals s2");
        }
    }
}
```
2. yield 大多数时候，在switch表达式内部，我们会返回简单的值。但是，如果需要复杂的语句，
   我们也可以写很多语句，放到{...}里，然后，用yield返回一个值作为switch语句的返回值：
```java
public class Main {
    public static void main(String[] args) {
        String fruit = "orange";
        int opt = switch (fruit) {
            case "apple" -> 1;
            case "pear", "mango" -> 2;
            default -> {
                int code = fruit.hashCode();
                yield code; // switch语句返回值
            }
        };
        System.out.println("opt = " + opt);
    }
}
```

## 数组操作
1. 使用for each循环打印也很麻烦。幸好Java标准库提供了Arrays.toString()，可以快速打印数组内容
```java
import java.util.Arrays; // 引入java标准库

public class Main {
    public static void main(String[] args) {
        int[] ns = { 1, 1, 2, 3, 5, 8 };
        System.out.println(Arrays.toString(ns));
    }
}
```
2. 冒泡排序的特点是，每一轮循环后，最大的一个数被交换到末尾，因此，下一轮循环就可以“刨除”最后的数，每一轮循环都比上一轮循环的结束位置靠前一位
`int j = 0; j < ns.length - i - 1; j++`
3. Arrays.deepToString()
```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[][] ns = {
            { 1, 2, 3, 4 },
            { 5, 6, 7, 8 },
            { 9, 10, 11, 12 }
        };
        System.out.println(Arrays.deepToString(ns));
    }
}
```
## 命令行参数
1. 命令行参数类型是String[]数组
2. 命令行参数由JVM接收用户输入并传给main方法
3. 如何解析命令行参数需要由程序自己实现

**************************************************************************************************************
# Day5: 

## 面向对象编程 
### 方法
1. this变量 在方法内部，可以使用一个隐含的变量this，它始终指向当前实例。因此，通过this.field就可以访问当前实例的字段
2. 如果有局部变量和字段重名，那么局部变量优先级更高，就必须加上this
3. 可变参数用类型...定义，可变参数相当于数组类型
```java
class Group {
    private String[] names;

    public void setNames(String... names) {
        this.names = names;
    }
}

Group g = new Group();
g.setNames("Xiao Ming", "Xiao Hong", "Xiao Jun"); // 传入3个String
g.setNames("Xiao Ming", "Xiao Hong"); // 传入2个String
g.setNames("Xiao Ming"); // 传入1个String
g.setNames(); // 传入0个String
```

4. 参数绑定

### 构造方法
1. 一个类没有定义构造方法，编译器会自动为我们生成一个默认构造方法，它没有参数，也没有执行语句
2. 如果既要能使用带参数的构造方法，又想保留不带参数的构造方法，那么只能把两个构造方法都定义出来
3. 没有在构造方法中初始化字段时，引用类型的字段默认是null，数值类型的字段用默认值，int类型默认值是0，布尔类型默认值是false
4. 一个构造方法可以调用其他构造方法，这样做的目的是便于代码复用。调用其他构造方法的语法是this(…)

### 方法重载
1. 注意：方法重载的返回值类型通常都是相同的

### 继承
1. 在Java中，没有明确写extends的类，编译器会自动加上extends Object
2. Java只允许一个class继承自一个类，因此，一个类有且仅有一个父类
3. 因此我们得出结论：如果父类没有默认的构造方法，子类就必须显式调用super()并给出参数以便让编译器定位到父类的一个合适的构造方法
4. 即子类不会继承任何父类的构造方法

### 多态
1. Override(重写)和Overload(重载)不同的是，如果方法签名如果不同，就是Overload，Overload方法是一个新方法；如果方法签名相同，并且返回值也相同，就是Override
```java
class Student extends Person {
    @Override
    public void run() {
        System.out.println("Student.run");
    }
}
```
2. 在子类的覆写方法中，如果要调用父类的被覆写的方法，可以通过super来调用
3. 继承可以允许子类覆写父类的方法。如果一个父类不允许子类对它的某个方法进行覆写，可以把该方法标记为final。用final修饰的方法不能被Override
```java
public final String hello() {
   return "Hello, " + name;
}
```
4. 如果一个类不希望任何其他类继承自它，那么可以把这个类本身标记为final。**用final修饰的类不能被继承**
5. 对于一个类的实例字段，同样可以用final修饰。用final修饰的字段在初始化后不能被修改
6. Java的方法调用总是作用于运行期对象的实际类型，这种行为称为多态
7. final修饰符有多种作用：
   *final修饰的方法可以阻止被覆写；
   *final修饰的class可以阻止被继承；
   *final修饰的field必须在创建对象时初始化，随后不可修改
**************************************************************************************************************
# Day6: 

## 抽象类
1. 如果父类的方法本身不需要实现任何功能，仅仅是为了定义方法签名，目的是让子类去覆写它，那么，可以把父类的方法声明为抽象方法
```java
class Person {
    public abstract void run();
}
```
2. 因为无法执行抽象方法，因此这个类也必须申明为抽象类（abstract class）
### 面向抽象编程
1. 这种尽量引用高层类型，避免引用实际子类型的方式，称之为面向抽象编程
2. 面向抽象编程的本质就是：
   * 上层代码只定义规范（例如：abstract class Person）
   * 不需要子类就可以实现业务逻辑（正常编译）
   * 具体的业务逻辑由不同的子类实现，调用者并不关心
### 小结
* 通过abstract定义的方法是抽象方法，它只有定义，没有实现。抽象方法定义了子类必须实现的接口规范；
* 定义了抽象方法的class必须被定义为抽象类，从抽象类继承的子类必须实现抽象方法；
* **如果不实现抽象方法，则该子类仍是一个抽象类**；
* 面向抽象编程使得调用者只关心抽象方法的定义，不关心子类的具体实现。

## 接口
1. 如果一个抽象类没有字段，所有方法全部都是抽象方法, 就可以把该抽象类改写为接口：interface 。
```java
abstract class Person {
    public abstract void run();
    public abstract String getName();
}

interface Person {
    void run();
    String getName();
}
```
2. 当一个具体的class去实现一个interface时，需要使用implements关键字。
```java
class Student implements Person {
    private String name;

    public Student(String name) {
        this.name = name;
    }

    @Override
    public void run() {
        System.out.println(this.name + " run");
    }

    @Override
    public String getName() {
        return this.name;
    }
}
```

### 术语
* 注意区分术语：Java的接口特指interface的定义，表示一个接口类型和一组方法签名，而编程接口泛指接口规范，如方法签名，数据格式，网络协议等。
### 继承关系
1. 一般来说，公共逻辑适合放在abstract class中，具体逻辑放到各个子类，而接口层次代表抽象程度。
2. 在使用的时候，实例化的对象永远只能是某个具体的子类，但总是通过接口去引用它，因为接口比抽象类更抽象。
```java
List list = new ArrayList(); // 用List接口引用具体子类的实例
Collection coll = list; // 向上转型为Collection接口
Iterable it = coll; // 向上转型为Iterable接口
```

### default方法
```java
public class Main {
    public static void main(String[] args) {
        Person p = new Student("Xiao Ming");
        p.run();
    }
}

interface Person {
    String getName();
    default void run() {
        System.out.println(getName() + " run");
    }
}

class Student implements Person {
    private String name;

    public Student(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
```
**实现类可以不必覆写default方法。default方法的目的是，当我们需要给接口新增一个方法时，会涉及到修改全部子类。**
**如果新增的是default方法，那么子类就不必全部修改，只需要在需要覆写的地方去覆写新增方法。**

### 小结
* Java的接口（interface）定义了纯抽象规范，一个类可以实现多个接口；
* 接口也是数据类型，适用于向上转型和向下转型；
* 接口的所有方法都是抽象方法，接口不能定义实例字段；
* 接口可以定义default方法（JDK>=1.8）。

## 静态字段和静态方法
### 静态字段
1. 在一个class中定义的字段，我们称之为实例字段。还有一种字段，是用static修饰的字段，称为静态字段：static field。
```java
class Person {
    public String name;
    public int age;
    // 定义静态字段number:
    public static int number;
}
```
2. 对于静态字段，无论修改哪个实例的静态字段，效果都是一样的：所有实例的静态字段都被修改了，原因是静态字段并不属于实例。
3. 虽然实例可以访问静态字段，但是它们指向的其实都是Person class的静态字段。所以，所有实例共享一个静态字段
4. **不推荐用实例变量.静态字段去访问静态字段，因为在Java程序中，实例对象并没有静态字段。在代码中，实例对象能访问静态字段只是因为编译器可以根据实例类型自动转换为类名.静态字段来访问静态对象**
5. 推荐用类名来访问静态字段。**可以把静态字段理解为描述class本身的字段（非实例字段）**。对于上面的代码，更好的写法是：
```java
Person.number = 99;
System.out.println(Person.number);
```
### 静态方法
1. 有静态字段，就有静态方法。用static修饰的方法称为静态方法。
2. **因为静态方法属于class而不属于实例，因此，静态方法内部，无法访问this变量，也无法访问实例字段，它只能访问静态字段。**
3. 静态方法经常用于**工具类**。例如：
   * Arrays.sort()
   * Math.random()
   * 静态方法也经常用于**辅助方法**。注意到Java程序的入口main()也是静态方法。

### 接口的静态字段
1. 因为interface是一个纯抽象类，所以它不能定义实例字段。但是，interface是可以有静态字段的，并且静态字段必须为final类型
```java
public interface Person {
    public static final int MALE = 1;
    public static final int FEMALE = 2;
}
```
2. 因为interface的字段只能是public static final类型，所以我们可以把这些修饰符都去掉，上述代码可以简写为
```
public interface Person {
    // 编译器会自动加上public statc final:
    int MALE = 1;
    int FEMALE = 2;
}
```


**************************************************************************************************************
# Day7:
## 包
1. Java定义了一种名字空间，称之为包：package, 用来解决命名冲突
2. **一个类总是属于某个包，类名（比如Person）只是一个简写，真正的完整类名是包名.类名。**
3. 在定义class的时候，我们需要在第一行声明这个class属于哪个包。
```java
package ming; // 申明包名ming

public class Person {
}
```
4. 我们还需要按照包结构把上面的Java文件组织起来。假设以package_sample作为根目录，src作为源码目录，那么所有文件结构就是：
package_sample
└─ src
    ├─ hong
    │  └─ Person.java
    │  ming
    │  └─ Person.java
    └─ mr
       └─ jun
          └─ Arrays.java
5. 编译后的.class文件也需要按照包结构存放。如果使用IDE，把编译后的.class文件放到bin目录下，那么，编译的文件结构就是：
package_sample
└─ bin
   ├─ hong
   │  └─ Person.class
   │  ming
   │  └─ Person.class
   └─ mr
      └─ jun
         └─ Arrays.class
-————————————————————————————————————————————————
@Configuration
@ComponentScan
@PropertySource("app.properties") // 表示读取classpath的app.properties
public class AppConfig { 
    @Value("${app.zone:Z}")
    String zoneId;

    @Bean
    ZoneId createZoneId(@Value("${app.zone:Z}") String zoneId) { 
        return ZoneId.of(zoneId);
    }
}

@Component
public class SmtpConfig { 
    @Value("${smtp.host}")
    private String host;

    @Value("${smtp.port:25}")
    private int port;

    public String getHost() { 
        return host;
    }

    public int getPort() { 
        return port;
    }
}

# Day8:
1. public

## Java 核心类
### 字符串和编码
```java
public class Main {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = "HELLO".toLowerCase();
        System.out.println(s1 == s2); // false

        // 两个字符串比较，必须总是使用equals()方法
        System.out.println(s1.equals(s2)); // true

        // 忽略大小写比较
        s1.equalsIgnoreCase(s2);

        // 是否包含子串
        "Hello".contains("ll");

        // 搜索子串的更多例子
        "Hello".indexOf("l"); // 2
        "Hello".lastIndexOf("l"); // 3
        "Hello".startsWith("He"); // true;
        "Hello".endsWith("lo"); // true;

        // 提取子串的例子
        "Hello".substring(2); // "llo"
        "Hello".substring(2, 4); // "ll"

        // 去除首尾空白字符
        " \tHello\r\n ".trim(); // "Hello"

        // 另一个strip()方法也可以移除字符串首尾空白字符。它和trim()不同的是，类似中文的空格字符\u3000也会被移除：
        "\u3000Hello\u3000".strip(); // "Hello"
        " Hello ".stripLeading(); // "Hello "
        " Hello ".stripTrailing(); // " Hello"

        "".isEmpty(); // true, 因为字符串长度为0
        " ".isEmpty(); // false, 因为字符串长度不为0
        " \n".isBlank(); // true, 因为只包含空白字符
        " Hello ".isBlank(); // false, 因为包含非空白字符

        // 替换子串
        String s = "hello";
        s.replace('l', 'w');
        s.replace("ll", "~~");
        s.replaceAll("[\\,\\;\\s]+", ",");

        // 分割字符串
        String s = "A,B,C,D";
        String[] ss = s.split("\\,"); // {"A", "B", "C", "D"}

        // 拼接字符串
        String[] arr = {"A", "B", "C"};
        String s = String.join("***", arr); // "A***B***C"

        // 格式化字符串
        String s = "Hi %s, your score is %d!";
        System.out.println(s.formatted("Alice", 80));
        System.out.println(String.format("Hi %s, your score is %.2f!", "Bob", 59.5));
        
        /**
         * %s：显示字符串;
         * %d：显示整数；
         * %x：显示十六进制整数；
         * %f：显示浮点数。
         */

        // 类型转换
        String.valueOf(123); // "123"
        String.valueOf(45.67); // "45.67"
        String.valueOf(true); // "true"
        String.valueOf(new Object()); // 类似java.lang.Object@636be97c

        // 把字符串转换为 int 类型
        int n1 = Integer.parseInt("123"); // 123
        int n2 = Integer.parseInt("ff", 16); // 按16进制转换，255

        // 把字符串转换成 boolean 类型
        boolean b1 = Boolean.parseBoolean("true");
        boolean b1 = Boolean.parseBoolean("FALSE"); // false

        // 要特别注意，Integer有个getInteger(String)方法，它不是将字符串转换为int，而是把该字符串对应的系统变量转换为Integer：
        Integer.getInteger("java.version");

        // 转换为char[]
        char[] cs = "Hello".toCharArray();
        String s = new String(cs);
        // 如果修改了char[]数组，String并不会改变：
    }
}

// 从String的不变性设计可以看出，如果传入的对象有可能改变，我们需要复制而不是直接引用。

// 例如下面的代码设计了一个Score 类保存一组学生的成绩
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scores = new int[] {88, 77, 51, 66};
        Score s = new Score(scores);
        s.printScores();
        scores[2] = 99;
        s.printScores();   
    }
}

class Score {
    private char[] scores;
    public Score(int[] scores) {
        this.scores = this.cloneInput(scores);
    }

    public void printScores() {
        System.out.println(Arrays.toString(scores));
    }

    private char[] cloneInput(int[] scores) {
        char[] sc = {};
        for(int i = 0; i < scores.length; i++) {
            sc.push(String.valueOf(scores[i]));
        }
        return sc;
    }
}

// 观察两次输出，由于Score内部直接引用了外部传入的int[]数组，这会造成外部代码对int[]数组的修改，影响到Score类的字段。如果外部代码不可信，这就会造成安全隐患。

// 字符编码
byte[] b1 = "Hello".getBytes(); // 按系统默认编码转换，不推荐
byte[] b2 = "Hello".getBytes("UTF-8"); // 按UTF-8编码转换
byte[] b3 = "Hello".getBytes("GBK");
byte[] b4 = "Hello".getBytes(StandardCharsets.UTF_8); // 按UTF-8编码转换

// 注意：转换编码后，就不再是char类型，而是byte类型表示的数组。
/**
 * 小结
 * Java字符串String是不可变对象；
 * 字符串操作不改变原字符串内容，而是返回新字符串；
 * 常用的字符串操作：提取子串、查找、替换、大小写转换等；
 * Java使用Unicode编码表示String和char；
 * 转换编码就是将String和byte[]转换，需要指定编码；
 * 转换为byte[]时，始终优先考虑UTF-8编码。
 */
```
