#include <stdio.h>
#include "../pub.h"

/* int main(int argc, char *argv[]) {
    int i;
    for(i = 1; i < argc; i++) {
        printf("%s%s", argv[i], (i < argc - 1) ? " ": "");
        printf("\n");
        return 0;
    }
} */

int main(int argc, char *argv[]) {
    /* while(--argc > 0) {
        printf((argc > 1) ? "%s ": "%s", *argv++);
    }
    printf("\n");
    return 0; */
    char *p = cstrstr("ttabcdababc", "abc");
    printf("%s\n", p);
}