#include <stdio.h>
#include <string.h>
#define MAXLINE 1000

int cgetline(char *, int);

/**find 函数，打印所有与第一个参数指定的模式相匹配的行 */
void main(int argc, char *argv[])
{
    char line[MAXLINE];
    long lineno = 0;
    int c, except = 0, number = 0, found = 0;

    // 这是找到所有的可选参数，即带-的参数，循环完了之后argc的值必须是1，剩下两个参数，程序名和pattern,argv位置在最后一个指针
    // 另外 (*++argv)[0] 还可以写成 **++argv
    while (--argc > 0 && (*++argv)[0] == '-')
    {
        while (c = *++argv[0])
        { // 这里的argv[0]和*argv是一个道理哈
            switch (c)
            {
            case 'x':
                except = 1;
                break;
            case 'n':
                number = 1;
                break;
            default:
                printf("find: illegal option %c\n", c);
                break;
            }
        }
    }

    if (argc != 1)
    {
        printf("Usage: find -x -n pattern\n");
    }
    else
    {
        while (cgetline(line, MAXLINE) > 0)
        {
            lineno++;
            if ((strstr(line, *argv) != NULL) != except)
            {
                if (number)
                {
                    printf("%ld:", lineno);
                }
                printf("%s", line);
                found++;
            }
        }
    }
    return found;
}