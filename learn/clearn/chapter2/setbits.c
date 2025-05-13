// 编写一个函数setbits(x, p, n ,y), 该函数返回对x执行下列操作后的结果值:
// 将x中从p位开始的n个(二进制)位，设置为y中最右边n位的值，x的其余各位保持不变
/* 思路 assume p->4 n->3
x01010010 (把x中第p位起n位清0)
 00000111 ~(~0 << n) 
~00011100 << (p+1-n)
&11100011
 01000010


y01000101 (从y中提取出最右边的n位)
&00000111 ~(~0 << n)
y00000101
 00010100 y << (p+1-n)


 01000010 | 00010100
 就可以拿到最终结果 */

unsigned setbits(unsigned x, int p, int n, unsigned y) {
    // 1. 提取y最右边的n位
    unsigned y_bits = y & ~(~0 << n);

    // 2.构造一个00011100的掩码
    unsigned mask = ~(~(~0 << n) << (p+1-n));
    unsigned x_cleared = x & mask;

    // 3.将 y_bits对齐到p位开始，然后与x_cleared合并
    return x_cleared | (y_bits << (p+1-n));
}