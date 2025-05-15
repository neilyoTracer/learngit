/**
 * invert(x,p,n)该函数返回对x执行下列操作后的结果
 * 将x中从p位开始的n个位求反，x的其余位不变
 * 思路先建立从p开始的n个屏蔽码
 * 00011100 的mask
 * 然后 x ^ 这个mask
 */
unsigned invert(unsigned x, int p, int n) 
{
    unsigned mask = ~(~0 << n) << (p+1-n);
    return x ^ mask;
}