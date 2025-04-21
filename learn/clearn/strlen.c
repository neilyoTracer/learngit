// version one
// int cstrlen(char *s)
// {
//     int i = 0;
//     while (*s++ != '\0')
//     {
//         /* code */
//         i++;
//     }
    
//     return i;
// }

// version two
int cstrlen(char *s)
{
    // char *p = s;
    // while (*s++ != '\0');
    // return (s - 1) - p;

    char *p = s;
    while (*p != '\0')
    {
        /* code */
        p++;
    }

    return p - s;
    
} 