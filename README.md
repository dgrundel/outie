[![Build Status](https://travis-ci.com/dgrundel/outie.svg?branch=main)](https://travis-ci.com/dgrundel/outie)

# outie

A customizable templating engine for node, written in TypeScript.

## Basic usage

### Render a simple string template

[See this example on RunKit.](https://runkit.com/dgrundel/outie-hello-world)

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const template = `Hello, {name}!`;
const data = { name: 'world' };
const rendered = await outie.render(template, data);

console.log(rendered); // "Hello, world!"
```

### Render a template file

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

## Configuration

**No configuration is required to get started.**

```typescript
import { Outie } from 'outie';

// use the default config
const outie = new Outie();
```

_However_, you have the option to configure almost all of the
syntax you can see in the usage examples below.

```typescript
import { Outie, defaultConfig, MruCache, Template } from 'outie';

// customize everything
const customConfig = {
    // these are the defaults
    tokenStart: '{',
    tokenEnd: '}',
    closeTokenIdentifier: '/',
    
    // tokens lets you add, remove, or customize
    // the set of supported "tokens" (aka tags)
    tokens: {
        // you can easily rename the bundled tokens 
        // using the exported `defaultConfig`

        // rename "raw" token to "~"
        '~': defaultConfig.tokens.raw, 
        // rename "includeRaw" token to "incRaw"
        'incRaw': defaultConfig.tokens.includeRaw, 
        // rename "include" token to "inc"
        'inc': defaultConfig.tokens.include, 
        // rename "if" token to "?"
        '?': defaultConfig.tokens.if, 
        // rename "unless" token to "!"
        '!': defaultConfig.tokens.unless, 
        // rename "for" token to "each"
        'each': defaultConfig.tokens.for, 

        // you can also create your own token definitions
        'random': class RandomToken extends Token {
            async render() {
                return Math.random().toString();
            }
        }
    },

    // cache up to 100 template files
    fileCache: new MruCache<Template>(100),
};

const outie = new Outie(customConfig);
```

### Precompiling templates from strings

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const templateStr = `Hello, {name}!`;
const data = { name: 'world' };
const template = await outie.template(templateStr); // compile template
const rendered = await template.render(data); // render pre-compiled template

console.log(rendered); // "Hello, world!"
```

### Precompiling templates from files

```typescript
import { Outie } from 'outie';
const outie = new Outie();

const absPath = path.join(__dirname, 'hello.html.outie');
const data = { name: 'world' };
const template = await outie.templateFromFile(absPath); // compile template
const rendered = await template.render(data); // render pre-compiled template

console.log(rendered); // "Hello, world!"
```


## Logic and looping

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

### Raw includes

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

## HTML encoding and raw values

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

## Custom tokens

### Basic example

Here's a complete example of creating a simple custom token 
that simply outputs a random number when it's used.

We start by extending the `abstract` class `Token`:

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

await outie.render('Your number is: {random}', {}); // Your number is: 0.24507892345
```

### Adding parameters

`Math.random()` is great, but it would be _better_ if we could control
the range of the number that's generated. Let's add some parameters to our
custom token to do just that.

When we're done, we'll be able to use it like so to get a random number
between `10` and `20`:

```
{random 10 20}
```

We'll use our previous example as a starting point, but add a _constructor_
and a couple of fields to keep track of the desired min and max.

```typescript
import { Token, Template } from 'outie';

class RandomToken extends Token {
    private readonly min: number;
    private readonly max: number;

    constructor(content: string) {
        super(content);

        // `content` is the content of the token with the 
        // _identifier_ stripped away.
        // So, for "{random 10 20}", `content` is "10 20".
        const [min, max] = this.content.trim()
            .split(/\s+/)
            .map(s => parseInt(s));

        // a "real" implementation would include some
        // error handling
        this.min = min;
        this.max = max;
    }

    async render() {
        const n = (Math.random() * (this.max - this.min)) + this.min;
        return n.toString();
    }
}
```

### Creating a block token

Block tokens are used when a token should have a _start_ and an _end_.
This is commonly used for looping and conditionals but can be used anywhere
that you need to handle nested content.

To create a block token, extend the `abstract` class `BlockStartToken`.

As an example, we'll create a simple token that wraps anything inside in
an `<h1>` element.

Note: Block tokens have full control over the rendering of any child (i.e.
nested) tokens. If your block token doesn't render its child tokens, they will
not be rendered.

```typescript
export class HeadingToken extends BlockStartToken {

    async render(model: RenderModel): Promise<string> {
        // all child tokens are stored in `this.children`
        const nestedTokens = this.children;
        // you can use `Token.renderTokens` to easily render all child tokens
        const renderedChildren = await Token.renderTokens(nestedTokens, model);
        
        return `<h1>${renderedChildren}</h1>`;
    }
}
```

