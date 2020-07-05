/**
 * @fileoverview Prefer optional chaining over a sequence of validations
 * @author Horacio J Peña
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/prefer-optional-chaining"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });
ruleTester.run("prefer-optional-chaining", rule, {
  valid: [
    {
      code: "a || a.b",
    },
    {
      code: "a && b && c",
    },
  ],

  invalid: [
    {
      code: "a && a.b",
      errors: [
        {
          message: "Prefer optional chaining.",
        },
      ],
      output: "a?.b",
    },
    {
      code: "a && a.b && a.b.c",
      errors: [{ message: "Prefer optional chaining." }],
      output: "a?.b?.c",
    },
    {
      code: "a && a.b && c.d",
      errors: [
        {
          message: "Prefer optional chaining.",
        },
      ],
      output: "a?.b && c.d",
    },
    {
      code: "c.d && a && a.b",
      errors: [
        {
          message: "Prefer optional chaining.",
        },
      ],
      output: "c.d && a?.b",
    },
    {
      code: "(a.b && a.b.c) || (d.e && d.e.f)",
      errors: [
        { message: "Prefer optional chaining." },
        { message: "Prefer optional chaining." },
      ],
      output: "(a.b?.c) || (d.e?.f)",
    },
    {
      code: "a[0] && a[0].b",
      errors: [
        {
          message: "Prefer optional chaining.",
        },
      ],
      output: "a[0]?.b",
    },
    {
      code: "a && a[i]",
      errors: [
        {
          message: "Prefer optional chaining.",
        },
      ],
      output: "a?.[i]",
    },
    {
      code: "a && a.b && a.b[c]",
      errors: [{ message: "Prefer optional chaining." }],
      output: "a?.b?.[c]",
    },
    {
      code: "a.b && a.b[c]",
      errors: [
        {
          message: "Prefer optional chaining.",
        },
      ],
      output: "a.b?.[c]",
    },
    {
      code: "a.b && a.b.c && a.b.c.d && e",
      errors: [{ message: "Prefer optional chaining." }],
      output: "a.b?.c?.d && e",
    },
    {
      code: "a.b && a.b.c && a.b.c.d && a.b.c.d == e",
      errors: [{ message: "Prefer optional chaining." }],
      output: "a.b?.c?.d && a.b.c.d == e",
    },
    {
      code: "a.b && a.b.c && a.b.c[d] && a.b.c[d].e",
      errors: [{ message: "Prefer optional chaining." }],
      output: "a.b?.c?.[d]?.e",
    },
  ],
});
