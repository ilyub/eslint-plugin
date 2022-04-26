import * as utils from "./utils";
import { is } from "@skylib/functions";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";

export const classMemberTypedef = utils.createRule({
  create(context) {
    return {
      [AST_NODE_TYPES.PropertyDefinition](node): void {
        if (node.typeAnnotation || node.value) {
          // Valid
        } else context.report({ messageId: "typedefRequired", node });
      }
    };
  },
  isRuleOptions: is.object,
  messages: { typedefRequired: "Type definition required" },
  name: "class-member-typedef"
});
