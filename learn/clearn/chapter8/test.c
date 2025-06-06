#include <stdio.h>

typedef struct
{
    int x;
    int y;
} Point;
Point addpoint(Point, Point);
void addpoint2(Point *, Point *);

int main()
{
    Point p1 = {1, 2};
    Point p2 = {1, 2};
    // Point p3 = addpoint(p1, p2);
    addpoint2(&p1, &p2);
    printf("%d\n", p1.x);
}

Point addpoint(Point p1, Point p2)
{
    p1.x += p2.x;
    p1.y += p2.y;
    return p1;
}

void addpoint2(Point *p1, Point *p2) {
    p1->x += p2->x;
    p1->y += p2->y;
}