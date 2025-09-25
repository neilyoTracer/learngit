// 编写一个函数setbits(x, p, n ,y), 该函数返回对x执行下列操作后的结果值:
// 将x中从p位开始的n个(二进制)位，设置为y中最右边n位的值，x的其余各位保持不变
/* 思路 assume 82=01010010 p->4 n->3 result 01010110 86
x010 100 10 (把x中第p位起n位清0)
 00000111 ~(~0 << n) 
 000 111 00 << p + 1 - n
 111 000 11 ~   
 010 000 10 & 


y 01000 101 (提取y最右边n位，并且左移p+1-n)
  00000 111 ~(~0 << n)
  00000 101 &    
  000 101 00 << p + 1 - n
  000 101 00 | 010 000 10
  010 101 10
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