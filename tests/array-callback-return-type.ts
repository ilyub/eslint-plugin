import { rules, utils } from "@";
import getCurrentLine from "get-current-line";

utils.testRule(
  "array-callback-return-type",
  rules,
  [
    {
      code: `
        [1, true].every(x => x);
        [1, true].some(x => x);
      `,
      errors: [
        { line: 1, messageId: "expectingBooleanReturnType" },
        { line: 2, messageId: "expectingBooleanReturnType" }
      ],
      name: `Test at line ${getCurrentLine().line}`
    }
  ],
  [
    {
      code: `
        [1].every(x => x);
        [""].every(x => x);
        [false].every(x => x);
        [1].every((x): {} | undefined => x);
        [1].every((x): object | undefined => x);
        [1].every((x): symbol | undefined => x);
        [1].every((x): true | undefined => x);
      `,
      name: `Test at line ${getCurrentLine().line}`
    }
  ]
);
