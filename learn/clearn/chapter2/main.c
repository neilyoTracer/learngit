#include <stdio.h>

unsigned setbits(unsigned, int, int, unsigned);

int main(int argc, char *argv[]) {
    unsigned r = setbits(82, 4, 3, 69);
    printf("%d\n", r);
    return 0;
}