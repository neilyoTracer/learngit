#include <stdio.h>

int atoi(char s[]);
int lower(int a);

int main()
{
    printf("Hello, C in VSCode!\n");
    char str[] = "999"; // Note: 字符串是用"", ''是字符
    // printf(str); // 错误 : format string is not a string literal
    const int test = atoi(str);
    printf("%d\n", test); // 注意printf的定义，第一个参数是字符串，记得用printf的格式说明符
    const int a = 'C';
    const int b = lower(a);
    printf("%c\n", b);
    /**
     * 这里不能直接str++
     * 原因: 
     * 数组名在表达式中通常会被当成地址使用(即&a[0]),
     * 但它不是一个可以修改的变量，它是一个*常量*地址，编译器会阻止你改变它
     * 结论: 指针是地址变量，而数组名是地址常量，但是数组名可以参与地址运算（但不能自增运算）
     * *(str + 2)就是合法的
     */
    char *p1 = str;
    p1++;
    printf("%c\n", p1[0]);
    printf("%c\n", *(str + 2));
    /**
     * 上面的第二个情况，如果定义一个指针数组会是什么结果呢
     * 
     * 我们可以看到这里同样是不能用p2++的
     * 那为什么int main(int argc, char *argv[]) 里就可以执行argv++呢
     * 这是因为C语言的函数参数传递中数组衰减为指针的核心机制，
     * 这就是为什么 argv++ 在 main 函数里是合法的，而 char *p[]; p++ 在其他地方是不合法的
     * 这里我们也可以说，argv是指针变量，而p是数组名
     * 答案: char *argv[]在函数参数中，其实是被当作char **argv来处理的!
     * int main(int argc, char *argv[]) 
     * 其实在编译器看来和下面这个是一样的：
     * int main(int argc, char **argv)
     * 这是C语言的函数参数数组退化规则
     * 在函数参数里，所有的 T name[]都会退化为 T *name
     * C程序设计语言的第85页有这方面的解释，
     * 我自己的理解是函数的参数必须是变量而不能是常量，
     * 所以当你把一个数组名传递给一个函数的时候，实际上是把一个地址(数组第一个元素的地址)传递给函数参数
     * 这个时候参数必须是指针变量，所以就引起了刚才所说的数组向指针退化的规则
     * 所以我们可以认为 
     * 在函数参数里char *name[] 这个name是一个指针变量
     * 而在数组声明时 char *name[] = xxx 这个name是数组名不是变量
     * 扩展思考 char name[]这里的name也不是变量，而是数组名，它代表常量地址 &name[0]
     * 这不是变量声明而是数组声明
     */
    char *p2[] = {"hello", "test", "u"};
    printf("%s\n", p2[0]);
    printf("%s\n", *(p2 + 0)); // 和上面一样
    return 0;
}
/**
 * %d 按照十进制整型数打印
 * %c 按单个字符打印
 * %6d 按照十进制整型数打印，至少6个字符宽
 * %f 按照浮点数打印
 * %6f 按照浮点数打印，至少6个字符宽
 * %.2f 按照浮点数打印，小数点后右两位小数
 * %6.2f 按照浮点数打印，至少6个字符宽，小数点后有两位小数
 */
/**
 * atoi函数: 将字符串s转换为相应的整型数
 * Note: 字符串是用""
 */
int atoi(char s[])
{
    int i, n;
    n = 0;
    for (i = 0; s[i] >= '0' && s[i] <= '9'; ++i)
    {
        n = 10 * n + (s[i] - '0');
    }
    return n;
}

/**
 * 函数lower是将char类型转换为int类型的另一个例子，它将ASCII字符集中的字符映射到对应的小写字母。
 * 如果待转换的字符不是大写字母，lower函数将返回字符本身
 */
int lower(int c) 
{
    if(c >= 'A' && c <= 'Z') {
        return c + 'a' - 'A';
    } else {
        return c;
    }
}