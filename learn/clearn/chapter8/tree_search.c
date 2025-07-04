struct tnode {
    char *word;
    int count;
    struct tnode *left;
    struct tnode *right;
}

#include <stdio.h>
#include <ctype.h>
#include <string.h>

#define MAXWORD 100

struct tnode *addtree(struct tnode *, char *);
void treeprint(struct tnode *);
int getword(char *, int);