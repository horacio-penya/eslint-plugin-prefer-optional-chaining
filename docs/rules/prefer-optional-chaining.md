# Prefer optional chaining over a sequence of validations (prefer-optional-chaining)

The optional chaining operator (?.) permits reading the value of a property located deep within a chain of connected objects without having to expressly validate that each reference in the chain is valid.

ECMAScript proposal at stage 4 of the process. 

## Rule Details

This rule aims to flag validations chains.

Examples of **incorrect** code for this rule:

```js

a && a.b && a.b.c

```

Examples of **correct** code for this rule:

```js

a?.b?.c

```

## When Not To Use It

This rule should not be used in ES3/5 environments.
