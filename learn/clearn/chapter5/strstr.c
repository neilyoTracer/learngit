#include <stdio.h>
/**
 * the cstrstr function returns a pointer to the first occurence of string t in s。
 */
void *cstrstr(char *s, char *t) 
{
    char *sp, *tp;
    // 开始循环s
    while(*s != '\0') {

        // 每次都记录新的起始位置
        sp = s;
        tp = t;
        
        // 每当*sp == *tp时就开始循环t, *注意停止这个循环, 不然像cstrstr("abcd", "cd") 就会返回空指针;
        while(*sp == *tp && *tp != '\0') {
            sp++;
            tp++;
        }
        // 检查t是否走到尾
        if(*tp == '\0' && sp > s) {
            return s;
        }
        s++;
    }
    return NULL;
}