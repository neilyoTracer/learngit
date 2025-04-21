#include <stdio.h>
#include "pub.h"

int main(int argc, char *argv[])
{
    printf("%d\n", cstrend("hello", "lo"));
}