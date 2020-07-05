/**
 * @fileoverview Prefer optional chaining over a sequence of validations
 * @author Horacio J Peña
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Prefer optional chaining over a sequence of validations",
      category: "suggestion",
      recommended: false,
    },
    fixable: "code",
    schema: [],
  },

  create: function (context) {
    const sourceCode = context.getSourceCode();

    return {
      "LogicalExpression[operator=&&]:exit": function (node) {
        if (
          node.parent.type == "LogicalExpression" &&
          node.parent.operator == "&&"
        ) {
          return;
        }
        let ops = [node.right];

        let left = node.left;
        while (left.type == "LogicalExpression" && left.operator == "&&") {
          ops.push(left.right);
          left = left.left;
        }

        ops.push(left);
        ops = ops.reverse();

        let first, last;
        for (first = 0; first < ops.length - 1; first++) {
          if (
            ops[first + 1].type == "MemberExpression" &&
            equalTokens(ops[first], ops[first + 1].object, sourceCode)
          )
            break;
        }
        if (first == ops.length - 1) return;

        for (
          last = first + 1;
          last < ops.length - 1 &&
          ops[last + 1].type == "MemberExpression" &&
          equalTokens(ops[last], ops[last + 1].object, sourceCode);
          last++
        );

        let r = sourceCode.getText(ops[first]);
        for (let i = first + 1; i <= last; i++) {
          r +=
            "?." +
            (ops[i].computed ? "[" : "") +
            sourceCode.getText(ops[i].property) +
            (ops[i].computed ? "]" : "");
        }

        context.report({
          node,
          message: "Prefer optional chaining.",
          fix: function (fixer) {
            return fixer.replaceTextRange(
              [ops[first].range[0], ops[last].range[1]],
              r
            );
          },
        });
      },
    };
  },
};

// from https://autodocs.io/view/eslint/eslint/lib_rules_no-useless-call.js.html
function equalTokens(left, right, sourceCode) {
  const tokensL = sourceCode.getTokens(left);
  const tokensR = sourceCode.getTokens(right);
  if (tokensL.length !== tokensR.length) {
    return false;
  }
  for (let i = 0; i < tokensL.length; ++i) {
    if (
      tokensL[i].type !== tokensR[i].type ||
      tokensL[i].value !== tokensR[i].value
    ) {
      return false;
    }
  }
  return true;
}
