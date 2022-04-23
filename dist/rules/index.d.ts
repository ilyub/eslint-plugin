export * as utils from "./utils";
export declare const rules: {
    "array-callback-return-type": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"expectingBooleanReturnType", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "class-member-typedef": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"typedefRequired", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "class-name": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"invalidClassName", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "class-only-export": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"exportNotAllowed", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "consistent-empty-lines": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"expectingEmptyLine" | "unexpectedEmptyLine", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "consistent-group-empty-lines": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"expectingEmptyLine" | "unexpectedEmptyLine", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "consistent-import": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"autoImport" | "invalidLocalName" | "missingImport" | "wildcardImportDisallowed" | "wildcardImportRequired", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "disallow-by-regexp": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"disallowedCode", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "disallow-identifier": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"disallowedIdentifier", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "disallow-import": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"disallowedSource", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "empty-lines-around-comment": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"missingEmptyLineAfter" | "missingEmptyLineBefore" | "unexpectedEmptyLineAfter", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "exhaustive-switch": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"inexhaustiveSwitch", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "export-all-name": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"invalidName", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "function-properties-style": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noDistributedDefinition", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "no-expression-empty-line": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"unexpectedEmptyLine", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "no-inferrable-types": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"triviallyInferrableType", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "no-multi-type-tuples": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"multiTypeTuplesDisallowed", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "no-mutable-signature": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noMutableNumberSignature" | "noMutableStringSignature", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "no-negated-condition": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noNegatedCondition", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "no-unnecessary-readonly": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"unnecessaryReadonly", import("@skylib/functions").unknowns, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "no-unnecessary-writable": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"unnecessaryWritable", import("@skylib/functions").unknowns, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "no-unsafe-object-assignment": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"unsafeOptionalAssignment" | "unsafeReadonlyAssignment", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "no-unused-import": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"unusedImport", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "object-format": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"expectingMultiline" | "expectingSingleLine", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "only-export-name": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"invalidName", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "prefer-readonly": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"shouldBeReadonly", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "prefer-readonly-props": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"expectingReadonlyProperty", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "prefer-ts-toolbelt": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"preferExtends", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "primary-export-only": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"invalidExport", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "require-jsdoc": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"undocumented" | "undocumentedCallSignature" | "undocumentedConstructSignature", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "sort-class-members": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"incorrectSortingOrder", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "sort-keys": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"incorrectSortingOrder", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "statements-order": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"incorrectStatementsOrder", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "switch-case-empty-lines": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"expectingEmptyLine" | "unexpectedEmptyLine", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "template-literal-format": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"invalidTemplateLiteralFormat", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    "vue-component-name": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"invalidName", import("@skylib/functions").objects, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
};
//# sourceMappingURL=index.d.ts.map