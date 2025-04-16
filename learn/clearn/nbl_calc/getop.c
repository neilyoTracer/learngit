#include <stdio.h>
#include <ctype.h>
#include "calc.h"

/** getop 函数： 获取下个运算符或操作数 */
int getop(char s[])
{
    int i, c;
    while((s[0] = c = getch()) == ' ' || c == '\t'); // 忽略空格和制表符
    s[1] = '\0';
    if(!isdigit(c) && c != '.') { // 遇到第一个不是数字或'.', 直接return 这个字符，栈里面已经放入了这个字符
        return c;
    }
    i = 0; // 处理了其他情况，现在开始遍历
    // 遇到的是数字，push进stack
    if(isdigit(c)) {
        while(isdigit(s[++i] = c = getch()));
    }
    
    // 遇到.继续push小数部分
    if(c == '.') {
        while(isdigit(s[++i] = c = getch()));
    }
    s[i] = '\0';
    // 这里之后就不再是数字，但它也被压入了s，但也有可能是EOF
    // 如果遇到的是EOF，代表结束，所有都是数字直接返回NUMBER, 如果不是EOF，说明最后一个字符有可能是操作符，反弹最后一个字符回缓存栈，待下次取用
    if(c != EOF) {
        ungetch(c);
    }

    // 返回 NUMBER
    return NUMBER;
}