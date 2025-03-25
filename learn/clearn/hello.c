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