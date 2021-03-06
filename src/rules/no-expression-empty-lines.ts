import * as utils from "./utils";
import type {
  RuleFix,
  RuleListener
} from "@typescript-eslint/utils/dist/ts-eslint";
import { s } from "@skylib/functions";

export enum MessageId {
  unexpectedEmptyLine = "unexpectedEmptyLine"
}

export const noExpressionEmptyLines = utils.createRule({
  name: "no-expression-empty-lines",
  fixable: utils.Fixable.whitespace,
  vue: true,
  messages: { [MessageId.unexpectedEmptyLine]: "Unexpected empty line before" },
  create: (context): RuleListener => ({
    MemberExpression: (node): void => {
      const pos = node.object.range[1];

      const got = s.leadingSpaces(context.code.slice(pos));

      const expected = context.eol + s.trimLeadingEmptyLines(got);

      if (got === expected) {
        // Valid
      } else
        context.report({
          fix: (): RuleFix => ({
            range: [pos, pos + got.length],
            text: expected
          }),
          messageId: MessageId.unexpectedEmptyLine,
          node: node.property
        });
    }
  })
});
