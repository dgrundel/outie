[![Build Status](https://travis-ci.com/dgrundel/outie.svg?branch=main)](https://travis-ci.com/dgrundel/outie)

# outie

An _in development_ templating engine for node. Written in TypeScript.

## Configuration

No configuration is required to get started.

_However_, you have the option to configure almost all of the
syntax you can see in the usage examples below.

```typescript
import { Outie } from 'outie';

// use the default config
const outie = new Outie();

// customize everything
// (ok, these are the defaults but you 
// *could* change them if you wanted.)
const custom = new Outie({
    tokenStart: '{',
    tokenEnd: '}',
    closeTokenIdentifier: '/',
    rawTokenIdentifier: 'raw',
    rawIncludeTokenIdentifier: 'includeRaw',
    includeTokenIdentifier: 'include',
    ifTokenIdentifier: 'if',
    unlessTokenIdentifier: 'unless',
    forTokenIdentifier: 'for',
});
```

## Usage

### Simple string template

```typescript
import { Outie } from 'outie';

const template = `Hello, {name}!`;
const data = { name: 'world' };

const outie = new Outie();
const rendered = await outie.render(template, data);

console.log(rendered); // "Hello, world!"
```

### Template from file

```html
<!-- hello.html.outie -->
<h1>Hello, {name}!</h1>
```

```typescript
import { Outie } from 'outie';

const absPath = path.join(__dirname, 'hello.html.outie');
const data = { name: 'world' };

const outie = new Outie();
const rendered = await outie.renderFile(absPath, data);

console.log(rendered); // "<h1>Hello, world!</h1>"
```

### If/Unless

```typescript
import { Outie } from 'outie';

const template = `
    {if lastVisit}Welcome back!{/if}
    {unless lastVisit}Welcome!{/unless}
`;
const data = { lastVisit: null };

const outie = new Outie();
const rendered = await outie.render(template, data);

console.log(rendered.trim()); // "Welcome!"
```

### For loops

You can loop through any collection that is iterable using
`Object.keys`, including arrays and objects. You can access both 
the key and the value within the loop.

```typescript
import { Outie } from 'outie';

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

const outie = new Outie();
const rendered = await outie.render(template, data);

console.log(rendered.trim());
// The common name of Turdus migratorius is American robin'.
// The common name of Cardinalis cardinalis is Northern cardinal.
```

You can omit the key if you're only interested in the values.
```typescript
import { Outie } from 'outie';

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

const outie = new Outie();
const rendered = await outie.render(template, data);

console.log(rendered.trim());
// <ul>
//     <li>London</li>
//     <li>Tokyo</li>
// </ul>
```

### Includes (Partials)

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

const absPath = path.join(__dirname, 'main.html.outie');
const data = { name: 'world', balance: '$1' };

const outie = new Outie();
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

const absPath = path.join(__dirname, 'main.html.outie');
const data = { name: 'world' };

const outie = new Outie();
const rendered = await outie.renderFile(absPath, data);

console.log(rendered);
// <h1>Hello, world!</h1>
// The contents of this {file} are left unparsed.
```

### HTML Encoding and raw values

By default, all data is HTML encoded when rendered
in templates. You can, however, also render data unencoded.

```typescript
import { Outie } from 'outie';

const template = `Hello, {raw name}!`;
const data = { name: '<script>alert("xss");</script>' };

const outie = new Outie();
const rendered = await outie.render(template, data);

console.log(rendered); // "Hello, <script>alert("xss");</script>!"
```