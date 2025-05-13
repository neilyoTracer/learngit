#ifndef PUB_H
#define PUB_H

#define NUMBER '0'
void push(double);
double pop(void);
int getop(char *);
int getch(void);
void ungetch(int);
int getint(int *);
int cstrlen(char *);
char *alloc(int n);
void afree(char *);
void cstrcpy(char *, char *);
int cstrcmp(char *, char *);
char *cstrcat(char *, char *);
char *cstrcat(char *, char *);
int cstrend(char *, char *);
int cgetline(char *, int);
void cswap(char *[], int, int);
int day_of_year(int, int, int);
void month_day(int, int, int *, int *);
char *cstrstr(char *, char *);

#endif