import { MessageId, wrap } from "@/rules/wrap";
import getCurrentLine from "get-current-line";
import { utils } from "@";

utils.testRule("wrap", wrap, [
  {
    name: `Test at line ${getCurrentLine().line}`,
    options: [
      { plugin: "@typescript-eslint/eslint-plugin", rule: "no-shadow" }
    ],
    code: `
      const value = 1;
      enum E { value = "value" }
      enum F { value = "value" }
    `,
    errors: [
      {
        line: 2,
        messageId: MessageId.customMessage,
        data: {
          message:
            "'value' is already declared in the upper scope on line 1 column 7."
        }
      },
      {
        line: 3,
        messageId: MessageId.customMessage,
        data: {
          message:
            "'value' is already declared in the upper scope on line 1 column 7."
        }
      }
    ]
  },
  {
    name: `Test at line ${getCurrentLine().line}`,
    options: [
      {
        lintSelector: "TSEnumDeclaration[id.name=E] *",
        plugin: "@typescript-eslint/eslint-plugin",
        rule: "no-shadow"
      }
    ],
    code: `
      const value = 1;
      enum E { value = "value" }
      enum F { value = "value" }
    `,
    errors: [
      {
        line: 2,
        messageId: MessageId.customMessage,
        data: {
          message:
            "'value' is already declared in the upper scope on line 1 column 7."
        }
      }
    ]
  },
  {
    name: `Test at line ${getCurrentLine().line}`,
    options: [
      {
        plugin: "@typescript-eslint/eslint-plugin",
        rule: "no-shadow",
        skipSelector: "TSEnumDeclaration[id.name=F] *"
      }
    ],
    code: `
      const value = 1;
      enum E { value = "value" }
      enum F { value = "value" }
    `,
    errors: [
      {
        line: 2,
        messageId: MessageId.customMessage,
        data: {
          message:
            "'value' is already declared in the upper scope on line 1 column 7."
        }
      }
    ]
  }
]);
