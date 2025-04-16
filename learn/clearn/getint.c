#include <stdio.h>
#include <ctype.h>
#include "pub.h"
#define MAX_SIZE 100
int n, array[MAX_SIZE], *p, temp;

int main() {
    // call getint
    for(n = 0; (temp = getint(&array[n])) != EOF && n < MAX_SIZE; ) {
        if(temp != 0) {
            n++;
        }
    }
    p = array;
    while (n-- > 0)
    {
        printf("%d\n", *p++);
    }
    
}

int getint(int *pn) {
    int c, sign;

    // 跳过空格和制表符
    while(isspace(c = getch()));
    // 如果不是数字 返回0
    if(!isdigit(c) && c != '+' && c != '-' && c != EOF) {
        // ungetch(c);
        return 0;
    }

    sign = (c == '-') ? -1 : 1; // 暂时保存一下符号位
    // 如果是+/-号， 往后取一位，然后进行数字判断
    if(c == '+' || c == '-') {
        c = getch();
    }

    // 如果是数字，连续取值直到不是数字，期间给pn进行赋值
    /* if(isdigit(c)) {
        for(int i = 0; !isdigit(c = getch()); i++) {
            *pn = *pn * 10 + c;
        }
        *pn = *pn * sign;
        pn++;
    } */
    for(*pn = 0; isdigit(c); c = getch()) {
        *pn = *pn * 10 + (c - '0');
    }
    *pn *= sign;

    // 这里的c已经不再是数字，如果不是EOF反压回buff
    if(c != EOF) {
        ungetch(c);
    }
    return c;
}
