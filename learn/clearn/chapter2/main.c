#include <stdio.h>
#include <time.h>

// unsigned setbits(unsigned, int, int, unsigned);
// unsigned invert(unsigned, int, int);
// unsigned rightrot(unsigned, int);
int bitcount(unsigned x);

int main(int argc, char *argv[]) {
    // unsigned r = setbits(82, 4, 3, 69);
    // printf("%u\n", r);
    // unsigned r1 = invert(82, 4, 3);
    // printf("%u\n", r1);
    // unsigned r2 = rightrot(0b10110011, 3); // 不同的操作系统位数得出的值不一样，32位的是1610612758
    // printf("%u\n", r2);
    clock_t start, end;
    double cpu_time_used;
    start = clock();
    int b = bitcount(0b10101010010101011010101001010101);
    end = clock();
    cpu_time_used = ((double)(end - start)) / CLOCKS_PER_SEC;
    printf("执行时间: %f 秒\n", cpu_time_used);
    printf("%d\n", b);
    return 0;
}