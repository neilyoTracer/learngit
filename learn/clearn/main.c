#include <stdio.h>
#include "pub.h"

int main(int argc, char *argv[])
{
    // int day = day_of_year(2024, 3, 1);
    int month;
    int day;
    month_day(2024, 61, &month, &day);
    printf("2024年%d月%d日\n", month, day);
}