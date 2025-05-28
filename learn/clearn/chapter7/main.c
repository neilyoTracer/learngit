#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#define frand() ((double) rand() / (RAND_MAX + 1.0))

int main(int argc, char *argv[]) {
    char name[100];
    int score;
    // scanf("%s/%d", name, &score);
    // scanf("%[^/]%d", name, &score);
    // printf("%s:%d\n", name, score);
    // system("date");
    // scanf 在处理错误输入时不太健壮，实际项目中建议用 fgets + sscanf 更安全。
    printf("%f\n", log10(100));
    /**
     * rand() 实际上是一个伪随机数生成器（PRNG），它生成的序列是确定性的，由**种子（seed）**控制。
     * 如果你不手动设置种子，程序每次启动时用的种子就是默认的，比如 1，所以你看到的结果每次都一样。
     * 正确的用法（使用时间作为种子）
     */
    srand(time(NULL) * 1000);  // 用当前时间设置随机种子 time(NULL) 返回当前时间（单位：秒），所以每次运行都不同。
    printf("%f\n", frand());
}