const fibonacci = function(n) { 
    if(n < 1) throw new Error('error param');
    if(n === 1 || n === 2) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(35));
