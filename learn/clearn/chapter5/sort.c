#include <stdio.h>
#include <string.h>
#include "../pub.h"

#define MAXLINES 5000
char *lineptr[MAXLINES];

int readlines(char *lineptr[], int nlines);
void writelines(char *lineptr[], int nlines);

void qsort(void *lineptr[], int left, int right, int (*com)(void *, void *));
int numcmp(const char *, const char *);

int main(int argc, char *argv[])
{
    int nlines;
    int numeric = 0;

    if(argc > 1 && strcmp(argv[1], "-n") == 0) {
        numeric = 1;
    }

    if((nlines = readlines(lineptr, MAXLINES)) >= 0) {
        qsort((void **)lineptr, 0, nlines - 1, (int (*)(void *, void *))(numeric ? numcmp : strcmp));
        writelines(lineptr, nlines);
        return 0;
    } else {
        printf("input too big to sort\n");
        return 1;
    }
}

#define MAXLEN 1000

int readlines(char *lineptr[], int nlines) {
    int len, i = 0;
    char line[MAXLEN], *p;

    while((len = cgetline(line, MAXLEN)) > 0) {
        printf("%d\n", len);
        if(i >= nlines || (p = alloc(len)) == NULL) {
            return -1;
        } else {
            line[len - 1] = '\0';
            strcpy(p, line);
            lineptr[i++] = p;
        }
    }
    return i;
}

void writelines(char * lineptr[], int nlines) {
    while (nlines-- > 0)
    {
        /* code */
        printf("%s: %d\n", *lineptr++, nlines);
    }
    
}

void qsort(void *v[], int left, int right, int (*com)(void *, void *))
{
    int i, last;
    void swap(void *v[], int, int);

    if(left >= right) {
        return;
    }
    swap(v, left, (left + right)/2);
    last = left;
    for(i = left + 1; i <= right; i++) {
        if((*com)(v[i], v[left]) < 0) {
            swap(v, ++last, i);
        }
    }
    swap(v, left, last);
    qsort(v, left, last - 1, com);
    qsort(v, last + 1, right, com);
}



void swap(void *v[], int i, int j) {
    void *temp;

    temp = v[i];
    v[i] = v[j];
    v[j] = temp;
}