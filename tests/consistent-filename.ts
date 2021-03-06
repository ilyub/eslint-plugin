import { MessageId, consistentFilename } from "@/rules/consistent-filename";
import getCurrentLine from "get-current-line";
import { utils } from "@";

utils.testRule(
  "consistent-filename",
  consistentFilename,
  [
    {
      name: `Test at line ${getCurrentLine().line}`,
      filename: "camelCase.ts",
      options: [{ format: utils.casing.Format.pascalCase }],
      code: "export const x = 1;",
      errors: [
        {
          line: 1,
          messageId: MessageId.invalidFilename,
          data: { expected: "CamelCase.ts" }
        }
      ]
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      filename: "camelCase.camelCase.ts",
      options: [
        {
          overrides: [
            {
              _id: "kebab-case",
              format: utils.casing.Format.kebabCase,
              selector: "Identifier[name=x]"
            }
          ]
        }
      ],
      code: "export const x = 1;",
      errors: [
        {
          line: 1,
          messageId: MessageId.invalidFilenameId,
          data: { _id: "kebab-case", expected: "camel-case.camel-case.ts" }
        }
      ]
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      filename: "kebab-case.ts",
      options: [{ format: utils.casing.Format.pascalCase }],
      code: "export const x = 1;",
      errors: [
        {
          line: 1,
          messageId: MessageId.invalidFilename,
          data: { expected: "KebabCase.ts" }
        }
      ]
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      filename: "kebab-case.kebab-case.ts",
      options: [
        {
          overrides: [
            {
              _id: "camelCase",
              format: utils.casing.Format.camelCase,
              selector: "Identifier[name=x]"
            }
          ]
        }
      ],
      code: "export const x = 1;",
      errors: [
        {
          line: 1,
          messageId: MessageId.invalidFilenameId,
          data: { _id: "camelCase", expected: "kebabCase.kebab-case.ts" }
        }
      ]
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      filename: "PascalCase.ts",
      options: [{ format: utils.casing.Format.camelCase }],
      code: "export const x = 1;",
      errors: [
        {
          line: 1,
          messageId: MessageId.invalidFilename,
          data: { expected: "pascalCase.ts" }
        }
      ]
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      filename: "PascalCase.PascalCase.ts",
      options: [
        {
          overrides: [
            {
              _id: "kebab-case",
              format: utils.casing.Format.kebabCase,
              selector: "Identifier[name=x]"
            }
          ]
        }
      ],
      code: "export const x = 1;",
      errors: [
        {
          line: 1,
          messageId: MessageId.invalidFilenameId,
          data: { _id: "kebab-case", expected: "pascal-case.pascal-case.ts" }
        }
      ]
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [
        { overrides: [{ _id: "match", match: true, selector: "Identifier" }] }
      ],
      code: "export const identifierName = 1;",
      errors: [
        {
          line: 1,
          messageId: MessageId.invalidFilenameId,
          data: { _id: "match", expected: "identifier-name.ts" }
        }
      ]
    }
  ],
  [
    {
      name: `Test at line ${getCurrentLine().line}`,
      filename: "kebab-case.ts",
      code: "export const x = 1;"
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      filename: "kebab-case.kebab-case.ts",
      code: "export const x = 1;"
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      filename: "kebab-case.ts",
      options: [
        {
          overrides: [
            {
              _id: "class",
              match: true,
              selector: "ClassDeclaration > Identifier.id"
            }
          ]
        }
      ],
      code: "export default class KebabCase {}"
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      filename: "PascalCase.ts",
      options: [
        {
          overrides: [
            {
              _id: "class",
              format: utils.casing.Format.pascalCase,
              match: true,
              selector: "ClassDeclaration > Identifier.id"
            }
          ]
        }
      ],
      code: "export default class PascalCase {}"
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      filename: "PascalCase.ts",
      options: [
        {
          overrides: [
            {
              _id: "defineComponent",
              format: utils.casing.Format.pascalCase,
              selector: "Identifier[name=defineComponent]"
            }
          ]
        }
      ],
      code: "export default defineComponent({});"
    }
  ]
);
