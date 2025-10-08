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

// Inferred type is number[] -- "an array with zero or more numbers",
// not specifically two numbers
const args = [8, 5]; // typescript assume this is a number[] rather than a tuple[^]
const angle = Math.atan2(...args); // atan requires a tuple type with 2 number element not a number[]
error: A spread argument must either have a tuple type or be passed to a rest parameter.

// Inferred as 2-length tuple
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```
# is
<Using type predicates>
We’ve worked with existing JavaScript constructs to handle narrowing so far, however sometimes you want more direct control over how types change throughout your code.

To define a user-defined type guard, we simply need to define a function whose return type is a type predicate:
```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

<pet is Fish is our type predicate in this example.>
<In addition>, classes can use this is Type to narrow their type.


# Constrains
```ts
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
 
// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.

function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
Type '{ length: number; }' is not assignable to type 'Type'.
  '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
  }
}
```

# Parameter Destructuring

You can use parameter destructuring to conveniently unpack objects provided as an argument into one or more local variables in the function body. 
In JavaScript, it looks like this:

```ts
function sum({ a, b, c }) {
  console.log(a + b + c);
}
sum({ a: 10, b: 3, c: 9 });
// The type annotation for the object goes after the destructuring syntax:

function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
// Try
// This can look a bit verbose, but you can use a named type here as well:

// Same as prior example
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

# Excess Property Checks
Getting around these checks is actually really simple. The easiest method is to just use a type assertion:

However, a better approach might be to add a string index signature if you’re sure that the object can have some extra properties that are used in some special way. If SquareConfig can have color and width properties with the above types, but could also have any number of other properties, then we could define it like so:
```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: unknown;
}
```

# interface Extension vs. intersection
```ts
// For example, the following code will throw an error because the properties are [incompatible]:
interface Person {
  name: string;
}
interface Person {
  name: number;
}
// In contrast, the following code will compile, but it results in a never type:

interface Person1 {
  name: string;
}
 
interface Person2 {
  name: number;
}
 
type Staff = Person1 & Person2
 
declare const staffer: Staff;
staffer.name;
         
(property) name: never
```

# ReadonlyArray or readonly string[]
```ts
function doStuff(values: ReadonlyArray<string>) {
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);
 
  // ...but we can't mutate 'values'.
  values.push("hello!");
  // Property 'push' does not exist on type 'readonly string[]'.
}

function doStuff(values: readonly string[]) {
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);
 
  // ...but we can't mutate 'values'.
  values.push("hello!");
  // Property 'push' does not exist on type 'readonly string[]'.
}
```

# Tuple
Tuples can also have rest elements, which have to be an array/tuple type.
```ts
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```