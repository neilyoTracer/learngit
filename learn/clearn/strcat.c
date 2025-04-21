/**
 * 函数cstrcat将t指向的字符串复制到s指向的字符串的尾部
 */
#include "pub.h"
char *cstrcat(char *s, char *t) 
{
    // 复制指针开始操作
    char *p = s;
    // 指针移位到数组末尾 ！这里多移动了一位，造成最后一直打印abc
    // while ((*p++)); 
    while (*p != '\0')
    {
        /* code */
        p++;
    }
    

    // 开始复制
    while ((*p++ = *t++));

    // 添加结束符号，上面已经复制了结束符
    // *p = '\0';

    return s;

    /* char *p = s;

    // 移动指针 p 到 t 的末尾
    while (*p != '\0') {
        p++;
    }

    // 复制 s 到 t 的末尾
    while (*t != '\0') {
        *p++ = *t++;
    }

    *p = '\0'; // 添加结束符
    return s; */
}