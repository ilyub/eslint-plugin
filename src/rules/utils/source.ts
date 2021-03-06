/* eslint-disable @skylib/only-export-name -- Postponed */

import { defineFn, is } from "@skylib/functions";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { Callback } from "./source.internal";
import type { RuleListener } from "@typescript-eslint/utils/dist/ts-eslint";
import { Type } from "./source.internal";

export const create = defineFn(
  // eslint-disable-next-line @skylib/require-jsdoc/functions -- Postponed
  (callback: Callback): RuleListener => ({
    CallExpression: (node): void => {
      if (
        node.callee.type === AST_NODE_TYPES.Identifier &&
        node.callee.name === "require"
      ) {
        const source = node.arguments[0];

        if (
          is.not.empty(source) &&
          source.type === AST_NODE_TYPES.Literal &&
          is.string(source.value)
        )
          callback({ node: source, source: source.value, type: Type.import });
      }
    },
    ExportAllDeclaration: (node): void => {
      const source = node.source;

      callback({ node: source, source: source.value, type: Type.export });
    },
    ExportNamedDeclaration: (node): void => {
      const source = node.source;

      if (source)
        callback({ node: source, source: source.value, type: Type.export });
    },
    ImportDeclaration: (node): void => {
      const source = node.source;

      callback({ node: source, source: source.value, type: Type.import });
    },
    ImportExpression: (node): void => {
      const source = node.source;

      if (source.type === AST_NODE_TYPES.Literal && is.string(source.value))
        callback({ node: source, source: source.value, type: Type.import });
    }
  }),
  { Type }
);
