# 反射
## Class 类
```java
/* 除了int等基本类型外，Java的其他类型全部都是class（包括interface）。例如：

String
Object
Runnable
Exception
...

仔细思考，我们可以得出结论：class（包括interface）的本质是数据类型（Type）。无继承关系的数据类型无法赋值： */

Number n = new Double(123.456); // OK
String s = new Double(123.456); // compile error!

/* 而class是由JVM在执行过程中动态加载的。JVM在第一次读取到一种class类型时，将其加载进内存。

每加载一种class，JVM就为其创建一个Class类型的实例，并关联起来。注意：这里的Class类型是一个名叫Class的class。它长这样： */

public final class Class {
    private Class() {}
}

/* 这个Class实例是JVM内部创建的，如果我们查看JDK源码，可以发现Class类的构造方法是private，只有JVM能创建Class实例，我们自己的Java程序是无法创建Class实例的。

所以，JVM持有的每个Class实例都指向一个数据类型（class或interface）：

┌───────────────────────────┐
│      Class Instance       │────▶ String
├───────────────────────────┤
│name = "java.lang.String"  │
└───────────────────────────┘
┌───────────────────────────┐
│      Class Instance       │────▶ Random
├───────────────────────────┤
│name = "java.util.Random"  │
└───────────────────────────┘
┌───────────────────────────┐
│      Class Instance       │────▶ Runnable
├───────────────────────────┤
│name = "java.lang.Runnable"│
└───────────────────────────┘
一个Class实例包含了该class的所有完整信息：

┌───────────────────────────┐
│      Class Instance       │────▶ String
├───────────────────────────┤
│name = "java.lang.String"  │
├───────────────────────────┤
│package = "java.lang"      │
├───────────────────────────┤
│super = "java.lang.Object" │
├───────────────────────────┤
│interface = CharSequence...│
├───────────────────────────┤
│field = value[],hash,...   │
├───────────────────────────┤
│method = indexOf()...      │ 
───────────────────────────┘
由于JVM为每个加载的class创建了对应的Class实例，并在实例中保存了该class的所有信息，
包括类名、包名、父类、实现的接口、所有方法、字段等，因此，如果获取了某个Class实例，
我们就可以通过这个Class实例获取到该实例对应的class的所有信息。
*/
这种通过 Class 实例获取class信息的方法称为反射 Reflection。
/* 
如何获取一个class的Class实例？有三个方法：

方法一：直接通过一个class的静态变量class获取： */

Class cls = String.class;

// 方法二：如果我们有一个实例变量，可以通过该实例变量提供的getClass()方法获取：

String s = "Hello";
Class cls = s.getClass();


// 方法三：如果知道一个class的完整类名，可以通过静态方法Class.forName()获取：

Class cls = Class.forName("java.lang.String");

// 因为Class实例在JVM中是唯一的，所以，上述方法获取的Class实例是同一个实例。可以用==比较两个Class实例：

Class cls1 = String.class;

String s = "Hello";
Class cls2 = s.getClass();

boolean sameClass = cls1 === cls2;

// 注意一下Class实例比较和instanceof的差别：

Integer n = new Integer(123);

boolean b1 = n instanceof Integer; // true, 因为n是Integer类型
boolean b2 = n instanceof Number; // true, 因为n是Numeber类型的子类

boolean b3 = n.getClass() == Integer.class; // true, 因为n.getClass() 返回Integer.class
boolean b4 = n.getClass() == Number.class; // false, 因为Integer.class != Number.class

/* 用instanceof不但匹配指定类型，还匹配指定类型的子类。
而用==判断class实例可以精确地判断数据类型，但不能作子类型比较。

通常情况下，我们应该用instanceof判断数据类型，因为面向抽象编程的时候，我们不关心具体的子类型。
只有在需要精确判断一个类型是不是某个class的时候，我们才使用==判断class实例。 
*/
因为反射的目的是为了获得某个实例的信息。
// 因此，当我们拿到某个Object实例时，我们可以通过反射获取该Object的class信息：
void printObjectInfo(Object obj) {
    Class cls = obj.getClass();
}
// 要从Class实例获取获取的基本信息，参考下面的代码：
// reflection
public class Main {
    public static void main(String[] args) {
        printClassInfo("".getClass());
        printClassInfo(Runnable.class);
        printClassInfo(java.time.Month.class);
        printClassInfo(String[].class);
        printClassInfo(int.class);
    }

    static void printClassInfo(Class cls) {
        System.out.println("Class name: " + cls.getName());
        System.out.println("Simple name " + cls.getSimpleName());
        if(cls.getPackage != null) {
            System.out.println("Package name: " + cls.getPackage().getName());
        }
        System.out.println("is interface: " + cls.isInterface());
        System.out.println("is enum: " + cls.isEnum());
        System.out.println("is array: " + cls.isArray());
        System.out.println("is primitive: " + cls.isPrimitive());
    }
}

// 注意到数组（例如String[]）也是一种类，而且不同于String.class，它的类名是[Ljava.lang.String;。
// 此外，JVM为每一种基本类型如int也创建了Class实例，通过int.class访问。

// 如果获取到了一个Class实例，我们就可以通过该Class实例来创建对应类型的实例：
Class cls = String.class;
String s = (String) cls.newInstance();

/* 上述代码相当于new String()。通过Class.newInstance()可以创建类实例，
它的局限是：只能调用public的无参数构造方法。
带参数的构造方法，或者非public的构造方法都无法通过Class.newInstance()被调用。 */

动态加载
// JVM在执行Java程序的时候，并不是一次性把所有用到的class全部加载到内存，而是第一次需要用到class时才加载。例如：

public class Main {
    public static void main(String[] args) {
        if(args.length > 0) {
            create(args[0]);
        }
    }

    static void create(String name) {
        Person p = new Person(name);
    }
}

/* 当执行Main.java时，由于用到了Main，因此，JVM首先会把Main.class加载到内存。
然而，并不会加载Person.class，除非程序执行到create()方法，JVM发现需要加载Person类时，才会首次加载Person.class。
如果没有执行create()方法，那么Person.class根本就不会被加载。 
这就是JVM动态加载class的特性。

动态加载class的特性对于Java程序非常重要。
利用JVM动态加载class的特性，我们才能在运行期根据条件加载不同的实现类。
例如，Commons Logging总是优先使用Log4j，只有当Log4j不存在时，才使用JDK的logging。利用JVM动态加载特性，大致的实现代码如下：
*/

// Commons Logging 优先使用Log4j:
LogFactory factory = null;
if(isClassPersent("org.apache.logging.log4j.Logger")) {
    factory = createLog4j();
} else {
    factory = createJdkLog();
}

boolean isClassPersent(String name) {
    try {
        Class.forName(name);
        return true;
    } catch (Exception e) {
        return false;
    }
}
```
[小结]
JVM为每个加载的class及interface创建了对应的Class实例来保存class及interface的所有信息；
获取一个class对应的Class实例后，就可以获取该class的所有信息；
通过Class实例获取class信息的方法称为反射（Reflection）；
JVM总是动态加载class，可以在运行期根据条件来控制加载class。

## 访问字段
```java
/**
 * 对任意的一个Object实例，只要我们获取了它的Class，就可以获取它的一切信息。

我们先看看如何通过Class实例获取字段信息。Class类提供了以下几个方法来获取字段：

Field getField(name)：根据字段名获取某个public的field（包括父类）
Field getDeclaredField(name)：根据字段名获取当前类的某个field（不包括父类）
Field[] getFields()：获取所有public的field（包括父类）
Field[] getDeclaredFields()：获取当前类的所有field（不包括父类）
 */

// reflection
public class Main {
    public static void main(String[] args) throws Exception {
        Class stdClass = Student.class;
        // 获取public 字段"score":
        System.out.println(stdClass.getField("score"));
        // 获取继承的public字段"name":
        System.out.println(stdClass.getField("name"));
        // 获取private字段grade:
        System.out.println(stdClass.getDeclaredField("grade"));
    }
}

class Student extends Person {
    public int score;
    private int grade;
}

class Person {
    public String name;
}

/**
 * 上述代码首先获取Student的Class实例，然后，分别获取public字段、继承的public字段以及private字段，打印出的Field类似：

public int Student.score
public java.lang.String Person.name
private int Student.grade

一个Field对象包含了一个字段的所有信息：

getName()：返回字段名称，例如，"name"；
getType()：返回字段类型，也是一个Class实例，例如，String.class；
getModifiers()：返回字段的修饰符，它是一个int，不同的bit表示不同的含义。
以String类的value字段为例，它的定义是：
 */

public final class String {
    private final byte[] value;
}

// 我们用反射获取该字段的信息，代码如下：

Field f = String.class.getDeclaredField("value");
f.getName(); // "value"
f.getType(); // class [B 表示byte[]类型
int m = f.getModifiers();
Modifier.isFinal(m); // true
Modifier.isPublic(m); // false
Modifier.isProtected(m); // false
Modifier.isPrivate(m); // true
Modifier.isStatic(m); // false

/**
 * 获取字段值
利用反射拿到字段的一个Field实例只是第一步，我们还可以拿到一个实例对应的该字段的值。

例如，对于一个Person实例，我们可以先拿到name字段对应的Field，再获取这个实例的name字段的值：
 */
// reflection
import java.lang.reflect.Field;
public class Main {
    public static void main(String[] args) throws Exception {
        Object p = new Person("Xiao Ming");
        Class c = p.getClass();
        Field f = c.getDeclaredField("name");
        Object value = f.get(p);
        System.out.println(value); // Xiao Ming
    }
}

class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }
}
/**
 * 上述代码先获取Class实例，再获取Field实例，然后，用Field.get(Object)获取指定实例的指定字段的值。

运行代码，如果不出意外，会得到一个IllegalAccessException，
这是因为name被定义为一个private字段，正常情况下，Main类无法访问Person类的private字段。
要修复错误，可以将private改为public，或者，在调用Object value = f.get(p);前，先写一句：
 */
f.setAccessible(true);

/**
 * 调用Field.setAccessible(true)的意思是，别管这个字段是不是public，一律允许访问。

可以试着加上上述语句，再运行代码，就可以打印出private字段的值。

有童鞋会问：如果使用反射可以获取private字段的值，那么类的封装还有什么意义？

答案是正常情况下，我们总是通过p.name来访问Person的name字段，编译器会根据public、protected和private决定是否允许访问字段，这样就达到了数据封装的目的。

而反射是一种非常规的用法，使用反射，首先代码非常繁琐，其次，它更多地是给工具或者底层框架来使用，目的是在不知道目标实例任何信息的情况下，获取特定字段的值。

此外，setAccessible(true)可能会失败。如果JVM运行期存在SecurityManager，那么它会根据规则进行检查，
有可能阻止setAccessible(true)。

例如，某个SecurityManager可能不允许对java和javax开头的package的类调用setAccessible(true)，
这样可以保证JVM核心库的安全。

设置字段值
通过Field实例既然可以获取到指定实例的字段值，自然也可以设置字段的值。

设置字段值是通过Field.set(Object, Object)实现的，其中第一个Object参数是指定的实例，第二个Object参数是待修改的值。示例代码如下：
 */

// reflection
import java.lang.reflect.Field;

public class Main {
    public static void main(String[] args) throws Exception {
        Person p = new Person("Xiao Ming");
        System.out.println(p.getName()); // Xiao Ming
        Class c = p.getClass();
        Field f = c.getDeclaredField("name");
        f.setAccessible(true);
        f.set(p, "Xiao Hong");
        System.out.println(p.getName()); // "Xiao Hong"
    }
}

class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}

// 同样的，修改非public字段，需要首先调用setAccessible(true)。
```
[小结]
Java的反射API提供的Field类封装了字段的所有信息：

通过Class实例的方法可以获取Field实例：getField()，getFields()，getDeclaredField()，getDeclaredFields()；

通过Field实例可以获取字段信息：getName()，getType()，getModifiers()；

通过Field实例可以读取或设置某个对象的字段，如果存在访问限制，要首先调用setAccessible(true)来访问非public字段。

通过反射读写字段是一种非常规方法，它会破坏对象的封装。

## 调用方法
```java
/**
 * 我们已经能通过Class实例获取所有Field对象，同样的，可以通过Class实例获取所有Method信息。Class类提供了以下几个方法来获取Method：

Method getMethod(name, Class...)：获取某个public的Method（包括父类）
Method getDeclaredMethod(name, Class...)：获取当前类的某个Method（不包括父类）
Method[] getMethods()：获取所有public的Method（包括父类）
Method[] getDeclaredMethods()：获取当前类的所有Method（不包括父类）
我们来看一下示例代码：


 */
public class Main {
    public static void main(String[] args) throws Exception {
        Class stdClass = Student.class;
        // 获取public方法getScore, 参数为String:
        System.out.println(stdClass.getMethod("getScore", String.class));
        // 获取继承的public方法getName，无参数
        System.out.println(stdClass.getMethod("getName"));
        // 获取private方法getGrade,参数为int
        System.out.println(stdClass.getDeclaredMethod("getGrade", int.class));
    }
}

class Student extends Person {
    public int getScore(String type) {
        return 99;
    }

    private int getGrade(int year) {
        return 1;
    }
}

class Person {
    public String getName() {
        return "Person";
    }
}

/**
 * 上述代码首先获取Student的Class实例，然后，分别获取public方法、继承的public方法以及private方法，打印出的Method类似：

public int Student.getScore(java.lang.String)
public java.lang.String Person.getName()
private int Student.getGrade(int)
一个Method对象包含一个方法的所有信息：

getName()：返回方法名称，例如："getScore"；
getReturnType()：返回方法返回值类型，也是一个Class实例，例如：String.class；
getParameterTypes()：返回方法的参数类型，是一个Class数组，例如：{String.class, int.class}；
getModifiers()：返回方法的修饰符，它是一个int，不同的bit表示不同的含义。

调用方法
当我们获取到一个Method对象时，就可以对它进行调用。我们以下面的代码为例：
 */

String s = "Hello world";
String r = s.substring(6); // "world"

// 如果用反射来调用substring方法，需要以下代码：

// reflection
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) throws Exception {
        // String 对象
        String s = "Hello world";
        // 获取String substring(int)方法，参数为int:
        Method m = String.class.getMethod("substring", int.class);
        // 在s对象上调用方法并获取结果:
        String r = (String) m.invoke(s, 6);
        // 打印调用结果:
        System.out.println(r); // "world"
    }
}
/**
 * 注意到substring()有两个重载方法，我们获取的是String substring(int)这个方法。思考一下如何获取String substring(int, int)方法。

对Method实例调用invoke就相当于调用该方法，invoke的第一个参数是对象实例，即在哪个实例上调用该方法，后面的可变参数要与方法参数一致，否则将报错。
 
 调用静态方法
如果获取到的Method表示一个静态方法，调用静态方法时，由于无需指定实例对象，所以invoke方法传入的第一个参数永远为null。我们以Integer.parseInt(String)为例：
 */

// reflection
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) throws Exception {
        // 获取Integer.parseInt(String)方法，参数为String;
        Method m = Integer.class.getMethod("parseInt", String.class);
        // 调用该静态方法并获取结果:
        Integer n = (Integer) m.invoke(null, "12345");
        // 打印调用结果:
        System.out.println(n);
    }
}

class Person {
    String name;
    private void setName(String name) {
        this.name = name;
    }
}

/**
 * 此外，setAccessible(true)可能会失败。如果JVM运行期存在SecurityManager，
 * 那么它会根据规则进行检查，有可能阻止setAccessible(true)。
 * 例如，某个SecurityManager可能不允许对java和javax开头的package的类调用setAccessible(true)，
 * 这样可以保证JVM核心库的安全。
 * 
 * 多态
我们来考察这样一种情况：一个Person类定义了hello()方法，并且它的子类Student也覆写了hello()方法，
那么，从Person.class获取的Method，作用于Student实例时，调用的方法到底是哪个？
 */

// reflection
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) throws Exception {
        // 获取Person的hello方法:
        Method h = Person.class.getMethod("hello");
        // 对Student实例调用hello方法
        h.invoke(new Student());
    }
}

class Person {
    public void hello() {
        System.out.println("Person: hello");
    }
}

class Student extends Person {
    public void hello() {
        System.out.println("Student: hello");
    }
}

// 运行上述代码，发现打印出的是Student:hello，因此，使用反射调用方法时，仍然遵循多态原则：即总是调用实际类型的覆写方法（如果存在）。上述的反射代码：
```
小结
Java的反射API提供的Method对象封装了方法的所有信息：

通过Class实例的方法可以获取Method实例：getMethod()，getMethods()，getDeclaredMethod()，getDeclaredMethods()；

通过Method实例可以获取方法信息：getName()，getReturnType()，getParameterTypes()，getModifiers()；

通过Method实例可以调用某个对象的方法：Object invoke(Object instance, Object... parameters)；

通过设置setAccessible(true)来访问非public方法；

通过反射调用方法时，仍然遵循多态原则。

## 获取继承关系
```java
// 当我们获取到某个Class对象时，实际上就获取到了一个类的类型：
Class cls = String.class; // 获取到String的Class
// 还可以用实例的getClass()方法获取:
String s = "";
Class cls = s.getClass(); // s是String，因此获取到String的Class
// 最后一种获取Class的方法是通过Class.forName("")，传入Class的完整类名获取
Class s = Class.forName("java.lang.String");

// 这三种方式获取的Class实例都是同一个实例，因为JVM对每个加载的class只创建一个Class实例来表示它的类型。

获取interface
// 由于一个类可能实现一个或多个接口，通过Class我们就可以查询到实现的接口类型。例如，查询Integer实现的接口：
// reflection
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) throws Exception {
        Class s = Integer.class;
        Class[] is = s.getInterfaces();

        for(Class i:is) {
            System.out.println(i);
        }
    }
}

/**
 * 运行上述代码可知，Integer实现的接口有：

java.lang.Comparable
java.lang.constant.Constable
java.lang.constant.ConstantDesc
要特别注意：getInterfaces()只返回当前类直接实现的接口类型，并不包括其父类实现的接口类型：


 */

import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) throws Exception {
        Class s = Integer.class.getSuperclass();
        Class[] is = s.getInterfaces();
        for(Class i: is) {
            System.out.println(i);
        }
    }
}

/**
 * Integer的父类是Number，Number实现的接口是java.io.Serializable。

此外，对所有interface的Class调用getSuperclass()返回的是null，获取接口的父接口要用getInterfaces()：
如果一个类没有实现任何interface，那么getInterfaces()返回空数组。
 */

继承关系

// 当我们判断一个实例是否是某个类型时，正常情况下，使用instanceof操作符：
Object n = Integer.valueof(123);
boolean isDouble = n instanceof Double; // false;
boolean isInteger = n instanceof Integer; // true;
boolean isNumber = n instanceof Number; // true;
boolean isSerializable = n instanceof java.io.Serializable; // true

// 如果是两个Class实例，要判断一个向上转型是否成立，可以调用isAssignableFrom()：
Integer.class.isAssignableFrom(Integer.class); // true, 因为Integer可以赋值给Integer
Number.class.isAssignableFrom(Integer.class); // true, 因为Integer可以赋值给Number
Object.class.isAssignableFrom(Integer.class); // true, 因为Integer可以赋值给Object
Integer.class.isAssignableFrom(Number.class); // false, 因为Number不能赋值给Integer

```
小结
通过Class对象可以获取继承关系：

Class getSuperclass()：获取父类类型；
Class[] getInterfaces()：获取当前类实现的所有接口。
通过Class对象的isAssignableFrom()方法可以判断一个向上转型是否可以实现。

## 动态代理
```java
/**
 * 我们来比较Java的class和interface的区别：

可以实例化class（非abstract）；
不能实例化interface。
所有interface类型的变量总是通过某个实例向上转型并赋值给接口类型变量的：
 */
CharSequence cs = new StringBuilder();
/**
 * 有没有可能不编写实现类，直接在运行期创建某个interface的实例呢？

这是可能的，因为Java标准库提供了一种动态代理（Dynamic Proxy）的机制：可以在运行期动态创建某个interface的实例。

什么叫运行期动态创建？听起来好像很复杂。所谓动态代理，是和静态相对应的。我们来看静态代码怎么写：
 */
// 定义接口
public interface Hello {
    void morning(String name);
}

// 编写实现类
public class HelloWorld implements Hello {
    public void moring(String name) {
        System.out.println("Good morning, " + name);
    }
}

// 创建实例，转型为接口并调用
Hello hello = new HelloWorld();
hello.morning("Bob");

/**
 * 这种方式就是我们通常编写代码的方式。

还有一种方式是动态代码，我们仍然先定义了接口Hello，但是我们并不去编写实现类，
而是直接通过JDK提供的一个Proxy.newProxyInstance()创建了一个Hello接口对象。
这种没有实现类但是在运行期动态创建了一个接口对象的方式，我们称为动态代码。
JDK提供的动态创建接口对象的方式，就叫动态代理。

一个最简单的动态代理实现如下：
 */
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class Main {
    public static void main(String[] args) {
        InvocationHandler handler = new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                System.out.println(method);
                if(method.getName().equals("moring")) {
                    System.out.println("Good morning, " + args[0]);
                }
                return null;
            }
        };

        Hello hello = (Hello) Proxy.newProxyInstance(
            Hello.class.getClassLoader(), // 传入ClassLoader
            new Class[] {Hello.class}, // 传入要实现的接口
            handler
        );
        hello.morning("Bob");
    }
}

interface Hello {
    void morning(String name);
}

/**
 * 在运行期动态创建一个interface实例的方法如下：
 * 1. 定义一个InvocationHandler实例，它负责实现接口的方法调用；
 * 2. 通过Proxy.newProxyInstance()创建interface实例，它需要3个参数：
 *  1. 使用的ClassLoader，通常就是接口类的ClassLoader；
 *  2. 需要实现的接口数组，至少需要传入一个接口进去；
 *  3. 用来处理接口方法调用的InvocationHandler实例。
 * 3. 将返回的Object强制转型为接口。
 * 动态代理实际上是JVM在运行期动态创建class字节码并加载的过程，它并没有什么黑魔法，把上面的动态代理改写为静态实现类大概长这样：
 */
public class HelloDynamicProxy implements Hello {
    InvocationHandler handler;
    public HelloDynamicProxy(InvocationHandler handler) {
        this.handler = handler;
    }

    public void morning(String name) {
        handler.invoke(this, Hello.class.getMethod("morning", String.class), new Object[] {name});
    }
}

// 其实就是JVM帮我们自动编写了一个上述类（不需要源码，可以直接生成字节码），并不存在可以直接实例化接口的黑魔法。

小结
Java标准库提供了动态代理功能，允许在运行期动态创建一个接口的实例；
动态代理是通过Proxy创建代理对象，然后将接口方法“代理”给InvocationHandler完成的。
```