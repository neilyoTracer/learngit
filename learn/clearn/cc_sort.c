#include <stdio.h>
#include <string.h>
#include "pub.h"
#include <time.h>

#define MAXLINES 5000

char *lineptr[MAXLINES];

int readlines(char *lineptr[], int nlines);
void writelines(char *lineptr[], int nlines);

void qsort(void *lineptr[], int left, int right, int (*com)(void *, void *));
void bubblesort(void *lineptr[], int, int (*com)(void *, void *));

int main(int argc, char *argv[]) {
    // test getline
    /* char str[1000];
    int n = cgetline(str, 1000);
    printf("%s\n", str); */

    // test strcmp
    // int i = cstrcmp("ab", "ac");
    // printf("%d\n", cstrcmp("a", "b"));

    int i;
    i = readlines(lineptr, MAXLINES);
    if(i >= 0) {
        clock_t start, end;
        double cpu_time_used;
        start = clock();
        qsort((void **)lineptr, 0, i-1, (int (*)(void *, void *))cstrcmp);
        // bubblesort((void **)lineptr, i, (int (*)(void *, void *))cstrcmp);
        end = clock();

        cpu_time_used = ((double)(end - start)) / CLOCKS_PER_SEC;
        printf("执行时间: %f 秒\n", cpu_time_used);
        writelines(lineptr, i);
        return 0;
    } else {
        printf("error: input too big to sort\n");
        return 1;
    }
}

#define MAXLEN 1000

int readlines(char *lineptr[], int nlines) {
    int len, i = 0;
    char line[MAXLEN], *p;
    // 循环获取行输入
    while((len = cgetline(line, MAXLEN)) > 0) {
        printf("%d\n", len);
        // 处理错误
        // 1，获取指向len个字符存储空间的指针如果没位置或者已经超过最大行数，返回-1
        if(i >= nlines || (p = alloc(len)) == NULL) {
            return -1;
        } else {
            line[len-1] = '\0'; // 这行很重要, 这里时把一行里的换行符给改成结束符
            // 2，将line中的字符拷贝到这个指针 
            cstrcpy(p, line);
            // 3，将这个指针放入指针数组
            lineptr[i++] = p;
        }

    }
    return i;
}

void writelines(char *lineptr[], int nlines) {
    while (nlines-- > 0)
    {
        /* code */
        printf("%s: %d\n", *lineptr++, nlines);
    }
    
}

void qsort(char *v[], int left, int right, int (*com)(void *, void *)) 
{
    int last, i;
    if(left >= right) {
        return;
    }
    cswap(v, left, (left + right) / 2);
    last = left;
    for(i = left + 1; i <= right; i++) {
        if((*com)(v[i], v[left]) < 0) {
            cswap(v, ++last, i);
        }
    }
    cswap(v, left, last);
    qsort(v, left, last-1, com);
    qsort(v, last+1, right, com);
}

/**
 * @param n 数组元素的个数，这里是读取的行数
 */
void bubblesort(char *v[], int n, int (*com)(void *, void *))
{
    // 外层循环控制比较的轮数(两两比较，所以是len - 1次)
    for(int i = 0; i < n - 1; i++) {
        // 内层循环比较剩余的还未排序的元素，外层循环每进行一次，就会把最大的数放最后，所以每执行一次外层循环，内层循环需要比较的数减少1
        for(int j = 0; j < n - i - 1; j++) {
            if((*com)(v[j], v[j+1]) > 0) {
                cswap(v, j, j+1);
            }
        }
    }
}