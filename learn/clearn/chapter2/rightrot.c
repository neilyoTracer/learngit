/**
 * rightrot函数返回将x循环右移n位后所得到的值
 * 思路:
 * 1. x左移位到只剩下右边n位保存到x_rn_bits
 * x 0101 0010 -> 0100 0000
 * 2. 然后x右移n位
 * x 0101 0010 -> 0000 1010
 * 3. 0100 0000 | 0000 1010 -> 0100 1010
 */
#include <stdio.h>

unsigned rightrot(unsigned x, int n)
{
    int len = sizeof(x) * 8;
    n = n % len; // 防止移位超过位宽

    return (x >> n) | (x << (len - n));
}