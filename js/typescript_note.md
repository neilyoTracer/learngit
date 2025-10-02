# Differences Between Type Aliases and Interfaces
```ts
// Extending an interface

interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;

// Extending a type via intersections

type Animal = {
  name: string;
}

type Bear = Animal & { 
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;

// Adding new fields to an existing interface

interface Window {
  title: string;
}

interface Window {
  ts: TypeScriptAPI;
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});

// A type cannot be changed after being created

type Window = {
  title: string;
}

type Window = {
  ts: TypeScriptAPI;
}

 // Error: Duplicate identifier 'Window'.

```

# Literal Interface
```ts
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);

error: Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.

// There are two ways to work around this above error:
// 2. You can use as const to convert the entire object to be type literals
function handleRequst(url: string, method: "GET" | "POST"): void {}

const req = {url: "https://example.com", method: "GET"} as const;
handleRequst(req.url, req.method);
```
