# Defining dependency providers

## Specifying a provider token
```js
[{ provide: Logger, useClass: Logger }]
```

The expanded provider configuration is an object literal with two properties:

The [provide] property holds the token that serves as the key for consuming the dependency value.
The second property is a provider definition object, which tells the injector how to create the dependency value.  
The provider-definition can be one of the following:
[useClass] - this option tells Angular DI to instantiate a provided class when a dependency is injected
[useExisting] - allows you to alias a token and reference any existing one.
[useFactory] - allows you to define a function that constructs a dependency.
[useValue] - provides a static value that should be used as a dependency.

### Class providers: useClass

```js
[{ provide: Logger, useClass: BetterLogger }]

[
  UserService, // dependency needed in `EvenBetterLogger`.
  { provide: Logger, useClass: EvenBetterLogger },
]

@Injectable()
export class EvenBetterLogger extends Logger {
  private userService = inject(UserService);
  override log(message: string) {
    const name = this.userService.user.name;
    super.log(`Message to ${name}: ${message}`);
  }
}
```

### Alias providers: useExisting
```js
[
  NewLogger,
  // Alias OldLogger w/ reference to NewLogger
  { provide: OldLogger, useExisting: NewLogger},
]
```

NOTE: Ensure you do not alias OldLogger to NewLogger with useClass, as this creates two different NewLogger instances.


### Factory providers: useFactory
The useFactory provider key lets you create a dependency object by calling a factory function.  
With this approach, you can create a [dynamic] value based on information available in the DI and elsewhere in the app.

```js
class HeroService {
  constructor(
    private logger: Logger,
    private isAuthorized: boolean) { }
  getHeroes() {
    const auth = this.isAuthorized ? 'authorized' : 'unauthorized';
    this.logger.log(`Getting heroes for ${auth} user.`);
    return HEROES.filter(hero => this.isAuthorized || !hero.isSecret);
  }
}

const heroServiceFactory = (logger: Logger, userService: UserService) =>
  new HeroService(logger, userService.user.isAuthorized);

export const heroServiceProvider = {
  provide: HeroService,
  useFactory: heroServiceFactory,
  deps: [Logger, UserService]
};
```
The [useFactory] field specifies that the provider is a factory function whose implementation is heroServiceFactory.
The [deps] property is an array of provider tokens.  
The [Logger] and [UserService] classes serve as [tokens] for their own class providers.  
The [injector] resolves these tokens and injects the [corresponding] services into the matching heroServiceFactory factory function parameters, based on the order specified.


### Value providers: useValue

## Using an InjectionToken object
Use an InjectionToken object as provider token for non-class dependencies. 
```js
import { InjectionToken } from '@angular/core';
export interface AppConfig {
  title: string;
}
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config description');

const MY_APP_CONFIG_VARIABLE: AppConfig = {
  title: 'Hello',
};
providers: [{ provide: APP_CONFIG, useValue: MY_APP_CONFIG_VARIABLE }]
```

## EnvironmentInjector
The EnvironmentInjector can be configured in one of [two] ways by using:

The @Injectable() [providedIn] property to refer to [root] or [platform]
The ApplicationConfig [providers] array

The following diagram represents the relationship between the root ModuleInjector and its parent injectors

NullInjector
always throws an error unless
you use @Optional()
 
EnvironmentInjector
(configured by Angular)
has special things like DomSanitizer => providedIn 'platform'

root EnvironmentInjector
(configured by AppConfig)
has things for your app => bootstrapApplication(..., AppConfig)

ElementInjector

## ElemenetInjector
@Directive() and @Component()
A component is a special type of directive,  
which means that just as @Directive() has a providers property, @Component() does too.  
This means that directives as well as components can configure providers,  
using the providers property.  
When you configure a provider for a component or directive using the providers property,  
that provider belongs to the ElementInjector of that component or directive.  
[Components] and [directives] on the [same] [element] [share] [an] [injector].

[HOST](https://angular.dev/guide/di/hierarchical-dependency-injection#host)
If you now add [host] (in addition to the skipSelf), the result will be null.  
This is because [host] limits the upper bound of the search to the app-child <#VIEW>.

[host]: true causes the injector to look until it encounters the edge of the <#VIEW>.
