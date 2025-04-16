/**
 * while(下一个运算符或操作数不是文件结束符) {
 *  if(是数字) 
 *   push(数字);    
 * else if(是操作符) 
 *  弹出所需数目的操作数
 * 执行运算
 *  将结果push入栈
 * else if(是换行符) 
 * 打印栈顶元素
 * else
 *  错误处理
 */
#include <stdio.h>
#include <stdlib.h>
#include "calc.h"
#define MAXOP 100
int main()
{
    int type;
    double op2;
    char s[MAXOP];

    while((type = getop(s)) != EOF) {
        switch(type) {
            case NUMBER:
                push(atof(s));
                break;
            case '+':
                push(pop() + pop());
                break;
            case '*':
                push(pop() * pop());
                break;
            case '-':
                op2 = pop();
                push(pop() - op2);
                break;
            case '/':
                op2 = pop();
                if(op2 != 0.0) {
                    push(pop() / op2);
                } else {
                    printf("error: zero divisor\n");
                }
                break;
            case '\n':
                printf("\t%.8g\n", pop());
                break;    
            default:
                printf("error: unknown command %s\n", s);
                break;
        }
    }
    return 0;
}