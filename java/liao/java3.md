# 异常处理
## Java的异常

```java
Java内置了一套异常处理机制，总是使用异常来表示错误。

异常是一种class，因此它本身带有类型信息。异常可以在任何地方抛出，但只需要在上层捕获，这样就和方法调用分离了：

try {
    String s = processFile("c:\\test.txt");
    // ok:
} catch (FileNotFoundException e) { 
    // file not found
} catch (SecurityException e) {
    // no read permission:
} catch (IOException e) {
    // io error:
} catch (Exception e) {
    // other error:
}

从继承关系可知：Throwable是异常体系的根，它继承自Object。Throwable有两个体系：Error和Exception，Error表示严重的错误，程序对此一般无能为力，例如：

1. OutOfMemoryError：内存耗尽
2. NoClassDefFoundError：无法加载某个Class
3. StackOverflowError：栈溢出

而Exception则是运行时的错误，它可以被捕获并处理。

某些异常是应用程序逻辑处理的一部分，应该捕获并处理。例如：

1. NumberFormatException：数值类型的格式错误
2. FileNotFoundException：未找到文件
3. SocketException：读取网络失败
还有一些异常是程序逻辑编写不对造成的，应该修复程序本身。例如：

NullPointerException：对某个null的对象调用方法或字段
IndexOutOfBoundsException：数组索引越界

Exception又分为两大类：

2. RuntimeException以及它的子类；
2. 非RuntimeException（包括IOException、ReflectiveOperationException等等）

捕获异常
捕获异常使用try...catch语句，把可能发生异常的代码放到try {...}中，然后使用catch捕获对应的Exception及其子类：

import java.io.UnsupportedEncodingException;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        byte[] bs = toGBK("中文");
        System.out.println(Arrays.toString(bs));
    }

    static byte[] toGBK(String s) {
        try {
            // 用指定编码转换String为byte[]:
            return s.getBytes("GBK");
        } catch (UnsupportedEncodingException e) {
            // 如果系统不支持GBK编码， 会捕获到UnsupportedEncodingException:
            System.out.println(e); // 打印异常信息
            return s.getBytes(); // 尝试使用默认编码
        }
    }
}

如果我们不捕获UnsupportedEncodingException，会出现编译失败的问题：

编译器会报错，错误信息类似：unreported exception UnsupportedEncodingException; must be caught or declared to be thrown，并且准确地指出需要捕获的语句是return s.getBytes("GBK");。意思是说，像UnsupportedEncodingException这样的Checked Exception，必须被捕获。

这是因为String.getBytes(String)方法定义是：

public byte[] getBytes(String charsetName) throws UnsupportedEncodingException { ... }

在方法定义的时候，使用throws Xxx表示该方法可能抛出的异常类型。调用方在调用的时候，必须强制捕获这些异常，否则编译器会报错。

在toGBK()方法中，因为调用了String.getBytes(String)方法，就必须捕获UnsupportedEncodingException。我们也可以不捕获它，而是在方法定义处用throws表示toGBK()方法可能会抛出UnsupportedEncodingException，就可以让toGBK()方法通过编译器检查：

import java.io.UnsupportedEncodingException;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        byte[] bs = toGBK("中文");
        System.out.println(Arrays.toString(bs));
    }

    static byte[] toGBK(String s) throws UnsupportedEncodingException {
        return s.getBytes("GBK");
    }
}

上述代码仍然会得到编译错误，但这一次，编译器提示的不是调用return s.getBytes("GBK");的问题，而是byte[] bs = toGBK("中文");。因为在main()方法中，调用toGBK()，没有捕获它声明的可能抛出的UnsupportedEncodingException。

修复方法是在main()方法中捕获异常并处理：

import java.io.UnsupportedEncodingException;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        try {
            byte[] bs = toGBK("中文");
            System.out.println(Arrays.toString(bs));
        } catch (UnsupportedEncodingException e) {
            System.out.println(e);
        }
    }

    static byte[] toGBK(String s) throws UnsupportedEncodingException {
        // 用指定编码转换String为byte[]:
        return s.getBytes("GBK");
    }
}

可见，只要是方法声明的Checked Exception，不在调用层捕获，也必须在更高的调用层捕获。所有未捕获的异常，最终也必须在main()方法中捕获，不会出现漏写try的情况。这是由编译器保证的。main()方法也是最后捕获Exception的机会。

如果是测试代码，上面的写法就略显麻烦。如果不想写任何try代码，可以直接把main()方法定义为throws Exception：

import java.io.UnsupportedEncodingException;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) throws Exception {
        byte[] bs = toGBK("中文");
        System.out.println(Arrays.toString(bs));
    }

    static byte[] toGBK(String s) throws UnsupportedEncodingException {
        // 用指定编码转换String为byte[]:
        return s.getBytes("GBK");
    }
}

因为main()方法声明了可能抛出Exception，也就声明了可能抛出所有的Exception，因此在内部就无需捕获了。代价就是一旦发生异常，程序会立刻退出。

还有一些童鞋喜欢在toGBK()内部“消化”异常：

static byte[] toGBK(String s) {
    try {
        return s.getBytes("GBK");
    } catch (UnsupportedEncodingException e) {
        // 什么也不干
    }
    return null;
}

这种捕获后不处理的方式是非常不好的，即使真的什么也做不了，也要先把异常记录下来：

static byte[] toGBK(String s) {
    try {
        return s.setBytes("GBK");
    } catch(UnsupportedEncodingException e) {
        // 先记下来再说
        e.printStackTrace(;)
    }
    return null;
}
```

## 捕获异常
```java
存在多个catch的时候，catch的顺序非常重要：子类必须写在前面。例如：
public static void main(String[] args) {
    try {
        process1();
        process2();
        process3();
    } catch (IOException e) {
        System.out.println("IO error");
    } catch (UnsupportedEncodingException e) { // 永远捕获不到
        System.out.println("Bad encoding");
    }
}

对于上面的代码，UnsupportedEncodingException异常是永远捕获不到的，因为它是IOException的子类。当抛出UnsupportedEncodingException异常时，会被catch (IOException e) { ... }捕获并执行。

处理IOException和NumberFormatException的代码是相同的，所以我们可以把它两用|合并到一起。

public static void main(String[] args) {
    try {
        process1();
        process2();
        process3();
    } catch (IOException | NumberFormatException e) {
        System.out.println("Bad input");
    } catch (Exception e) {
        System.out.println("Unknown error");
    }
}
```

## 抛出异常
```java
异常的传播
当某个方法抛出了异常时，如果当前方法没有捕获异常，异常就会被抛到上层调用方法，直到遇到某个try ... catch被捕获为止：

public class Main {
    public static void main(String[] args) {
        try {
            process1();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void process1() {
        process2();
    }

    static void process2() {
        Integer.parseInt(null); // 会抛出NumberFormatException
    }
}

通过printStackTrace()可以打印出方法的调用栈，类似：
java.lang.NumberFormatException: null
    at java.base/java.lang.Integer.parseInt(Integer.java:614)
    at java.base/java.lang.Integer.parseInt(Integer.java:770)
    at Main.process2(Main.java:16)
    at Main.process1(Main.java:12)
    at Main.main(Main.java:5)

printStackTrace()对于调试错误非常有用，上述信息表示：NumberFormatException是在java.lang.Integer.parseInt方法中被抛出的，从下往上看，调用层次依次是：

1. main()调用process1()；
2. process1()调用process2()；
3. process2()调用Integer.parseInt(String)；
4. Integer.parseInt(String)调用Integer.parseInt(String, int)。

查看Integer.java源码可知，抛出异常的方法代码如下：
public static int parseInt(String s, int radix) throw NumberFormatException {
    if(s == null) {
        throw new NumberFormatException("null");
    }
}

抛出异常
当发生错误时，例如，用户输入了非法的字符，我们就可以抛出异常。

如何抛出异常？参考Integer.parseInt()方法，抛出异常分两步：

1. 创建某个Exception的实例；
2. 用throw语句抛出。

void process2(String s) {
    if(s==null) {
        throw new NullPointerException();
    }
}

如果一个方法捕获了某个异常后，又在catch子句中抛出新的异常，就相当于把抛出的异常类型“转换”了：

void process1(String) {
    try {
        process2();
    } catch (NullPointerException e) {
        throw new IllegalArgumentException();
    }
}

当process2()抛出NullPointerException后，被process1()捕获，然后抛出IllegalArgumentException()。

如果在main()中捕获IllegalArgumentException，我们看看打印的异常栈：

// exception
public class Main {
    public static void main(String[] args) {
        try {
            process1();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void process1() {
        try {
            process2();
        } catch (NullPointerException e) {
            throw new IllegalArgumentException();
        }
    }

    static void process2() {
        throw new NullPointerException();
    }
}

java.lang.IllegalArgumentException
    at Main.process1(Main.java:15)
    at Main.main(Main.java:5)

这说明新的异常丢失了原始异常信息，我们已经看不到原始异常NullPointerException的信息了。

为了能追踪到完整的异常栈，在构造异常的时候，把原始的Exception实例传进去，新的Exception就可以持有原始Exception信息。对上述代码改进如下：

static void process1() {
    try {
        process2();
    } catch (NullPointerException e) {
        throw new IllegalArgumentException(e);
    }
}

java.lang.IllegalArgumentException: java.lang.NullPointerException
    at Main.process1(Main.java:15)
    at Main.main(Main.java:5)
Caused by: java.lang.NullPointerException
    at Main.process2(Main.java:20)
    at Main.process1(Main.java:13)

注意到Caused by: Xxx，说明捕获的IllegalArgumentException并不是造成问题的根源，根源在于NullPointerException，是在Main.process2()方法抛出的。

在代码中获取原始异常可以使用Throwable.getCause()方法。如果返回null，说明已经是“根异常”了。

**最佳实践

捕获到异常并再次抛出时，一定要留住原始异常，否则很难定位第一案发现场！

异常屏蔽
如果在执行finally语句时抛出异常，那么，catch语句的异常还能否继续抛出？例如：

// exception
public class Main {
    public static void main(String[] args) {
        try {
            Integer.parseInt("abc");
        } catch (Exception e) {
            System.out.println("catched");
            throw new RuntimeException(e);
        } finally {
            System.out.println("finally");
            throw new IllegalArgumentException();
        }
    }
}

/* 执行上述代码，发现异常信息如下：

catched
finally
Exception in thread "main" java.lang.IllegalArgumentException
    at Main.main(Main.java:11)

这说明finally抛出异常后，原来在catch中准备抛出的异常就“消失”了，因为只能抛出一个异常。没有被抛出的异常称为“被屏蔽”的异常（Suppressed Exception）。

在极少数的情况下，我们需要获知所有的异常。如何保存所有的异常信息？方法是先用origin变量保存原始异常，然后调用Throwable.addSuppressed()，把原始异常添加进来，最后在finally抛出： */

public class Main {
    public static void main(String[] args) throws Exception {
        Exception origin = null;
        try {
            System.out.println(Integer.parseInt("abc"));
        } catch(Exception e) {
            origin = e;
            throw e;
        } finally {
            Exception e = new IllegalArgumentException();
            if(origin != null) {
                e.addSuppressed(origin);
            }
            throw e;
        }
    }
}


```

## 自定义异常
Exception
├─ RuntimeException
│  ├─ NullPointerException
│  ├─ IndexOutOfBoundsException
│  ├─ SecurityException
│  └─ IllegalArgumentException
│     └─ NumberFormatException
├─ IOException
│  ├─ UnsupportedCharsetException
│  ├─ FileNotFoundException
│  └─ SocketException
├─ ParseException
├─ GeneralSecurityException
├─ SQLException
└─ TimeoutException

```java
当我们在代码中需要抛出异常时，尽量使用JDK已定义的异常类型。例如，参数检查不合法，应该抛出IllegalArgumentException：

static void process1(int age) {
    if(age < 0) {
        throw new IllegalArgumentException();
    }
}

在一个大型项目中，可以自定义新的异常类型，但是，保持一个合理的异常继承体系是非常重要的。

一个常见的做法是自定义一个BaseException作为“根异常”，然后，派生出各种业务类型的异常。

BaseException需要从一个适合的Exception派生，通常建议从RuntimeException派生：

public class BaseException extends RuntimeException {}

其他业务类型的异常就可以从BaseException派生：

public UserNotFoundException extends BaseException {}
public LoginFailedException extends BaseException {}

自定义的BaseException应该提供多个构造方法：

public class BaseException extends RuntimeException {
    public BaseException() {
        super();
    }

    public BaseException(String message, Throwable cause) {
        super(message, cause);
    }

    public BaseException(String message) {
        super(message);
    }

    public BaseException(Throwable cause) {
        super(cause);
    }
}
```

## NullPointerException
```java
NullPointerException即空指针异常，俗称NPE。如果一个对象为null，调用其方法或访问其字段就会产生NullPointerException，这个异常通常是由JVM抛出的，例如：

public class Main {
    public static void main(String[] args) {
        String s = null;
        System.out.println(s.toLowerCase());
    }
}

如果遇到NullPointerException，我们应该如何处理？首先，必须明确，
NullPointerException是一种代码逻辑错误，遇到NullPointerException，遵循原则是早暴露，早修复，
***严禁使用catch来隐藏这种编码错误：

使用空字符串""而不是默认的null可避免很多NullPointerException，编写业务逻辑时，用空字符串""表示未填写比null安全得多。

返回空字符串""、空数组而不是null：
public String[] readLinesFromFile(String file) {
    if (getFileSize(file) == 0) {
        // 返回空数组而不是null:
        return new String[0];
    }
    ...
}

如果调用方一定要根据null判断，比如返回null表示文件不存在，那么考虑返回Optional<T>：
public Optional<String> readFromFile(String file) {
    if(!fileExist(file)) {
        return Optinal.empty();
    }
}

这样调用方必须通过Optional.isPresent()判断是否有结果。
```

## 使用断言
```java
public static void main(String[] args) {
    double x = Math.abs(-123.45);
    assert x >= 0;
    System.out.println(x);
}

语句assert x >= 0;即为断言，断言条件x >= 0预期为true。如果计算结果为false，则断言失败，抛出AssertionError。

使用assert语句时，还可以添加一个可选的断言消息：

这样，断言失败的时候，AssertionError会带上消息x must >= 0，更加便于调试。

*** Java断言的特点是：断言失败时会抛出AssertionError，导致程序结束退出。因此，断言不能用于可恢复的程序错误，只应该用于开发和测试阶段。

对于可恢复的程序错误，不应该使用断言。例如：
void sort (int[] arr) {
    assert arr != null;
}

应该抛出异常并在上层捕获：

void sort(int[] arr) {
    if(arr == null) {
        throw new IllegalArgumentException("array cannot be null");
    }
}

```

## 使用JDK Logging
 - 输出日志，而不是用System.out.println()，有以下几个好处：

1. 可以设置输出样式，避免自己每次都写"ERROR: " + var；
2. 可以设置输出级别，禁止某些级别输出。例如，只输出错误日志；
3. 可以被重定向到文件，这样可以在程序运行结束后查看日志；
4. 可以按包名控制日志级别，只输出某些包打的日志；

```java
import java.util.logging.Level;
import java.util.logging.Logger;

public class Hello {
    public static void main(String[] args) {
        Logger logger = Logger.getGlobal();
        logger.info("start process");
        logger.warning("memory is running out...");
        logger.fine("ignored.");
        logger.severe("process will be terminated...");
    }
}

运行上述代码，得到类似如下的输出：

Mar 02, 2019 6:32:13 PM Hello main
INFO: start process...
Mar 02, 2019 6:32:13 PM Hello main
WARNING: memory is running out...
Mar 02, 2019 6:32:13 PM Hello main
SEVERE: process will be terminated...

对比可见，使用日志最大的好处是，它自动打印了时间、调用类、调用方法等很多有用的信息。

再仔细观察发现，4条日志，只打印了3条，logger.fine()没有打印。这是因为，日志的输出可以设定级别。
JDK的Logging定义了7个日志级别，从严重到普通：

因为默认级别是INFO，因此，INFO级别以下的日志，不会被打印出来。使用日志级别的好处在于，调整级别，就可以屏蔽掉很多调试相关的日志输出。

使用Java标准库内置的Logging有以下局限：

Logging系统在JVM启动时读取配置文件并完成初始化，一旦开始运行main()方法，就无法修改配置；

配置不太方便，需要在JVM启动时传递参数-Djava.util.logging.config.file=<config-file-name>。

因此，Java标准库内置的Logging使用并不是非常广泛。更方便的日志系统我们稍后介绍。
```

## 使用Commons Logging

```java
和Java标准库提供的日志不同，Commons Logging是一个第三方日志库，它是由Apache创建的日志模块。

和Java标准库提供的日志不同，Commons Logging是一个第三方日志库，它是由Apache创建的日志模块。

Commons Logging的特色是，它可以挂接不同的日志系统，并通过配置文件指定挂接的日志系统。默认情况下，Commons Loggin自动搜索并使用 Log4j（Log4j是另一个流行的日志系统），如果没有找到 Log4j ，再使用JDK Logging。

使用Commons Logging只需要和两个类打交道，并且只有两步：

* 第一步，通过LogFactory获取Log类的实例； 
* 第二步，使用Log实例的方法打日志。

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Main {
    public static void main(String[] args) {
        Log log = LogFactory.getLog(Main.class);
        log.info("start...")
        log.warn("end...");
    }
}

运行上述代码，肯定会得到编译错误，类似error: package org.apache.commons.logging does not exist（找不到org.apache.commons.logging这个包）。
因为Commons Logging是一个第三方提供的库，所以，必须先把它下载下来。
下载后，解压，找到commons-logging-1.2.jar这个文件，再把Java源码Main.java放到一个目录下，例如work目录：

work
├─ commons-logging-1.2.jar
└─ Main.java

然后用javac编译Main.java，编译的时候要指定classpath，不然编译器找不到我们引用的org.apache.commons.logging包。编译命令如下：

javac -cp commons-logging-1.2.jar Main.java

如果编译成功，那么当前目录下就会多出一个Main.class文件：

work
├─ commons-logging-1.2.jar
├─ Main.java
└─ Main.class

现在可以执行这个Main.class，使用java命令，也必须指定classpath，命令如下：

java -cp .;commons-logging-1.2.jar Main

注意到传入的classpath有两部分：一个是.
，一个是commons-logging-1.2.jar，
用;分割。.表示当前目录，如果没有这个.，JVM不会在当前目录搜索Main.class，就会报错。

运行结果如下：

Mar 02, 2019 7:15:31 PM Main main
INFO: start...
Mar 02, 2019 7:15:31 PM Main main
WARNING: end.

Commons Logging定义了6个日志级别：

FATAL
ERROR
WARNING
INFO
DEBUG
TRACE
默认级别是INFO。

使用Commons Logging时，如果在静态方法中引用Log，通常直接定义一个静态类型变量：
public class Main {
    static final Log log = LogFactory.getLog(Main.class);

    static void foo() {
        log.info("foo");
    }
}

在实例方法中引用Log，通常定义一个实例变量：

public class Person {
    protected final Log log = LogFactory.getLog(getClass());

    void foo() {
        log.info("foo");
    }
}

注意到实例变量log的获取方式是LogFactory.getLog(getClass())，
虽然也可以用LogFactory.getLog(Person.class)，
但是前一种方式有个非常大的好处，就是子类可以直接使用该log实例。例如：

public class Student extends Person {
    void bar() {
        log.info("bar");
    }
}

由于Java类的动态特性，子类获取的log字段实际上相当于LogFactory.getLog(Student.class)，但却是从父类继承而来，并且无需改动代码。

此外，Commons Logging的日志方法，例如info()，除了标准的info(String)外，还提供了一个非常有用的重载方法：info(String, Throwable)，这使得记录异常更加简单：

try {
...
} catch (Exception e) {
    log.error("got exception!", e);
}
```

## 使用Log4j

log.info("User signed in.");
 │
 │   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
 ├──▶│ Appender │───▶│  Filter  │───▶│  Layout  │───▶│ Console  │
 │   └──────────┘    └──────────┘    └──────────┘    └──────────┘
 │
 │   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
 ├──▶│ Appender │───▶│  Filter  │───▶│  Layout  │───▶│   File   │
 │   └──────────┘    └──────────┘    └──────────┘    └──────────┘
 │
 │   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
 └──▶│ Appender │───▶│  Filter  │───▶│  Layout  │───▶│  Socket  │
     └──────────┘    └──────────┘    └──────────┘    └──────────┘

当我们使用Log4j输出一条日志时，Log4j自动通过不同的Appender把同一条日志输出到不同的目的地。例如：

console：输出到屏幕；
file：输出到文件；
socket：通过网络输出到远程计算机；
jdbc：输出到数据库

以XML配置为例，使用Log4j的时候，我们把一个log4j2.xml的文件放到classpath下就可以让Log4j读取配置文件并按照我们的配置来输出日志。下面是一个配置文件的例子：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration>
	<Properties>
        <!-- 定义日志格式 -->
		<Property name="log.pattern">%d{MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36}%n%msg%n%n</Property>
        <!-- 定义文件名变量 -->
		<Property name="file.err.filename">log/err.log</Property>
		<Property name="file.err.pattern">log/err.%i.log.gz</Property>
	</Properties>
    <!-- 定义Appender，即目的地 -->
	<Appenders>
        <!-- 定义输出到屏幕 -->
		<Console name="console" target="SYSTEM_OUT">
            <!-- 日志格式引用上面定义的log.pattern -->
			<PatternLayout pattern="${log.pattern}" />
		</Console>
        <!-- 定义输出到文件,文件名引用上面定义的file.err.filename -->
		<RollingFile name="err" bufferedIO="true" fileName="${file.err.filename}" filePattern="${file.err.pattern}">
			<PatternLayout pattern="${log.pattern}" />
			<Policies>
                <!-- 根据文件大小自动切割日志 -->
				<SizeBasedTriggeringPolicy size="1 MB" />
			</Policies>
            <!-- 保留最近10份 -->
			<DefaultRolloverStrategy max="10" />
		</RollingFile>
	</Appenders>
	<Loggers>
		<Root level="info">
            <!-- 对info级别的日志，输出到console -->
			<AppenderRef ref="console" level="info" />
            <!-- 对error级别的日志，输出到err，即上面定义的RollingFile -->
			<AppenderRef ref="err" level="error" />
		</Root>
	</Loggers>
</Configuration>

```

虽然配置Log4j比较繁琐，但一旦配置完成，使用起来就非常方便。对上面的配置文件，凡是INFO级别的日志，会自动输出到屏幕，而ERROR级别的日志，不但会输出到屏幕，还会同时输出到文件。并且，一旦日志文件达到指定大小（1MB），Log4j就会自动切割新的日志文件，并最多保留10份。

有了配置文件还不够，因为Log4j也是一个第三方库，我们需要从这里下载Log4j，解压后，把以下3个jar包放到classpath中：

log4j-api-2.x.jar
log4j-core-2.x.jar
log4j-jcl-2.x.jar
因为Commons Logging会自动发现并使用Log4j，所以，把上一节下载的commons-logging-1.2.jar也放到classpath中。

要打印日志，只需要按Commons Logging的写法写，不需要改动任何代码，就可以得到Log4j的日志输出，类似：

03-03 12:09:45.880 [main] INFO  com.itranswarp.learnjava.Main
Start process...

[最佳实践]
在开发阶段，始终使用Commons Logging接口来写入日志，并且开发阶段无需引入Log4j。如果需要把日志写入文件，只需要把正确的配置文件和Log4j相关的jar包放入classpath，就可以自动把日志切换成使用Log4j写入，无需修改任何代码。

## 使用SLF4J和Logback

```java
int score = 99;
p.setScore(score);
log.info("Set score " + score + " for Person " + p.getName() + " ok.");

拼字符串是一个非常麻烦的事情，所以SLF4J的日志接口改进成这样了：

ini score = 99;
p.setScore(score);
logger.info("Set score {} for Person {} ok", score, p.getName());

如何使用SLF4J？它的接口实际上和Commons Logging几乎一模一样：

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class Main {
    final Logger logger = LoggerFactory.getLogger(getClass());
}

对比一下Commons Logging和SLF4J的接口：
Commons Logging	                        SLF4J
org.apache.commons.logging.Log	        org.slf4j.Logger
org.apache.commons.logging.LogFactory	org.slf4j.LoggerFactory

使用SLF4J和Logback和前面讲到的使用Commons Logging加Log4j是类似的，先分别下载SLF4J和Logback，然后把以下jar包放到classpath下：

slf4j-api-1.7.x.jar
logback-classic-1.2.x.jar
logback-core-1.2.x.jar

然后使用SLF4J的Logger和LoggerFactory即可。

和Log4j类似，我们仍然需要一个Logback的配置文件，把logback.xml放到classpath下，配置如下：

<configuration>
	<appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
		<encoder>
			<pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
		</encoder>
	</appender>

	<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<encoder>
			<pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
			<charset>utf-8</charset>
		</encoder>
		<file>log/output.log</file>
		<rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">
			<fileNamePattern>log/output.log.%i</fileNamePattern>
		</rollingPolicy>
		<triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
			<MaxFileSize>1MB</MaxFileSize>
		</triggeringPolicy>
	</appender>

	<root level="INFO">
		<appender-ref ref="CONSOLE" />
		<appender-ref ref="FILE" />
	</root>
</configuration>

运行即可获得类似如下的输出：

13:15:25.328 [main] INFO  com.itranswarp.learnjava.Main - Start process...
```

