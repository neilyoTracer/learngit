/**
 * 如果t出现在s的尾部(部分)，返回1，否则返回0
 * cstrend("hloello", "lo") -> 1
 * cstrend("hello", "el") -> 0
 */
int cstrend(char *s, char *t)
{
    // 保存t的起始位置
    char *s_s = s;
    char *t_s = t;

    // 思路: 倒过来比较
    // 先把两个指针都移动到末尾
    while(*s++);
    while(*t++);

    // 从'\0'开始
    while(t > t_s) {
        t--;
        s--;
        if(*s != *t || s < s_s) {
            return 0;
        }
    }

    return 1;
}