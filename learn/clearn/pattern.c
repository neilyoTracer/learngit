#include <stdio.h>
#define MAXLINE 1000 /* maximum input line length */
int getlineb(char line[], int max);
int strindex(char source[], char searchfor[]);

char pattern[] = "ould"; /** pattern for search */

/** find all the lines thats match pattern*/
int main()
{
    char line[MAXLINE];
    int found = 0;
    while (getlineb(line, MAXLINE) > 0) {
        if(strindex(line, pattern) >= 0) {
            printf("%s", line);
            found++;
        }
    }
    // printf("found: %d\n", found);
    return found;
}

/**getline 函数： save line to s, return  this line len */
/**
 * note: when debug those kind of io function like getchar,should config lldb "externalConsole": true
 */
int getlineb(char s[], int lim)
{
    int c, i;
    i = 0;
    while (--lim > 0 && (c = getchar()) != EOF && c != '\n')
    {
        s[i++] = c;
    }
    if (c == '\n')
    {
        s[i++] = c;
    }
    s[i] = '\0';
    return i;
}

/** strindex函数，return the t's index that in s, if not found, it return -1 */
int strindex(char s[], char t[])
{
    int i, j, k;
    for (i = 0; s[i] != '\0'; i++)
    {
        for (j = i, k = 0; t[k] != '\0' && s[j] == t[k]; j++, k++)
            ;
        if (k > 0 && t[k] == '\0')
        {
            return i;
        }
    }
    return -1;
}
