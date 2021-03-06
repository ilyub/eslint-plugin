import { MessageId, preferOnlyExport } from "@/rules/prefer-only-export";
import getCurrentLine from "get-current-line";
import { utils } from "@";

utils.testRule(
  "prefer-only-export",
  preferOnlyExport,
  [
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ exportMatchingFilename: true }],
      code: `
        export const file = 1;
        export * from "source";
      `,
      errors: [{ line: 1, messageId: MessageId.invalidExport }]
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ exportMatchingFilename: true }],
      code: `
        export const file = 1;
        export * as y from "source";
      `,
      errors: [
        { line: 1, messageId: MessageId.invalidExport },
        { line: 2, messageId: MessageId.invalidExport }
      ]
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ exportMatchingFilename: true }],
      code: `
        export const file = 1;
        export default 1;
      `,
      errors: [{ line: 1, messageId: MessageId.invalidExport }]
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ exportMatchingFilename: true }],
      code: `
        export const file = 1;
        export const y = 1;
      `,
      errors: [
        { line: 1, messageId: MessageId.invalidExport },
        { line: 2, messageId: MessageId.invalidExport }
      ]
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ selector: "ClassDeclaration > Identifier.id" }],
      code: `
        export class C {}
        export const x = 1;
      `,
      errors: [
        { line: 1, messageId: MessageId.invalidExport },
        { line: 2, messageId: MessageId.invalidExport }
      ]
    }
  ],
  [
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ exportMatchingFilename: true }],
      code: "export const file = 1;"
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ exportMatchingFilename: true }],
      code: `
        export const x = 1;
        export * from "source";
      `
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ exportMatchingFilename: true }],
      code: `
        export const x = 1;
        export * as y from "source";
      `
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ exportMatchingFilename: true }],
      code: `
        export const x = 1;
        export default 1;
      `
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ exportMatchingFilename: true }],
      code: `
        export const x = 1;
        export const y = 1;
      `
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ exportMatchingFilename: true }],
      code: `
        export class file {}
        export namespace file {}
      `
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      code: `
        export class C {}
        export const x = 1;
      `
    }
  ]
);
