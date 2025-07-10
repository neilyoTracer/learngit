# [ng-template]
## You can get a reference to a template fragment in one of three ways:

1. By declaring a template reference variable on the <ng-template> element
2. By querying for the fragment with a component or directive query
3. By injecting the fragment in a directive that's applied directly to an <ng-template> element.

## If a template contains multiple fragments, you can assign a name to each fragment by adding a template reference variable to each <ng-template> element and querying for the fragments based on that name:

```js
@Component({
  /* ... */,
  template: `
    <p>This is a normal element</p>
    <ng-template #fragmentOne>
      <p>This is one template fragment</p>
    </ng-template>
    <ng-template #fragmentTwo>
      <p>This is another template fragment</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
  // When querying by name, you can use the `read` option to specify that you want to get the
  // TemplateRef object associated with the element.
  @ViewChild('fragmentOne', {read: TemplateRef}) fragmentOne: TemplateRef<unknown> | undefined;
  @ViewChild('fragmentTwo', {read: TemplateRef}) fragmentTwo: TemplateRef<unknown> | undefined;
}
```

## Injecting a template fragment

```js
@Directive({
  selector: '[myDirective]'
})
export class MyDirective {
  private fragment = inject(TemplateRef);
}

<ng-template myDirective>
  <p>This is one template fragment</p>
</ng-template>
```

## Rendering a template fragment
Once you have a reference to a template fragment's TemplateRef object, you can render a fragment in one of two ways: 
1. in your template with the [NgTemplateOutlet] directive or 
2. in your TypeScript code with [ViewContainerRef].


## Using ViewContainerRef
```js
@Component({
  /* ... */,
  selector: 'component-with-fragment',
  template: `
    <h2>Component with a fragment</h2>
    <ng-template #myFragment>
      <p>This is the fragment</p>
    </ng-template>
    <my-outlet [fragment]="myFragment" />
  `,
})
export class ComponentWithFragment { }
@Component({
  /* ... */,
  selector: 'my-outlet',
  template: `<button (click)="showFragment()">Show</button>`,
})
export class MyOutlet {
  private viewContainer = inject(ViewContainerRef);
  fragment = input<TemplateRef<unknown> | undefined>();
  showFragment() {
    if (this.fragment()) {
      this.viewContainer.createEmbeddedView(this.fragment());
    }
  }
}

<component-with-fragment>
  <h2>Component with a fragment</h2>
  <my-outlet>
    <button>Show</button>
  </my-outlet>
  <p>This is the fragment</p>
</component-with-fragment>
```
## Passing parameters when rendering a template fragment

```html
<ng-template let-pizzaTopping="topping">
  <p>You selected: {{pizzaTopping}}</p>
</ng-template>

<ng-template #myFragment let-pizzaTopping="topping">
  <p>You selected: {{pizzaTopping}}</p>
</ng-template>
<ng-container
  [ngTemplateOutlet]="myFragment"
  [ngTemplateOutletContext]="{topping: 'onion'}"
/>
```

## Using ViewContainerRef

```js
this.viewContainer.createEmbeddedView(this.myFragment, {topping: 'onion'});
```

## Structural directives
```html
<section *myDirective>
  <p>This is a fragment</p>
</section>

<ng-template myDirective>
  <section>
    <p>This is a fragment</p>
  </section>
</ng-template>
```

# [ng-container]
## Using <ng-container> to display dynamic contents
```js
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngComponentOutlet]="profileComponent()" />
  `
})
export class UserProfile {
  isAdmin = input(false);
  profileComponent = computed(() => this.isAdmin() ? AdminProfile : BasicUserProfile);
}
```

## Rendering template fragments

```js
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngTemplateOutlet]="profileTemplate()" />
    <ng-template #admin>This is the admin profile</ng-template>
    <ng-template #basic>This is the basic profile</ng-template>
  `
})
export class UserProfile {
  isAdmin = input(false);
  adminTemplate = viewChild('admin', {read: TemplateRef});
  basicTemplate = viewChild('basic', {read: TemplateRef});
  profileTemplate = computed(() => this.isAdmin() ? this.adminTemplate() : this.basicTemplate());
}
```

## Using <ng-container> for injection

```js
@Directive({
  selector: '[theme]',
})
export class Theme {
  // Create an input that accepts 'light' or 'dark`, defaulting to 'light'.
  mode = input<'light' | 'dark'>('light');
}

<ng-container theme="dark">
  <profile-pic />
  <user-bio />
</ng-container>
```
<In the example above, the ProfilePic and UserBio components can inject the Theme directive and apply styles based on its mode.>

# Variables in templates
## Assigning a reference to an Angular directive
```js
@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone { /* ... */ }

<!-- The `firstZone` variable refers to the `DropZone` directive instance. -->
<section dropZone #firstZone="dropZone"> ... </section>
```

<You cannot refer to a directive that does not specify an exportAs name.>