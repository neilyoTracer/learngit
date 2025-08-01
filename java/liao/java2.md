### StringBuilder
```java
    String s = "";
    for(int i = 0;i < 1000; i++) { 
        s = s + "," + i;
    }

    /**
     * 虽然可以直接拼接字符串，但是，在循环中，每次循环都会创建新的字符串对象，然后扔掉旧的字符串
     * 这样，绝大部分字符串都是临时对象，不但浪费内存，还会影响GC效率。
     * 为了能高效拼接字符串，Java标准库提供了StringBuilder，它是一个可变对象，可以预分配缓冲区
     * 这样，往StringBuilder中新增字符时，不会创建新的临时对象：
     */

    StringBuilder sb = new StringBuilder(1024);
    for(int i = 0; i < 1000; i++) {
        sb.append(',');
        sb.append(i);
    }
    String s = sb.toString();

    // 链式操作
    public class Main {
        public static void main(String[] args) {
            var sb = new StringBuilder(1024);
            sb.append("Mr ")
              .append("Bob")
              .append("!")
              .insert(0, "Hello, ");
            System.out.println(sb.toString());
        }
    }

    // 仿照StringBuilder，我们也可以设计支持链式操作的类。例如，一个可以不断增加的计数器：
    public class Main {
        public static void main(String[] args) {
            Adder adder = new Adder();
            adder.add(3).add(5).inc().add(10);
            System.out.println(adder.value());
        }
    }

    class Adder {
        private int sum = 0;

        public Adder add(int n) {
            sum += n;
            return this;
        }

        public Adder inc() {
            sum ++;
            return this;
        }

        public int value() {
            return sum;
        }
    }
```

### StringJoiner
```java
// 很多时候，我们拼接的字符串像这样：
public class Main {
    public static void main(String[] args) {
        String[] names = {"Bob", "Alice", "Grace"};
        var sb = new StringBuilder();
        sb.append("Hello ");
        for(String name: names) {
            sb.append(name).append(", ");
        }

        sb.delete(sb.length() - 2, sb.length());
        sb.append("!");
        System.out.println(sb.toString());
    }
}

// 类似用分隔符拼接数组的需求很常见，所以Java标准库还提供了一个StringJoiner来干这个事：
import java.util.StringJoiner;
public class Main {
    public static void main(String[] args) {
        String[] names = {"Bob", "Alice", "Grace"};
        // var sj = new StringJoiner(", ");
        // 用StringJoiner的结果少了前面的"Hello "和结尾的"!"！遇到这种情况，需要给StringJoiner指定“开头”和“结尾”：
        var sj = new StringJoiner(", ", "Hello ", "!");
        for(String name: names) {
            sj.add(name);
        }
        System.out.println(sj.toString());

        // String还提供了一个静态方法join()，这个方法在内部使用了StringJoiner来拼接字符串，在不需要指定“开头”和“结尾”的时候，用String.join()更方便：
        String[] names = {"Bob", "Alice", "Grace"};
        var s = String.join(", ", names);
    }
}
```

### 包装类型
```java
/**
 * 我们已经知道，Java的数据类型分两种：
 * 基本类型：byte，short，int，long，boolean，float，double，char；
 * 引用类型：所有class和interface类型。
 * 引用类型可以赋值为null，表示空，但基本类型不能赋值为null：
 */
String s = null;
int n = null; // compile error!
/**
 * 那么，如何把一个基本类型视为对象（引用类型）？
 * 比如，想要把int基本类型变成一个引用类型，我们可以定义一个Integer类，它只包含一个实例字段int
 * 样，Integer类就可以视为int的包装类（Wrapper Class）：
 */
public class Integer {
    private int value;
    
    public Integer(int value) {
        this.value = value;
    }

    public int intValue() {
        return this.value;
    }
}

Integer n = null;
Integer n2 = new Integer(99);
int n3 = n2.intValue();

/**
 * 实际上，因为包装类型非常有用，Java核心库为每种基本类型都提供了对应的包装类型：
 * 基本类型	对应的引用类型
 * boolean	java.lang.Boolean
 * byte	java.lang.Byte
 * short	java.lang.Short
 * int	java.lang.Integer
 * long	java.lang.Long
 * float	java.lang.Float
 * double	java.lang.Double
 * char	java.lang.Character
 */

import java.lang.Integer;

// 我们可以直接使用，并不需要自己去定义：
public class Main {
    public static void main(String[] args) {
        int i = 100;
        // 通过new操作符创建Integer实例(不推荐使用,会有编译警告):
        Integer n1 = new Integer(i);
        // 通过静态方法valueOf(int)创建Integer实例:
        Integer n2 = Integer.valueOf(i);
        // 通过静态方法valueOf(String)创建Integer实例:
        Integer n3 = Integer.valueOf("100");
        System.out.println(n3.intValue());
    }
}

// Auto Boxing
int i = 100;
Integer n = Integer.valueOf(i);
int x = n.intValue();

Integer n = 100;
int x = n;

// 
这种直接把int变为Integer的赋值写法，称为自动装箱（Auto Boxing），反过来，把Integer变为int的赋值写法，称为自动拆箱（Auto Unboxing）。

//  注意
自动装箱和自动拆箱只发生在编译阶段，目的是为了少写代码。

装箱和拆箱会影响代码的执行效率，因为编译后的class代码是严格区分基本类型和引用类型的。并且，自动拆箱执行时可能会报NullPointerException：

// NullPointerException
public class Main {
    public static void main(String[] args) {
        Integer n = null;
        int i = n;
    }
}

# 不变类
所有的包装类型都是不变类。我们查看Integer的源码可知，它的核心代码如下：
public final class Integer {
    private final int value;
}

对两个Integer实例进行比较要特别注意：绝对不能用==比较，因为Integer是引用类型，必须使用equals()比较：

public class Main {
    public static void main(String[] args) {
        Integer x = 127;
        Integer y = 127;
        Integer m = 99999;
        Integer n = 99999;
        System.out.println("x == y: " + (x==y)); // true
        System.out.println("m == n: " + (m==n)); // false
        System.out.println("x.equals(y): " + x.equals(y)); // true
        System.out.println("m.equals(n): " + m.equals(n)); // true
    }
}

仔细观察结果的童鞋可以发现，==比较，较小的两个相同的Integer返回true，较大的两个相同的Integer返回false，这是因为Integer是不变类，编译器把Integer x = 127;自动变为Integer x = Integer.valueOf(127);，为了节省内存，Integer.valueOf()对于较小的数，始终返回相同的实例，因此，==比较“恰好”为true，但我们绝不能因为Java标准库的Integer内部有缓存优化就用==比较，必须用equals()方法比较两个Integer。


最佳实践

按照语义编程，而不是针对特定的底层实现去“优化”。
方法1：Integer n = new Integer(100);
方法2：Integer n = Integer.valueOf(100);

方法2更好，因为方法1总是创建新的Integer实例，方法2把内部优化留给Integer的实现者去做，即使在当前版本没有优化，也有可能在下一个版本进行优化。

我们把能创建“新”对象的静态方法称为静态工厂方法。Integer.valueOf()就是静态工厂方法，它尽可能地返回缓存的实例以节省内存。

最佳实践

创建新对象时，优先选用静态工厂方法而不是new操作符。

# 进制转换

public class Main {
    public static void main(String[] args) {
        Integer.parseInt("100") // 100
        Integer.parseInt("100", 16); // 256
        Integer.toString(100); // "100";
        Integer.toString(100, 36); // "2s", 表示为36进制
        Integer.toHexString(100); // "64", 表示16进制
        Integer.toOctalString(100); // "144", 表示8进制
        Integer.toBinaryString(100); // "1100100", 表示2进制
    }
}

注意：上述方法的输出都是String，在计算机内存中，只用二进制表示，不存在十进制或十六进制的表示方法。int n = 100在内存中总是以4字节的二进制表示：
│00000000│00000000│00000000│01100100│

Java的包装类型还定义了一些有用的静态变量
Boolean t = Boolean.TRUE;
Boolean f = Boolean.FALSE;
int max = Integer.MAX_VALUE;
int min = Integer.MIN_VALUE;
int sizeOfLong = Long.SIZE;
int bytesOfLong = Long.BYTES;

最后，所有的整数和浮点数的包装类型都继承自Number，因此，可以非常方便地直接通过包装类型获取各种基本类型：
Number num = new Integer(999);
byte b = num.byteValue();
int n = num.intvalue();
long ln = num.langValue();
float f = num.floatValue();
double d = num.doubleValue();

# 处理无符号整型
在Java中，并没有无符号整型（Unsigned）的基本数据类型。byte、short、int和long都是带符号整型，最高位是符号位。而C语言则提供了CPU支持的全部数据类型，包括无符号整型。无符号整型和有符号整型的转换在Java中就需要借助包装类型的静态方法完成。

例如，byte是有符号整型，范围是-128~+127，但如果把byte看作无符号整型，它的范围就是0~255。我们把一个负的byte按无符号整型转换为int：

public class Main {
    public static void main(String[] args) {
        byte x = -1;
        byte y = 127;
        System.out.println(Byte.toUnsignedInt(x)); // 255
        System.out.println(Byte.toUnsignedInt(y)); // 127
    }
}

因为byte的-1的二进制表示是11111111，以无符号整型转换后的int就是255。

小结
Java核心库提供的包装类型可以把基本类型包装为class；

自动装箱和自动拆箱都是在编译期完成的（JDK>=1.5）；

装箱和拆箱会影响执行效率，且拆箱时可能发生NullPointerException；

包装类型的比较必须使用equals()；

整数和浮点数的包装类型都继承自Number；

包装类型提供了大量实用方法。
```

### JavaBean
```java
在Java中，有很多class的定义都符合这样的规范：

若干private实例字段；
通过public方法来读写实例字段。
例如：
public class Person {
    private String name;
    private int age;

    public String getName() { return this.name; }
    public void setName(String name) { return this.name = name; }

    public int getAge() { return this.age; }
    public void setAge(int age) { this.age = age; } 
}

如果读写方法符合以下这种命名规范：
// 读方法:
public Type getXyz()
// 写方法:
public void setXyz(Type value)
那么这种class被称为JavaBean：

boolean字段比较特殊，它的读方法一般命名为isXyz()：

// 读方法:
public boolean isChild()
// 写方法:
public void setChild(boolean value)

JavaBean的作用
JavaBean主要用来传递数据，即把一组数据组合成一个JavaBean便于传输。此外，JavaBean可以方便地被IDE工具分析，生成读写属性的代码，主要用在图形界面的可视化设计中。

枚举JavaBean属性
要枚举一个JavaBean的所有属性，可以直接使用Java核心库提供的Introspector：

import java.beans.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BeanInfo info = Introspector.getBeanInfo(Person.class);
        for(PropertyDescriptor pd: info.getPropertyDescriptor()) {
            System.out.println(pd.getName());
            System.out.println("  " + pd.getReadMethod());
            System.out.println("  " + pd.getWriteMethod());
        }
    }
}

class Person {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

### 枚举类
```java
为了让编译器能自动检查某个值在枚举的集合内，并且，不同用途的枚举需要不同的类型来标记，不能混用，我们可以使用enum来定义枚举类：

enum
public class Main {
    public static void main(String[] args) {
        Weekday day = Weekday.SUN;
        if (day == Weekday.SAT || day == Weekday.SUN) {
            System.out.println("Work at home!");
        } else {
            System.out.println("Work at office!");
        }
    }
}

enum Weekday {
    SUN, MON, TUE, WED, THU, FRI, SAT;
}

enum的比较
使用enum定义的枚举类是一种引用类型。前面我们讲到，引用类型比较，要使用equals()方法，如果使用==比较，它比较的是两个引用类型的变量是否是同一个对象。因此，引用类型比较，要始终使用equals()方法，但enum类型可以例外。
这是因为enum类型的每个常量在JVM中只有一个唯一实例，所以可以直接用==比较：
if (day == Weekday.FRI) { // ok!
}
if (day.equals(Weekday.SUN)) { // ok, but more code!
}

enum类型
通过enum定义的枚举类，和其他的class有什么区别？

答案是没有任何区别。enum定义的类型就是class，只不过它有以下几个特点：

定义的enum类型总是继承自java.lang.Enum，且无法被继承；
只能定义出enum的实例，而无法通过new操作符创建enum的实例；
定义的每个实例都是引用类型的唯一实例；
可以将enum类型用于switch语句。
public enum Color {
    RED, GREEN, BLUE;
}

编译器编译出的class大概就像这样
public final class Color extends Enum {
    public static final Color RED = new Color();
    public static final Color GREEN = new Color();
    public static final Color BLUE = new Color();

    private Color() {}
}

所以，编译后的enum类和普通class并没有任何区别。但是我们自己无法按定义普通class那样来定义enum，必须使用enum关键字，这是Java语法规定的。

因为enum是一个class，每个枚举的值都是class实例，因此，这些实例有一些方法：
name()
String s = Weekday.SUN.name(); // "SUN"
ordinal()
int n = Weekday.MON.ordinal(); // 1

要编写健壮的代码，就不要依靠ordinal()的返回值。因为enum本身是class，所以我们可以定义private的构造方法，并且，给每个枚举常量添加字段：

public class Main {
    public static void main(String[] args) {
        Weekday day = Weekday.SUN;
        if (day.dayValue == 6 || day.dayValue == 0) {
            System.out.println("Work at home!");
        } else {
            System.out.println("Work at office!");
        }
    }
}

enum Weekday {
    MON(1), TUE(2), WED(3), THU(4), FRI(5), SAT(6), SUN(0);

    public final int dayValue;
    private Weekday(int dayValue) {
        this.dayValue = dayValue;
    }
}


默认情况下，对枚举常量调用toString()会返回和name()一样的字符串。但是，toString()可以被覆写，而name()则不行。我们可以给Weekday添加toString()方法：

enum Weekday {
    MON(1, "星期一"), TUE(2, "星期二"), WED(3, "星期三"), THU(4, "星期四"), FRI(5, "星期五"), SAT(6, "星期六"), SUN(0, "星期日");

    public final int dayValue;
    private final String chinese;

    private Weekday(int dayValue, String chinese) {
        this.dayValue = dayValue;
        this.chinese = chinese;
    }

    @Override
    public String toString() {
        return this.chinese;
    }
}
覆写toString()的目的是在输出时更有可读性。

注意
判断枚举常量的名字，要始终使用name()方法，绝不能调用toString()！

小结
Java使用enum定义枚举类型，它被编译器编译为final class Xxx extends Enum { … }；
通过name()获取常量定义的字符串，注意不要使用toString()；
通过ordinal()返回常量定义的顺序（无实质意义）；
可以为enum编写构造方法、字段和方法
enum的构造方法要声明为private，字段强烈建议声明为final；
enum适合用在switch语句中。
```

## 记录类
```java
record
从Java 14开始，引入了新的Record类。我们定义Record类时，使用关键字record。把上述Point类改写为Record类，代码如下：

public class Main {
    public static void main(String[] args) {
        Point p = new Point(123, 456);
        System.out.println(p.x());
        System.out.println(p.y());
        System.out.println(p);
    }
}

record Point(int x, int y) {}
把上述定义改写为class，相当于以下代码：
final class Point extends Record {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int x() {
        return this.x;
    }

    public int y() {
        return this.y;
    }

    public String toString() {
        return String.format("Point[x=%s, y=%s]", x, y);
    }

    public boolean equals(Object o) {
        ...
    }
    public int hashCode() {
        ...
    }
}

除了用final修饰class以及每个字段外，编译器还自动为我们创建了构造方法，和字段名同名的方法，以及覆写toString()、equals()和hashCode()方法。

换句话说，使用record关键字，可以一行写出一个不变类。

和enum类似，我们自己不能直接从Record派生，只能通过record关键字由编译器实现继承。

编译器默认按照record声明的变量顺序自动创建一个构造方法，并在方法内给字段赋值。那么问题来了，如果我们要检查参数，应该怎么办？

假设Point类的x、y不允许负数，我们就得给Point的构造方法加上检查逻辑：

public record Point(int x, int y) {
    public Point {
        if(x < 0 || y < 0) {
            throw new IllegalArgumentException();
        }
    }
}

注意到方法public Point {...}被称为Compact Constructor，它的目的是让我们编写检查逻辑，编译器最终生成的构造方法如下：
public final class Point extends Record {
    public Point(int x, int y) {
        // 这是我们编写的Compact Constructor:
        if (x < 0 || y < 0) {
            throw new IllegalArgumentException();
        }
        // 这是编译器继续生成的赋值代码:
        this.x = x;
        this.y = y;
    }
    ...
}


作为record的Point仍然可以添加静态方法。一种常用的静态方法是of()方法，用来创建Point：

public record Point(int x, int y) {
    public static Point of() {
        return new Point(0, 0);
    }
    public static Point of(int x, int y) {
        return new Point(x, y);
    }
}

var z = Point.of();
var p = Point.of(123, 456);
```

### 常用工具类
```java
Math
求绝对值
Math.abs(-100) 
Math.abs(-7.8)

取最大或最小值
Math.max(100, 99)
Math.min(1.2, 2.3);

计算x的y次幂
Math.pow(x, y);

计算根号x
Math.sqrt(x);

计算e的x次方
Math.exp(x);

计算以e为底的对数
Math.log(4);

计算以10为底的对数
Math.log10(100) // 2

三角函数
Math.sin(3.14)
Math.cos(3.14)
Math.tan(3.14)
Math.asin(3.14)
Math.acos(3.14)

double pi = Math.PI;
double e = Math.E;

Math.sin(Math.PI / 6); // sin(π/6) = 0.5

Math.random(); // 0.53907... 每次都不一样

如果我们要生成一个区间在[MIN, MAX)的随机数，可以借助Math.random()实现，计算如下：

public class Main {
    public static void main(String[] args) {
        double x = Math.random();
        double min = 10;
        double max = 50;
        double y = x * (max - min) + min;
        long n = (long) y;
        System.out.println(y);
        System.out.println(n);
    }
}

有些同学可能注意到Java标准库还提供了一个StrictMath，它提供了和Math几乎一模一样的方法。
这两个类的区别在于，由于浮点数计算存在误差，不同的平台（例如x86和ARM）计算的结果可能不一致（指误差不同），
因此，StrictMath保证所有平台计算结果都是完全相同的，而Math会尽量针对平台优化计算速度，所以，绝大多数情况下，使用Math就足够了。

HexFormat

import java.util.HexFormat;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        byte[] data = "Hello".getBytes();
        HexFormat hf = HexFormat.of();
        String hexData = hf.formatHex(data); // 48656c6c6f
    }
}

如果要定制转换格式，则使用定制的HexFormat实例：

HexFormat hf = HexFormat.ofDelimiter(" ").withPrefix("0x").withUpperCase();
hf.formatHex("Hello".getBytes()); // 0x48 0x65 0x6C 0x6C 0x6F

从16进制字符串到byte[]数组转换，使用parseHex() 方法：

byte[] bs = HexFormat.of().parseHex("48656c6c6f");

Random

Random用来创建伪随机数。所谓伪随机数，是指只要给定一个初始的种子，产生的随机数序列是完全一样的。

Random r = Random();
r.nextInt(); // 207157543, 每次都不一样
r.nextInt(10); // 5, 生成一个[0, 10) 之间的int
r.nextLong(); // 8811649292570369305,每次都不一样
r.nextFloat(); // 0.54335...生成一个[0, 1)之间的float
r.nextDouble(); // 0.3716...生成一个[0, 1)之间的double

有童鞋问，每次运行程序，生成的随机数都是不同的，没看出伪随机数的特性来。
这是因为我们创建Random实例时，如果不给定种子，就使用系统当前时间戳作为种子，因此每次运行时，种子不同，得到的伪随机数序列就不同。

如果我们在创建Random实例时指定一个种子，就会得到完全确定的随机数序列：

import java.util.Random;

public class Main {
    public static void main(String[] args) {
        Random r = new Random(12345);
        for(int i = 0; i < 10; i++) {
            System.out.println(r.nextInt(100));
        }
        // 51, 80, 41, 28, 55.......
    }
}

SecureRandom
有伪随机数，就有真随机数。实际上真正的真随机数只能通过量子力学原理来获取，
** 而我们想要的是一个不可预测的安全的随机数，[SecureRandom]就是用来创建安全的随机数的：

SecureRandom sr = new SecureRandom();
System.out.println(sr.nextInt(100));

SecureRandom无法指定种子，它使用RNG（random number generator）算法。
JDK的SecureRandom实际上有多种不同的底层实现，有的使用安全随机种子加上伪随机数算法来产生安全的随机数，有的使用真正的随机数生成器。
实际使用的时候，可以优先获取高强度的安全随机数生成器，如果没有提供，再使用普通等级的安全随机数生成器：

import java.util.Arrays;
import java.security.SecureRandom;
import java.security.NoSuchAlgorithmException;

public class Main {
    public static void main(String[] args) {
        SecureRandom sr = null;
        try {
            sr = SecureRandom.getInstanceStrong(); // 获取高强度安全随机数生成器
        } catch (NoSuchAlgorithmException e) {
            sr = new SecureRandom(); // 获取普通的安全随机数生成器
        }

        byte[] buffer = new byte[16];
        sr.nextBytes(buffer); // 用安全随机数填充buffer
        System.out.println(Arrays.toString(buffer));
    }
}
SecureRandom的安全性是通过操作系统提供的安全的随机种子来生成随机数。
**这个种子是通过CPU的热噪声、读写磁盘的字节、网络流量等各种随机事件产生的“熵”。

在密码学中，安全的随机数非常重要。如果使用不安全的伪随机数，所有加密体系都将被攻破。因此，时刻牢记必须使用SecureRandom来产生安全的随机数。

***注意
需要使用安全随机数的时候，必须使用SecureRandom，绝不能使用Random！


```




