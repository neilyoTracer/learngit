#ifndef PUB_H
#define PUB_H

#define NUMBER '0'
void push(double);
double pop(void);
int getop(char []);
int getch(void);
void ungetch(int);
int getint(int *p);
int cstrlen(char *s);
char *alloc(int n);
void afree(char *p);
void cstrcpy(char *t, char *s);
int cstrcmp(char *s, char *t);
char *cstrcat(char *s, char *t);
char *cstrcat(char *s, char *t);
int cstrend(char *s, char *t);
int cgetline(char*, int);
void cswap(char *[], int, int);
int day_of_year(int year, int month, int day);
void month_day(int year, int yearday, int *pmonth, int *pday);

#endif