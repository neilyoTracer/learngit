#include <stdio.h>

int cgetline(char *line, int n) {
    int i = 0, c;
    while ((c = getchar()) != '\n' && c != EOF && i < n - 1)
    {
        /* code */
        *line++ = c;
        i++;
    }

    if(c == '\n') {
        *line++ = c;
        i++;
    }
    // 数组末尾加'\0'
    *line = '\0';
    return i;
}