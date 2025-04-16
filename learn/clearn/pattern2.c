#include <stdio.h>

int main(int argc, char *argv[])
{
    /* code */
    printf("%s\n", *(argv+=1));
    
    // char *argv2[] = {"test", "cc"};
    // printf("%s\n", *(argv2+=1));
    
    return 0;
}
