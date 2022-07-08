import * as utils from "./utils";
import {
  a,
  assert,
  createValidationObject,
  evaluate,
  is
} from "@skylib/functions";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import type { strings } from "@skylib/functions";
import type { TSESTree } from "@typescript-eslint/utils";
import type {
  RuleFix,
  RuleListener
} from "@typescript-eslint/utils/dist/ts-eslint";

export const custom = utils.createRule({
  create: (context): RuleListener => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Postponed
    const listener = getVisitors();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Postponed
    return context.defineTemplateBodyVisitor(listener, listener);

    function checkType(
      type: ts.Type,
      ...flags: readonly ts.TypeFlags[]
    ): boolean {
      if (type.isTypeParameter()) {
        const constraint = type.getConstraint();

        if (is.not.empty(constraint)) type = constraint;
        else return flags.includes(ts.TypeFlags.Unknown);
      }

      return (
        flags.includes(type.getFlags()) ||
        (type.isUnion() &&
          type.types.every(subtype => flags.includes(subtype.getFlags())))
      );
    }

    function checkTypeHas(type: ts.Type, expected?: Test): boolean {
      return expected
        ? checkTypeIs(type, expected) ||
            (type.isUnion() &&
              type.types.some(subtype => checkTypeIs(subtype, expected)))
        : true;
    }

    function checkTypeHasNoneOf(type: ts.Type, expected?: Tests): boolean {
      return expected ? expected.every(x => checkTypeHasNot(type, x)) : true;
    }

    function checkTypeHasNot(type: ts.Type, expected?: Test): boolean {
      return expected ? !checkTypeHas(type, expected) : true;
    }

    function checkTypeHasOneOf(type: ts.Type, expected?: Tests): boolean {
      return expected ? expected.some(x => checkTypeHas(type, x)) : true;
    }

    function checkTypeIs(type: ts.Type, expected?: Test): boolean {
      if (expected)
        switch (expected) {
          case "any":
            return checkType(type, ts.TypeFlags.Any);

          case "array":
            return (
              checkType(type, ts.TypeFlags.NonPrimitive, ts.TypeFlags.Object) &&
              context.checker.isArrayType(type)
            );

          case "boolean":
            return checkType(
              type,
              ts.TypeFlags.Boolean,
              ts.TypeFlags.BooleanLike,
              ts.TypeFlags.BooleanLiteral
            );

          case "complex":
            if (
              context.checker.isArrayType(type) ||
              context.checker.isTupleType(type)
            ) {
              const subtypes = type.typeArguments;

              assert.not.empty(subtypes, "Missing type arguments");

              return subtypes.some(subtype => checkTypeIs(subtype, expected));
            }

            if (type.isUnionOrIntersection())
              return type.types.some(subtype => checkTypeIs(subtype, expected));

            return type.getSymbol()?.name === "__object";

          case "function":
            return (
              checkType(type, ts.TypeFlags.NonPrimitive, ts.TypeFlags.Object) &&
              type.getCallSignatures().length > 0
            );

          case "null":
            return checkType(type, ts.TypeFlags.Null);

          case "number":
            return checkType(
              type,
              ts.TypeFlags.Number,
              ts.TypeFlags.NumberLike,
              ts.TypeFlags.NumberLiteral
            );

          case "object":
            return (
              checkType(type, ts.TypeFlags.NonPrimitive, ts.TypeFlags.Object) &&
              !checkTypeIs(type, "array") &&
              !checkTypeIs(type, "function")
            );

          case "readonly":
            return type
              .getProperties()
              .some(property =>
                tsutils.isPropertyReadonlyInType(
                  type,
                  property.getEscapedName(),
                  context.checker
                )
              );

          case "string":
            return checkType(
              type,
              ts.TypeFlags.String,
              ts.TypeFlags.StringLike,
              ts.TypeFlags.StringLiteral
            );

          case "symbol":
            return checkType(
              type,
              ts.TypeFlags.ESSymbol,
              ts.TypeFlags.ESSymbolLike,
              ts.TypeFlags.UniqueESSymbol
            );

          case "tuple":
            return (
              checkType(type, ts.TypeFlags.NonPrimitive, ts.TypeFlags.Object) &&
              context.checker.isTupleType(type)
            );

          case "undefined":
            return checkType(type, ts.TypeFlags.Undefined);

          case "unknown":
            return checkType(type, ts.TypeFlags.Unknown);
        }

      return true;
    }

    function checkTypeIsNoneOf(type: ts.Type, expected?: Tests): boolean {
      return expected ? expected.every(x => checkTypeIsNot(type, x)) : true;
    }

    function checkTypeIsNot(type: ts.Type, expected?: Test): boolean {
      return expected ? !checkTypeIs(type, expected) : true;
    }

    function checkTypeIsOneOf(type: ts.Type, expected?: Tests): boolean {
      return expected ? expected.some(x => checkTypeIs(type, x)) : true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Postponed
    function getVisitors(): any {
      const {
        checkReturnType,
        message,
        replacement,
        search,
        selector: mixed,
        typeHas,
        typeHasNoneOf,
        typeHasNot,
        typeHasOneOf,
        typeIs,
        typeIsNoneOf,
        typeIsNot,
        typeIsOneOf
      } = { checkReturnType: false, ...context.options };

      const selector = a.fromMixed(mixed).join(", ");

      return {
        [selector]: (node: TSESTree.Node): void => {
          const types = evaluate(() => {
            const tsNode = context.toTsNode(node);

            const type = context.checker.getTypeAtLocation(tsNode);

            return checkReturnType
              ? type
                  .getCallSignatures()
                  .map(signature => signature.getReturnType())
              : [type];
          });

          if (
            types.some(type => checkTypeIs(type, typeIs)) &&
            types.some(type => checkTypeHasNot(type, typeHasNot)) &&
            types.some(type => checkTypeIsNot(type, typeIsNot)) &&
            types.some(type => checkTypeHas(type, typeHas)) &&
            types.some(type => checkTypeHasNoneOf(type, typeHasNoneOf)) &&
            types.some(type => checkTypeHasOneOf(type, typeHasOneOf)) &&
            types.some(type => checkTypeIsNoneOf(type, typeIsNoneOf)) &&
            types.some(type => checkTypeIsOneOf(type, typeIsOneOf))
          )
            context.report({
              data: {
                message: message ?? `This syntax is not allowed: ${selector}`
              },
              fix: (): readonly RuleFix[] =>
                is.not.empty(replacement)
                  ? [
                      {
                        range: node.range,
                        text: is.not.empty(search)
                          ? context.getText(node).replace(
                              // eslint-disable-next-line security/detect-non-literal-regexp -- Ok
                              new RegExp(search, "u"),
                              replacement
                            )
                          : replacement
                      }
                    ]
                  : [],
              loc: context.getLocFromRange(node.range),
              messageId: "customMessage"
            });
        }
      };
    }
  },
  fixable: "code",
  isRuleOptions: evaluate(() => {
    const TestVO = createValidationObject<Test>({
      any: "any",
      array: "array",
      boolean: "boolean",
      complex: "complex",
      function: "function",
      null: "null",
      number: "number",
      object: "object",
      readonly: "readonly",
      string: "string",
      symbol: "symbol",
      tuple: "tuple",
      undefined: "undefined",
      unknown: "unknown"
    });

    const isTest = is.factory(is.enumeration, TestVO);

    const isTests = is.factory(is.array.of, isTest);

    return is.object.factory<RuleOptions>(
      { selector: is.or.factory(is.string, is.strings) },
      {
        checkReturnType: is.boolean,
        message: is.string,
        replacement: is.string,
        search: is.string,
        typeHas: isTest,
        typeHasNoneOf: isTests,
        typeHasNot: isTest,
        typeHasOneOf: isTests,
        typeIs: isTest,
        typeIsNoneOf: isTests,
        typeIsNot: isTest,
        typeIsOneOf: isTests
      }
    );
  }),
  messages: { customMessage: "{{ message }}" },
  name: "custom"
});

interface RuleOptions {
  readonly checkReturnType?: boolean;
  readonly message?: string;
  readonly replacement?: string;
  readonly search?: string;
  readonly selector: strings | string;
  readonly typeHas?: Test;
  readonly typeHasNoneOf?: Tests;
  readonly typeHasNot?: Test;
  readonly typeHasOneOf?: Tests;
  readonly typeIs?: Test;
  readonly typeIsNoneOf?: Tests;
  readonly typeIsNot?: Test;
  readonly typeIsOneOf?: Tests;
}

type Test =
  | "any"
  | "array"
  | "boolean"
  | "complex"
  | "function"
  | "null"
  | "number"
  | "object"
  | "readonly"
  | "string"
  | "symbol"
  | "tuple"
  | "undefined"
  | "unknown";

type Tests = readonly Test[];