# IO
## File对象
```java
/**
 * 在计算机系统中，文件是非常重要的存储方式。Java的标准库java.io提供了File对象来操作文件和目录。

要构造一个File对象，需要传入文件路径：
 */

import java.io.*;

public class Main {
    public static void main(String[] args) {
        File f = new File("C:\\Windows\\notepad.exe");
        System.out.println(f);
    }
}

// 构造File对象时，既可以传入绝对路径，也可以传入相对路径。绝对路径是以根目录开头的完整路径，例如：

File f = new File("C:\\Windows\\notepad.exe");

// 注意Windows平台使用\作为路径分隔符，在Java字符串中需要用\\表示一个\。Linux平台使用/作为路径分隔符：

File f = new File("/usr/bin/javac");

// 传入相对路径时，相对路径前面加上当前目录就是绝对路径：

// 假设当前目录是C:\Docs

File f1 = new File("sub\\javac"); // 绝对路径是C:\Docs\sub\javac
File f3 = new File(".\\sub\\javac"); // 绝对路径是C:\Dosc\sub\javac
File f3 = new File("..\\sub\\javac"); // 绝对路径是C:\sub\javac

/**
 * 可以用.表示当前目录，..表示上级目录。

File对象有3种形式表示的路径，一种是getPath()，返回构造方法传入的路径，一种是getAbsolutePath()，返回绝对路径，一种是getCanonicalPath，它和绝对路径类似，但是返回的是规范路径。

什么是规范路径？我们看以下代码：
 */

import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        File f = new File("..");
        System.out.println(f.getPath());
        System.out.println(f.getAbsolutePath());
        System.out.println(f.getCanonicalPath());
    }
}

/**
 * 绝对路径可以表示成C:\Windows\System32\..\notepad.exe，而规范路径就是把.和..转换成标准的绝对路径后的路径：C:\Windows\notepad.exe。

因为Windows和Linux的路径分隔符不同，File对象有一个静态变量用于表示当前平台的系统分隔符：
 */

System.out.println(File.separator);

文件和目录

import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        File f1 = new File("C:\\Windows");
        File f2 = new File("C:\\Windows\\notepad.exe");
        File f3 = new File("C:\\Windows\\nothing");
        System.out.println(f1.isFile());
        System.out.println(f1.isDirectory());
        System.out.println(f1.isFile());
        System.out.println(f1.isDirectory());
        System.out.println(f1.isFile());
        System.out.println(f1.isDirectory());
    }
}
/**
 * 用File对象获取到一个文件时，还可以进一步判断文件的权限和大小：

boolean canRead()：是否可读；
boolean canWrite()：是否可写；
boolean canExecute()：是否可执行；
long length()：文件字节大小。
 */

对目录而言，是否可执行表示能否列出它包含的文件和子目录。

创建和删除文件
// 当File对象表示一个文件时，可以通过createNewFile()创建一个新文件，用delete()删除该文件：
File file = new File("/path/to/file");
if(file.createNewFile()) {
    // 文件创建成功:
    if(file.delete()) {
        // 删除成功
    }
}

// 有些时候，程序需要读写一些临时文件，File对象提供了createTempFile()来创建一个临时文件，以及deleteOnExit()在JVM退出时自动删除该文件。

import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        File f = File.createTempFile("tmp-", ".txt"); // 提供临时文件的前缀和后缀
        f.deleteOnExit(); // JVM退出时自动删除
        System.out.println(f.isFile());
        System.out.println(f.getAbsolutePath());
    }
}

遍历文件和目录

// 当File对象表示一个目录时，可以使用list()和listFiles()列出目录下的文件和子目录名。listFiles()提供了一系列重载方法，可以过滤不想要的文件和目录：

import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        File f = new File("C:\\Windows");
        File[] fs1 = f.listFiles(); // 列出所有文件和子目录
        printFiles(fs1);
        File[] fs2 = f.listFiles(new FilenameFilter() { // 仅列出.exe文件
            public boolean accept(File dir, String name) {
                return name.endsWith(".exe");
            }
        });
        printFiles(fs2);
    }

    static void printFiles(File[] files) {
        System.out.println("===========");
        if(files != null) {
            for(File f: files) {
                System.out.println(f);
            }
        }
        System.out.println("===========");
    }
}

/**
 * 和文件操作类似，File对象如果表示一个目录，可以通过以下方法创建和删除目录：

boolean mkdir()：创建当前File对象表示的目录；
boolean mkdirs()：创建当前File对象表示的目录，并在必要时将不存在的父目录也创建出来；
boolean delete()：删除当前File对象表示的目录，当前目录必须为空才能删除成功。
 */

Path

// Java标准库还提供了一个Path对象，它位于java.nio.file包。Path对象和File对象类似，但操作更加简单：

import java.io.*;
import java.nio.file.*;

public class Main {
    public static void main(String[] args) throws IOException {
        Path p1 = Paths.get(".", "project", "study"); // 构造一个Path对象
        System.out.println(p1);
        Path p2 = p1.toAbsolutePath(); // 转换为绝对路径
        System.out.println(p2);
        Path p3 = p2.normalize(); // 转换为规范路径
        System.out.println(p3);
        File f = p3.toFile(); // 转换为File对象
        System.out.println(f);
    }
}

练习
/**
 * 请利用File对象列出指定目录下的所有子目录和文件，并按层次打印。

例如，输出：

Documents/
  word/
    1.docx
    2.docx
    work/
      abc.doc
  ppt/
  other/
如果不指定参数，则使用当前目录，如果指定参数，则使用指定目录。
 */
package com.itranswarp.learnjava;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) throws IOException {
        File currentDir = new File(args.length==0?".": args[0]); // 如果不置顶参数，则使用当前目录，如果指定参数，则使用指定目录
        listDir(currentDir.getCanonicalFile(), 0); // listDir(currentDir.getCanicalFile())
    }

    static void listDir(File dir, int depth) {
        // TODO: 递归打印所有文件和子文件夹的内容
        File[] fs = dir.listFiles();
        if(fs != null) {
            for(File f: fs) {
                System.out.println("   ".repeat(depth) + f.getName() + (f.isDirectory() ? "/":""));
                if(f.isDirectory()) {
                    listDir(f, depth+1);
                }
            }
        }
    }
}

小结
Java标准库的java.io.File对象表示一个文件或者目录：

创建File对象本身不涉及IO操作；
可以获取路径／绝对路径／规范路径：getPath()/getAbsolutePath()/getCanonicalPath()；
可以获取目录的文件和子目录：list()/listFiles()；
可以创建或删除文件和目录。

```

## InputStream
```java
/**
 * InputStream就是Java标准库提供的最基本的输入流。它位于java.io这个包里。java.io包提供了所有同步IO的功能。

要特别注意的一点是，InputStream并不是一个接口，而是一个抽象类，它是所有输入流的超类。这个抽象类定义的一个最重要的方法就是int read()，签名如下：
 */
public abstract int read() throws IOException;

/**
 * 这个方法会读取输入流的下一个字节，并返回字节表示的int值（0~255）。如果已读到末尾，返回-1表示不能继续读取了。

FileInputStream是InputStream的一个子类。顾名思义，FileInputStream就是从文件流中读取数据。下面的代码演示了如何完整地读取一个FileInputStream的所有字节：
 */

public void readFile() throws IOException {
    // 创建一个FileInputStream对象:
    InputStream input = new FileInputStream("src/readme.txt");
    for(;;) {
        int n = input.read(); // 反复调用read()方法，直到返回-1
        if(n == -1) {
            break;
        }
        System.out.println(n); // 打印byte的值
    }
    input.close(); // 关闭流
}

/**
 * 在计算机中，类似文件、网络端口这些资源，都是由操作系统统一管理的。应用程序在运行的过程中，如果打开了一个文件进行读写，完成后要及时地关闭，以便让操作系统把资源释放掉，否则，应用程序占用的资源会越来越多，不但白白占用内存，还会影响其他应用程序的运行。

InputStream和OutputStream都是通过close()方法来关闭流。关闭流就会释放对应的底层资源。

我们还要注意到在读取或写入IO流的过程中，可能会发生错误，例如，文件不存在导致无法读取，没有写权限导致写入失败，等等，这些底层错误由Java虚拟机自动封装成IOException异常并抛出。因此，所有与IO操作相关的代码都必须正确处理IOException。

仔细观察上面的代码，会发现一个潜在的问题：如果读取过程中发生了IO错误，InputStream就没法正确地关闭，资源也就没法及时释放。

因此，我们需要用try ... finally来保证InputStream在无论是否发生IO错误的时候都能够正确地关闭：
 */

public void readFile() throws IOException {
    InputStream input = null;
    try {
        input = new FileInputStream("src/readme.txt");
        int n;
        while((n = input.read()) != -1) { // 利用while同时读取并判断
            System.out.println(n);
        }
    } finally {
        if(input != null) {
            input.close();
        }
    }
}

// 用try ... finally来编写上述代码会感觉比较复杂，更好的写法是利用Java 7引入的新的try(resource)的语法，只需要编写try语句，让编译器自动为我们关闭资源。推荐的写法如下：

public void readFile() throws IOException {
    try(InputStream input = new FileInputStream("src/readme.txt")) {
        int n;
        while((n = input.read()) != -1) {
            System.out.println(n);
        }
    } // 编译器在此自动为我们写入finally并调用close()
}

/**
 * 实际上，编译器并不会特别地为InputStream加上自动关闭。编译器只看try(resource = ...)中的对象是否实现了java.lang.AutoCloseable接口，如果实现了，就自动加上finally语句并调用close()方法。InputStream和OutputStream都实现了这个接口，因此，都可以用在try(resource)中。
 */

// 缓冲
// 在读取流的时候，一次读取一个字节并不是最高效的方法。很多流支持一次性读取多个字节到缓冲区，对于文件和网络流来说，利用缓冲区一次性读取多个字节效率往往要高很多。InputStream提供了两个重载方法来支持读取多个字节：
int read(byte[] b)：读取若干字节并填充到byte[]数组，返回读取的字节数
int read(byte[] b, int off, int len)：指定byte[]数组的偏移量和最大填充数

/**
 * 利用上述方法一次读取多个字节时，需要先定义一个byte[]数组作为缓冲区，read()方法会尽可能多地读取字节到缓冲区， 但不会超过缓冲区的大小。read()方法的返回值不再是字节的int值，而是返回实际读取了多少个字节。如果返回-1，表示没有更多的数据了。

利用缓冲区一次读取多个字节的代码如下：
 */

public void readFile() throws IOException {
    try(InputStream input = new FileInputStream("src/readme.txt")) {
        // 定义1000个字节大小的缓冲区
        byte[] buffer = new byte[1000];
        int n;
        while((n = input.read(buffer)) != -1) { // 读取到缓冲区
            System.out.println("read " + n + " bytes.");
        }
    }
}

// 阻塞
// 在调用InputStream的read()方法读取数据时，我们说read()方法是阻塞（Blocking）的。它的意思是，对于下面的代码：
int n;
n = input.read(); // 必须等待read()方法返回才能执行下一行代码
int m = n;
/* 执行到第二行代码时，必须等read()方法返回后才能继续。因为读取IO流相比执行普通代码，速度会慢很多，因此，无法确定read()方法调用到底要花费多长时间。 */

InputStream实现类
// 用FileInputStream可以从文件获取输入流，这是InputStream常用的一个实现类。此外，ByteArrayInputStream可以在内存中模拟一个InputStream：

import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException { 
        byte[] data = { 72, 101, 108, 108, 111, 33 };
        try (InputStream input = new ByteArrayInputStream(data)) {
            int n;
            while((n = input.read()) != -1) {
                System.out.println((char)n);
            }
        }
    }
}

// ByteArrayInputStream实际上是把一个byte[]数组在内存中变成一个InputStream，虽然实际应用不多，但测试的时候，可以用它来构造一个InputStream。

// 举个例子：我们想从文件中读取所有字节，并转换成char然后拼成一个字符串，可以这么写：

public class Main {
    public static void main(String[] args) throws IOException {
        String s;
        try(InputStream input = new FileInputStream("C:\\test\\README.txt")) {
            int n;
            StringBuilder sb = new StringBuilder();
            while((n = input.read()) != -1) {
                sb.append((char) n);
            }
            s = sb.toString();
        }
        System.out.println(s);
    }
}

// 要测试上面的程序，就真的需要在本地硬盘上放一个真实的文本文件。如果我们把代码稍微改造一下，提取一个readAsString()的方法：

public class Main {
    public static void main(String[] args) throws IOException {
        String s;
        try(InputStream input = new FileInputStream("C:\\test\\README.txt")) {
            s = readAsString(input);
        }
        System.out.println(s);
    }

    public static String readAsString(InputStream input) throws IOException {
        int n;
        StringBuilder sb = new StringBuilder();
        While((n = input.read()) != -1) {
            sb.append((char) n);
        }

        return sb.toString();
    }
}

// 这就是面向抽象编程原则的应用：接受InputStream抽象类型，而不是具体的FileInputStream类型，从而使得代码可以处理InputStream的任意实现类。

小结
Java标准库的java.io.InputStream定义了所有输入流的超类：

FileInputStream实现了文件流输入；
ByteArrayInputStream在内存中模拟一个字节流输入。
总是使用try(resource)来保证InputStream正确关闭。
```
## OutputStream
```java
/**
 * 和InputStream相反，OutputStream是Java标准库提供的最基本的输出流。

和InputStream类似，OutputStream也是抽象类，它是所有输出流的超类。这个抽象类定义的一个最重要的方法就是void write(int b)，签名如下：
 */

public abstract void write(int b) throws IOException;

/**
 * 这个方法会写入一个字节到输出流。要注意的是，虽然传入的是int参数，但只会写入一个字节，即只写入int最低8位表示字节的部分（相当于b & 0xff）。

和InputStream类似，OutputStream也提供了close()方法关闭输出流，以便释放系统资源。要特别注意：OutputStream还提供了一个flush()方法，它的目的是将缓冲区的内容真正输出到目的地。

为什么要有flush()？因为向磁盘、网络写入数据的时候，出于效率的考虑，操作系统并不是输出一个字节就立刻写入到文件或者发送到网络，而是把输出的字节先放到内存的一个缓冲区里（本质上就是一个byte[]数组），等到缓冲区写满了，再一次性写入文件或者网络。对于很多IO设备来说，一次写一个字节和一次写1000个字节，花费的时间几乎是完全一样的，所以OutputStream有个flush()方法，能强制把缓冲区内容输出。

通常情况下，我们不需要调用这个flush()方法，因为缓冲区写满了OutputStream会自动调用它，并且，在调用close()方法关闭OutputStream之前，也会自动调用flush()方法。

但是，在某些情况下，我们必须手动调用flush()方法。举个栗子：

小明正在开发一款在线聊天软件，当用户输入一句话后，就通过OutputStream的write()方法写入网络流。小明测试的时候发现，发送方输入后，接收方根本收不到任何信息，怎么回事？

原因就在于写入网络流是先写入内存缓冲区，等缓冲区满了才会一次性发送到网络。如果缓冲区大小是4K，则发送方要敲几千个字符后，操作系统才会把缓冲区的内容发送出去，这个时候，接收方会一次性收到大量消息。

解决办法就是每输入一句话后，立刻调用flush()，不管当前缓冲区是否已满，强迫操作系统把缓冲区的内容立刻发送出去。

实际上，InputStream也有缓冲区。例如，从FileInputStream读取一个字节时，操作系统往往会一次性读取若干字节到缓冲区，并维护一个指针指向未读的缓冲区。然后，每次我们调用int read()读取下一个字节时，可以直接返回缓冲区的下一个字节，避免每次读一个字节都导致IO操作。当缓冲区全部读完后继续调用read()，则会触发操作系统的下一次读取并再次填满缓冲区。
 */

FileOutputStream
// 我们以FileOutputStream为例，演示如何将若干个字节写入文件流：

public void writeFile() throws IOException {
    OutputStream output = new FileOutputStream("out/readme.txt");
    output.write(72); // H
    output.write(101); // e
    output.write(108); // l
    output.write(108); // l
    output.write(111); // o
    output.close();
}

// 每次写入一个字节非常麻烦，更常见的方法是一次性写入若干字节。这时，可以用OutputStream提供的重载方法void write(byte[])来实现：
public void writeFile() throws IOException {
    OutputStream output = new FileOutputStream("out/readme.txt");
    output.write("Hello".getBytes("UTF-8")); // Hello
    output.close();
}

// 和InputStream一样，上述代码没有考虑到在发生异常的情况下如何正确地关闭资源。写入过程也会经常发生IO错误，例如，磁盘已满，无权限写入等等。我们需要用try(resource)来保证OutputStream在无论是否发生IO错误的时候都能够正确地关闭：

public void writeFile() throws IOException {
    try(OutputStream output = new FileOutputStream("out/readme.txt")) {
        output.write("Hello".getBytes("UTF-8"));// Hello
    } // 编译器在此自动为我们写入finally并调用close()
}

阻塞
和InputStream一样，OutputStream的write()方法也是阻塞的。

OutputStream实现类
// 用FileOutputStream可以从文件获取输出流，这是OutputStream常用的一个实现类。此外，ByteArrayOutputStream可以在内存中模拟一个OutputStream：

import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        byte[] data;
        try(ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            output.write("Hello ".getBytes("UTF-8"));
            output.write("world!".getBytes("UTF-8"));
            data = output.toByteArray();
        }
        System.out.println(new String(data, "UTF-8"));
    }
}

/**
 * ByteArrayOutputStream实际上是把一个byte[]数组在内存中变成一个OutputStream，虽然实际应用不多，但测试的时候，可以用它来构造一个OutputStream。

同时操作多个AutoCloseable资源时，在try(resource) { ... }语句中可以同时写出多个资源，用;隔开。例如，同时读写两个文件：
 */
// 读取input.txt, 写入output.txt;
try(InputStream input = new FileInputStream("input.txt"); OutputStream output = new FileOutputStream("output.txt")) {
    input.transferTo(output);
}

练习
// 请利用InputStream和OutputStream，编写一个复制文件的程序，它可以带参数运行：

static void copy(String source, String target) throws IOException {
    InputStream input = new FileInputStream(source);
    OutputStream output = new FileOutputStream(target);

    try(input; output) {
        // 建立缓存5M(1024*1024*5) 大小
        byte[] b = new byte[5242880];
        // 获取每次读取返回的数组长度
        int len = 0;
        // 写入
        while((len = input.read(b)) != -1) {
            // 写入时，从数组0索引开始读取， 只写入读取了的长度
            output.write(b, 0, len);
        }
    }
}

小结
Java标准库的java.io.OutputStream定义了所有输出流的超类：

FileOutputStream实现了文件流输出；
ByteArrayOutputStream在内存中模拟一个字节流输出。
某些情况下需要手动调用OutputStream的flush()方法来强制输出缓冲区；

总是使用try(resource)来保证OutputStream正确关闭。
```

## Filter模式
```java
// Java的IO标准库提供的InputStream根据来源可以包括：
FileInputStream: 从文件读取数据，是最终数据源
ServletInputStream: 从HTTP请求读取数据，是最终数据源
Socket.getInputStream(): 从TCP连接读取数据，是最终数据源

// 如果我们要给FileInputStream添加缓冲功能，则可以从FileInputStream派生一个类：
BufferedFileInputStream extends FileInputStream {}
// 如果要给FileInputStream添加计算签名的功能，类似的，也可以从FileInputStream派生一个类：
DigestFileInputStream extends FileInputStream {}
// 如果要给FileInputStream添加加密/解密功能，还是可以从FileInputStream派生一个类：
CipherFileInputStream extends FileInputStream {}
/**
 * 如果要给FileInputStream添加缓冲和签名的功能，那么我们还需要派生BufferedDigestFileInputStream。如果要给FileInputStream添加缓冲和加解密的功能，则需要派生BufferedCipherFileInputStream。

我们发现，给FileInputStream添加3种功能，至少需要3个子类。这3种功能的组合，又需要更多的子类：
 */

                          ┌─────────────────┐
                          │ FileInputStream │
                          └─────────────────┘
                                   ▲
             ┌───────────┬─────────┼─────────┬───────────┐
             │           │         │         │           │
┌───────────────────────┐│┌─────────────────┐│┌─────────────────────┐
│BufferedFileInputStream│││DigestInputStream│││CipherFileInputStream│
└───────────────────────┘│└─────────────────┘│└─────────────────────┘
                         │                   │
    ┌─────────────────────────────┐ ┌─────────────────────────────┐
    │BufferedDigestFileInputStream│ │BufferedCipherFileInputStream│
    └─────────────────────────────┘ └─────────────────────────────┘

/**
 * 这还只是针对FileInputStream设计，如果针对另一种InputStream设计，很快会出现子类爆炸的情况。

因此，直接使用继承，为各种InputStream附加更多的功能，根本无法控制代码的复杂度，很快就会失控。

为了解决依赖继承会导致子类数量失控的问题，JDK首先将InputStream分为两大类：

一类是直接提供数据的基础InputStream，例如：

FileInputStream
ByteArrayInputStream
ServletInputStream
...
一类是提供额外附加功能的InputStream，例如：

BufferedInputStream
DigestInputStream
CipherInputStream
...
当我们需要给一个“基础”InputStream附加各种功能时，我们先确定这个能提供数据源的InputStream，因为我们需要的数据总得来自某个地方，例如，FileInputStream，数据来源自文件：
 */

InputStream file = new FileInputStream("test.gz");

// 紧接着，我们希望FileInputStream能提供缓冲的功能来提高读取的效率，因此我们用BufferedInputStream包装这个InputStream，得到的包装类型是BufferedInputStream，但它仍然被视为一个InputStream：

InputStream buffered = new BufferedInputStream(file);

// 最后，假设该文件已经用gzip压缩了，我们希望直接读取解压缩的内容，就可以再包装一个GZIPInputStream：

InputStream gzip = new GZIPInputStream(buffered);

// 无论我们包装多少次，得到的对象始终是InputStream，我们直接用InputStream来引用它，就可以正常读取：

┌─────────────────────────┐
│GZIPInputStream          │
│┌───────────────────────┐│
││BufferedFileInputStream││
││┌─────────────────────┐││
│││   FileInputStream   │││
││└─────────────────────┘││
│└───────────────────────┘│
└─────────────────────────┘

// 上述这种通过一个“基础”组件再叠加各种“附加”功能组件的模式，称之为Filter模式（或者装饰器模式：Decorator）。它可以让我们通过少量的类来实现各种功能的组合：

                 ┌─────────────┐
                 │ InputStream │
                 └─────────────┘
                       ▲ ▲
┌────────────────────┐ │ │ ┌─────────────────┐
│  FileInputStream   │─┤ └─│FilterInputStream│
└────────────────────┘ │   └─────────────────┘
┌────────────────────┐ │     ▲ ┌───────────────────┐
│ByteArrayInputStream│─┤     ├─│BufferedInputStream│
└────────────────────┘ │     │ └───────────────────┘
┌────────────────────┐ │     │ ┌───────────────────┐
│ ServletInputStream │─┘     ├─│  DataInputStream  │
└────────────────────┘       │ └───────────────────┘
                             │ ┌───────────────────┐
                             └─│CheckedInputStream │
                               └───────────────────┘

类似的，OutputStream也是以这种模式来提供各种功能：
                  ┌─────────────┐
                  │OutputStream │
                  └─────────────┘
                        ▲ ▲
┌─────────────────────┐ │ │ ┌──────────────────┐
│  FileOutputStream   │─┤ └─│FilterOutputStream│
└─────────────────────┘ │   └──────────────────┘
┌─────────────────────┐ │     ▲ ┌────────────────────┐
│ByteArrayOutputStream│─┤     ├─│BufferedOutputStream│
└─────────────────────┘ │     │ └────────────────────┘
┌─────────────────────┐ │     │ ┌────────────────────┐
│ ServletOutputStream │─┘     ├─│  DataOutputStream  │
└─────────────────────┘       │ └────────────────────┘
                              │ ┌────────────────────┐
                              └─│CheckedOutputStream │
                                └────────────────────┘

编写FilterInputStream

/**
 * 我们也可以自己编写FilterInputStream，以便可以把自己的FilterInputStream“叠加”到任何一个InputStream中。

下面的例子演示了如何编写一个CountInputStream，它的作用是对输入的字节进行计数：
 */

import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        byte[] data = "hello, world!".getBytes("UTF-8");
        try(CountInputStream input = new CountInputStream(new ByteArrayInputStream(data))) {
            int n;
            while((n = input.read()) != -1) {
                System.out.println((char) n);
            }
            System.out.println("Total read " + input.getBytesRead() + " byte");
        }
    }
}

class CountInputStream extends FilterInputStream {
    private int count = 0;
    CountInputStream(InputStream in) {
        super(in);
    }

    public int getBytesRead() {
        return this.count;
    }

    public int read() throws IOException {
        int n = in.read();
        if(n != -1) {
            this.count++;
        }
        return n;
    }

    public int read(byte[] b, int off, int len) throws IOException {
        int n = in.read(b, off, len);
        if(n != -1) {
            this.count += n;
        }
        return n;
    }
}

/**
 * 注意到在叠加多个FilterInputStream，我们只需要持有最外层的InputStream，并且，当最外层的InputStream关闭时（在try(resource)块的结束处自动关闭），内层的InputStream的close()方法也会被自动调用，并最终调用到最核心的“基础”InputStream，因此不存在资源泄露。
 */

小结
Java的IO标准库使用Filter模式为InputStream和OutputStream增加功能：

可以把一个InputStream和任意个FilterInputStream组合；
可以把一个OutputStream和任意个FilterOutputStream组合。
Filter模式可以在运行期动态增加功能（又称Decorator模式）。
```

## 操作zip
```java

// ZipInputStream是一种FilterInputStream，它可以直接读取zip包的内容：

┌───────────────────┐
│    InputStream    │
└───────────────────┘
          ▲
          │
┌───────────────────┐
│ FilterInputStream │
└───────────────────┘
          ▲
          │
┌───────────────────┐
│InflaterInputStream│
└───────────────────┘
          ▲
          │
┌───────────────────┐
│  ZipInputStream   │
└───────────────────┘
          ▲
          │
┌───────────────────┐
│  JarInputStream   │
└───────────────────┘

// 另一个JarInputStream是从ZipInputStream派生，它增加的主要功能是直接读取jar文件里面的MANIFEST.MF文件。因为本质上jar包就是zip包，只是额外附加了一些固定的描述文件。

读取zip包
/**
 * 我们来看看ZipInputStream的基本用法。

我们要创建一个ZipInputStream，通常是传入一个FileInputStream作为数据源，然后，循环调用getNextEntry()，直到返回null，表示zip流结束。

一个ZipEntry表示一个压缩文件或目录，如果是压缩文件，我们就用read()方法不断读取，直到返回-1：
 */
try(ZipInputStream zip = new ZipInputStream(new FileInputStream(...))) {
    ZipEntry entry = null;
    while((entry = zip.getNextEntry()) != null) {
        String name = entry.getName();
        if(!entry.isDirectory()) {
            int n;
            while((n = zip.read()) != -1) {
                ...
            }
        }
    }
}

写入zip包
/**
 * ZipOutputStream是一种FilterOutputStream，它可以直接写入内容到zip包。我们要先创建一个ZipOutputStream，通常是包装一个FileOutputStream，然后，每写入一个文件前，先调用putNextEntry()，然后用write()写入byte[]数据，写入完毕后调用closeEntry()结束这个文件的打包。
 */

try(ZipOutputStream zip = new ZipOutputStream(new FileOutputStream(...))) {
    File[] files = ...
    for(File file: files) {
        zip.putNextEntry(new ZipEntry(file.getName()));
        zip.write(Files.readAllBytes(file.toPath()));
        zip.closeEntry();
    }
}

// 上面的代码没有考虑文件的目录结构。如果要实现目录层次结构，new ZipEntry(name)传入的name要用相对路径。

小结
ZipInputStream可以读取zip格式的流，ZipOutputStream可以把多份数据写入zip包；

配合FileInputStream和FileOutputStream就可以读写zip文件。


```
## 读取classpath资源
```java
// 很多Java程序启动的时候，都需要读取配置文件。例如，从一个.properties文件中读取配置：
String conf = "C:\\conf\\default.properties";
try(InputStream input = new FileInputStream(conf)) {
    // TODO;
}

/**
 * 这段代码要正常执行，必须在C盘创建conf目录，然后在目录里创建default.properties文件。但是，在Linux系统上，路径和Windows的又不一样。

因此，从磁盘的固定目录读取配置文件，不是一个好的办法。

有没有路径无关的读取文件的方式呢？

我们知道，Java存放.class的目录或jar包也可以包含任意其他类型的文件，例如：

配置文件，例如.properties；
图片文件，例如.jpg；
文本文件，例如.txt，.csv；
……
从classpath读取文件就可以避免不同环境下文件路径不一致的问题：如果我们把default.properties文件放到classpath中，就不用关心它的实际存放路径。

在classpath中的资源文件，路径总是以／开头，我们先获取当前的Class对象，然后调用getResourceAsStream()就可以直接从classpath读取任意的资源文件：
 */

try(InputStream input = getClass().getResourceAsStream("/default.properties")) {
    if(input != null) {
        // todo:
    }
}

// 如果我们把默认的配置放到jar包中，再从外部文件系统读取一个可选的配置文件，就可以做到既有默认的配置文件，又可以让用户自己修改配置：

Properties props = new Properties();
props.load(inputStreamFromClassPath("/default.properties"));
props.load(inputStreamFromFile("./conf.properties"));

这样读取配置文件，应用程序启动就更加灵活。

小结
把资源存储在classpath中可以避免文件路径依赖；

Class对象的getResourceAsStream()可以从classpath中读取指定资源；

根据classpath读取资源时，需要检查返回的InputStream是否为null。
```