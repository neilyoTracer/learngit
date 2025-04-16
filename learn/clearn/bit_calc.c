#include <stdio.h>

int atoi(char s[]);
int lower(int a);


unsigned getbits(unsigned x, int p, int n);
int main()
{
    printf("Hello, C in VSCode!\n");
    const unsigned x = 0b11001101;
    const unsigned y = x >> 2;
    printf("%d\n", y);
    const int p = 4;
    const int n = 3;
    const unsigned result = getbits(x, p, n);
    printf("%d\n", result);
    return 0;
}

/**
 * getbits函数：返回x中从第p位开始的n位
 */
unsigned getbits(unsigned x, int p, int n)
{
    return (x >> (p + 1 - n)) & ~(~0 << n);
}

// gcc hello.c -o hello