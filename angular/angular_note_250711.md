# Deferred loading with @defer

```html
@defer {
  <large-component />
}
```

## Show placeholder content with @placeholder

```html
@defer {
  <large-component />
} @placeholder {
  <p>Placeholder content</p>
}
```
The @placeholder block accepts an optional parameter  
to specify the minimum amount of time that this placeholder should be shown  
after the placeholder content initially renders.

```html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Placeholder content</p>
}
```

This minimum parameter is specified in time increments of milliseconds (ms) or seconds (s).  
You can use this parameter  
to ***prevent fast flickering*** 
of placeholder content in the case that the deferred dependencies are fetched quickly.


## Show loading content with @loading


@defer {
  <large-component />
} @loading {
  <img alt="loading..." src="loading.gif" />
} @placeholder {
  <p>Placeholder content</p>
}


* minimum - the minimum amount of time that this placeholder should be shown
* after - the amount of time to wait after loading begins before showing the loading template
```html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="loading..." src="loading.gif" />
}
```

## Show error state when deferred loading fails with @error

```html
@defer {
  <large-component />
} @error {
  <p>Failed to load large component.</p>
}
```

## Controlling deferred content loading with triggers

There are two types of triggers: ***on*** and ***when***.


Trigger	Description
[idle]	
- Triggers when the browser is idle.
[viewport]	
- Triggers when specified content enters the viewport
[interaction]	 
- Triggers when the user interacts with specified element
[hover]	 
- Triggers when the mouse hovers over specified area
[immediate]	 
- Triggers immediately after non-deferred content has finished rendering
[timer]	 
- Triggers after a specific duration

### idle
The idle trigger loads the deferred content once the browser has reached an idle state,  
based on requestIdleCallback. This is the [default] [behavior] with a defer block.

```html
<!-- @defer (on idle) -->
@defer {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

### viewport
By [default], the @defer watches for the [placeholder] entering the viewport.  
Placeholders used this way must have ***a single root element***.
```html
@defer (on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternatively, you can specify a template reference variable in the same template   
as the @defer block as the element   
that is watched to enter the viewport.   
This variable is passed in as a parameter on the viewport trigger.

```html
<div #greeting>Hello!</div>
@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

### interaction
```html
@defer (on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}

<div #greeting>Hello!</div>
@defer (on interaction(greeting)) {
  <greetings-cmp />
}
```

### hover
```html
@defer (on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}

<div #greeting>Hello!</div>
@defer (on hover(greeting)) {
  <greetings-cmp />
}
```

### immediate
The immediate trigger loads the deferred content immediately.   
This means that the deferred block loads  
as soon as all [other] [non-deferred] [content] [has] [finished] rendering.


### timer
```html
@defer (on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

### when

```html
@defer (when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

This is a ***one-time*** operation– the @defer block does not revert back to the placeholder   
if the condition changes to a falsy value after becoming truthy.

### Prefetching data with prefetch
```html
@defer (on interaction; prefetch on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

