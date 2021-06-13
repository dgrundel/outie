[![Build Status](https://travis-ci.com/dgrundel/outie.svg?branch=main)](https://travis-ci.com/dgrundel/outie)

# outie

An _in development_ templating engine for node. Written in TypeScript.

## Configuration

No configuration is required to get started.

_However_, you have the option to configure almost all of the
syntax you can see in the usage examples below.

```typescript
import { Outie, defaultConfig } from 'outie';

// use the default config
const outie = new Outie();

// customize everything
const custom = new Outie({
    tokenStart: '{',
    tokenEnd: '}',
    closeTokenIdentifier: '/',
    
    // tokens lets you add, remove, or customize
    // the set of supported "tokens" (aka tags)
    tokens: {
        // you can easily rename the bundled tokens 
        // using the exported `defaultConfig`

        // rename "raw" token
        '~': defaultConfig.tokens.raw, 
        // rename "includeRaw" token
        'incRaw': defaultConfig.tokens.includeRaw, 
        // rename "include" token
        'inc': defaultConfig.tokens.include, 
        // rename "if" token
        '?': defaultConfig.tokens.if, 
        // rename "unless" token
        '!': defaultConfig.tokens.unless, 
        // rename "for" token
        'each': defaultConfig.tokens.for, 

        // you can also supply your own token definitions
        'random': class RandomToken extends Token {
            async render() {
                return Math.random().toString();
            }
        }
    }
});
```

## Basic Usage

### Render a simple string template

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const template = `Hello, {name}!`;
const data = { name: 'world' };
const rendered = await outie.render(template, data);

console.log(rendered); // "Hello, world!"
```

### Render a template from file

```html
<!-- hello.html.outie -->
<h1>Hello, {name}!</h1>
```

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const absPath = path.join(__dirname, 'hello.html.outie');
const data = { name: 'world' };
const rendered = await outie.renderFile(absPath, data);

console.log(rendered); // "<h1>Hello, world!</h1>"
```

### Precompiling templates from strings

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const templateStr = `Hello, {name}!`;
const data = { name: 'world' };
const template = await outie.template(templateStr); // compile template
const rendered = template.render(data); // render pre-compiled template

console.log(rendered); // "Hello, world!"
```

### Precompiling templates from files

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const absPath = path.join(__dirname, 'hello.html.outie');
const data = { name: 'world' };
const template = await outie.templateFromFile(absPath); // compile template
const rendered = template.render(data); // render pre-compiled template

console.log(rendered); // "Hello, world!"
```


## Logic and Looping

### If/Unless

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const template = `
    {if lastVisit}Welcome back!{/if}
    {unless lastVisit}Welcome!{/unless}
`;
const data = { lastVisit: null };
const rendered = await outie.render(template, data);

console.log(rendered.trim()); // "Welcome!"
```

### For loops

You can loop through any collection that is iterable using
`Object.keys`, including arrays and objects. You can access both 
the key and the value within the loop.

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const template = `
    {for key:value in birds}
        The common name of {key} is {value}.
    {/for}
`;
const data = { 
    birds: {
        'Turdus migratorius': 'American robin',
        'Cardinalis cardinalis': 'Northern cardinal'
    }
};
const rendered = await outie.render(template, data);

console.log(rendered.trim());
// The common name of Turdus migratorius is American robin.
// The common name of Cardinalis cardinalis is Northern cardinal.
```

You can omit the key if you're only interested in the values.
```typescript
import { Outie } from 'outie';
const outie = new Outie();

const template = `
    <ul>
    {for city in cities}
        <li>{city}</li>
    {/for}
    </ul>
`;
const data = { 
    cities: ['London', 'Tokyo']
};
const rendered = await outie.render(template, data);

console.log(rendered.trim());
// <ul>
//     <li>London</li>
//     <li>Tokyo</li>
// </ul>
```

## Includes/Partials

### Includes

You can include templates from other templates using relative or
absolute paths. Relative paths are based on the location of the
template from which they are included.

```html
<!-- main.html.outie -->
<h1>Hello, {name}!</h1>
{include account.html.outie}
```

Included templates inherit the data model that is present at the
time they're included, so you can use any data that would have been 
available in the same spot in the including template.

```html
<!-- account.html.outie -->
<h2>Your Account</h2>
Your balance is {balance}.
```

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const absPath = path.join(__dirname, 'main.html.outie');
const data = { name: 'world', balance: '$1' };
const rendered = await outie.renderFile(absPath, data);

console.log(rendered);
// <h1>Hello, world!</h1>
// <h2>Your Account</h2>
// Your balance is $1.
```

### Raw Includes

If you just want to dump the contents of another file into your
template, you can use a raw include.

```html
<!-- main.html.outie -->
<h1>Hello, {name}!</h1>
{includeRaw raw.html.outie}
```

```html
<!-- raw.html.outie -->
The contents of this {file} are left unparsed.
```

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const absPath = path.join(__dirname, 'main.html.outie');
const data = { name: 'world' };
const rendered = await outie.renderFile(absPath, data);

console.log(rendered);
// <h1>Hello, world!</h1>
// The contents of this {file} are left unparsed.
```

## HTML Encoding and raw values

By default, all data is HTML encoded when rendered
in templates. You can, however, also render data unencoded.

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const template = `Hello, {raw name}!`;
const data = { name: '<script>alert("xss");</script>' };
const rendered = await outie.render(template, data);

console.log(rendered); // "Hello, <script>alert("xss");</script>!"
```

## Extending / Custom Tokens

Here's a complete example of creating a simple custom token.

We start by extending the `abstract class Token`:

```typescript
import { Token } from 'outie';

class RandomToken extends Token {
    async render() {
        return Math.random().toString();
    }
}
```

Then add the token to your config and use it in a template:

```typescript
import { Outie, defaultConfig } from 'outie';

const outie = new Outie({
    ...defaultConfig
    tokens: {
        ...defaultConfig.tokens,
        'random': RandomToken
    }
});

outie.render('Your number is: {random}', {}); // Your number is: 0.24507892345
```