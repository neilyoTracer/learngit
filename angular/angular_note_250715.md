# [Structural] directives

## Creating a [structural] directive

1 Generate the directive
```shell
$ ng generate directive select
```

2 Make the directive [structural]
Import TemplateRef, and ViewContainerRef.   
Inject TemplateRef and ViewContainerRef in the directive as private properties.

```js
import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';
@Directive({
  selector: '[select]',
})
export class SelectDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
}
```

3 Add the 'selectFrom' input
```js
export class SelectDirective {
  // ...
  selectFrom = input.required<DataSource>();
}
```

4 Add the business logic
```js
export class SelectDirective {
  // ...
  async ngOnInit() {
    const data = await this.selectFrom.load();
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      // Create the embedded view with a context object that contains
      // the data via the key `$implicit`.
      $implicit: data,
    });
  }
}
```
```html
<!-- Shorthand syntax: -->
<p class="data-view" *select="let data from source">The data is: {{data}}</p>
<!-- Long-form syntax: -->
<ng-template select let-data [selectFrom]="source">
  <p class="data-view">The data is: {{data}}</p>
</ng-template>
```

### Type narrowing with template guards
```js
// This directive only renders its template if the actor is a user.
// You want to assert that within the template, the type of the `actor`
// expression is narrowed to `User`.
@Directive(...)
class ActorIsUser {
  actor = input<User | Robot>();
  static ngTemplateGuard_actor(dir: ActorIsUser, expr: User | Robot): expr is User {
    // The return statement is unnecessary in practice, but included to
    // prevent TypeScript errors.
    return true;
  }
}
```

Some directives only render their templates when an input is truthy.   
It's not possible to capture the full semantics of truthiness in a type assertion function,   
so instead a literal type of 'binding' can be used to signal   
to the template type-checker that the binding expression itself should be used as the guard:
```js
@Directive(...)
class CustomIf {
  condition = input.required<boolean>();
  static ngTemplateGuard_condition: 'binding';
}
```

#### Typing the directive's context
For the SelectDirective described above,   
you can implement an ngTemplateContextGuard to correctly specify the data type,  
even if the data source is generic.

```js
// Declare an interface for the template context:
export interface SelectTemplateContext<T> {
  $implicit: T;
}
@Directive(...)
export class SelectDirective<T> {
  // The directive's generic type `T` will be inferred from the `DataSource` type
  // passed to the input.
  selectFrom = input.required<DataSource<T>>();
  // Narrow the type of the context using the generic type of the directive.
  static ngTemplateContextGuard<T>(dir: SelectDirective<T>, ctx: any): ctx is SelectTemplateContext<T> {
    // As before the guard body is not used at runtime, and included only to avoid
    // TypeScript errors.
    return true;
  }
}
```
