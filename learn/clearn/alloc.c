/**
 * alloc函数获取一个指向n个字符的存储空间
 */
#define ALLOCSIZE 10000
static char allocbuf[ALLOCSIZE];
static char *allocp = allocbuf;

char *alloc(int n)
{
    // if(allocp + n - ALLOCSIZE < 0) {
    // if(allocp + n <= ALLOCSIZE) {
    // 像上面两种表达式是没有意义的，首先allocp和 allocbuf本身都是内存里面的地址，他们可以移动int个位，
    // 但是移动后的结果不太可能是一个自然整数，而是类似于0x00022这样的16或者8进制数，所以直接把地址运算的结果和自然数对比是没有意义的
    // 而下面是正确的情况，它是比较两个地址之间的差值，这个时候就可以和自然数进行比较了
    // allocbuf向前移动了ALLOCSIZE之后的地址，然后和allocp所在的地址进行比较，如果他们之间的差值正好是n或者比n还大，就证明还有位置
    if(allocbuf + ALLOCSIZE - allocp >= n) {
        allocp += n;
        return allocp - n;
    } else {
        return 0;
    }

}

/**
 * 释放这个n个存储空间
 */
void afree(char *p)
{
    // if(p >= 0 && (p - ALLOCSIZE) < 0) { 
    // 上面也是不对的, 下面是正确的写法
    if(p >= allocbuf && p < allocbuf + ALLOCSIZE) {
        allocp = p;
    }
}