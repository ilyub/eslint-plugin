import { MessageId, noSelfImport } from "@/rules/no-self-import";
import getCurrentLine from "get-current-line";
import { utils } from "@";

utils.testRule("no-self-import", noSelfImport, [
  {
    name: `Test at line ${getCurrentLine().line}`,
    code: `
      import "./file";
      import "./file.ts";
      import "./source";
      import "@/file";
      import "@/file.ts";
      import "@/source";
    `,
    errors: [
      { line: 1, messageId: MessageId.noSelfImport },
      { line: 2, messageId: MessageId.noSelfImport }
    ]
  },
  {
    name: `Test at line ${getCurrentLine().line}`,
    filename: "file.extras.ts",
    code: `
      import("./file.extras");
      import("./file.extras.ts");
      import("./file");
      import("@/file.extras");
      import("@/file.extras.ts");
      import("@/file");
    `,
    errors: [
      { line: 1, messageId: MessageId.noSelfImport },
      { line: 2, messageId: MessageId.noSelfImport }
    ]
  },
  {
    name: `Test at line ${getCurrentLine().line}`,
    filename: "file.extras.ts",
    code: `
      require("./file.extras");
      require("./file.extras.ts");
      require("./file");
      require("@/file.extras");
      require("@/file.extras.ts");
      require("@/file");
    `,
    errors: [
      { line: 1, messageId: MessageId.noSelfImport },
      { line: 2, messageId: MessageId.noSelfImport }
    ]
  }
]);
