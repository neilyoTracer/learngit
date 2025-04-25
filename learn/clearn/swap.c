void cswap(char *v[], int i, int j) 
{
    char *temp;
    temp = v[i];
    v[i] = v[j];
    v[j] = temp;
}
