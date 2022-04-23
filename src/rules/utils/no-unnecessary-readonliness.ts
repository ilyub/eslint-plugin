import { a, is } from "@skylib/functions";
import type { strings, unknowns } from "@skylib/functions";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { RuleModule } from "@typescript-eslint/utils/dist/ts-eslint";
import { Checker } from "./Checker";
import * as utils from "./core";

/**
 * Creates rule.
 *
 * @param name - Name.
 * @param isTypeToCheck - Guard.
 * @param readonliness - Readonliness that triggers error.
 * @param messageId - Message ID.
 * @param message - Message.
 * @returns Rule module.
 */
// eslint-disable-next-line @skylib/only-export-name
export function createRule<M extends string, T extends string>(
  name: string,
  isTypeToCheck: is.Guard<T>,
  readonliness: Checker.Readonliness,
  messageId: M,
  message: string
): RuleModule<M, unknowns> {
  const isRuleOptions = is.object.factory<RuleOptions>(
    {
      ignoreClasses: is.boolean,
      ignoreInterfaces: is.boolean,
      ignoreTypes: is.strings
    },
    {}
  );

  return utils.createRule({
    create(context) {
      const { ignoreClasses, ignoreInterfaces, ignoreTypes } = context.options;

      const checker = new Checker({
        context,
        ignoreClasses,
        ignoreInterfaces,
        ignoreTypes,
        readonliness
      });

      return {
        [AST_NODE_TYPES.TSTypeReference](node): void {
          const { typeArguments, typeName } = context.toTsNode(node);

          if (
            isTypeToCheck(typeName.getText()) &&
            typeArguments &&
            typeArguments.length === 1
          ) {
            const typeArgument = a.first(typeArguments);

            const type = context.checker.getTypeFromTypeNode(typeArgument);

            const result = checker.checkType(type, node);

            if ("passed" in result) context.report({ messageId, node });
          }
        }
      };
    },
    defaultOptions: {
      ignoreClasses: false,
      ignoreInterfaces: false,
      ignoreTypes: []
    },
    isRuleOptions,
    messages: { [messageId]: message },
    name
  });

  interface RuleOptions {
    readonly ignoreClasses: boolean;
    readonly ignoreInterfaces: boolean;
    readonly ignoreTypes: strings;
  }
}
