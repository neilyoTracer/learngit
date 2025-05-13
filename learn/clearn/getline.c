#include <stdio.h>

int cgetline(char *line, int n) {
    int i = 0, c;
    // 这里到n-1前一个元素，是因为要留一个位置给\n
    while (i < n - 1 && (c = getchar()) != '\n' && c != EOF)
    {
        /* code */
        *line++ = c;
        i++;
    }

    if(c == '\n') {
        *line++ = c;
        i++;
    }
    // 数组末尾加'\0'，这样才是一个数组
    *line = '\0';
    return i;
}