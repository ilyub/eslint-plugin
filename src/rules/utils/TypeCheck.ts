/* eslint-disable @skylib/require-jsdoc -- Postponed */

import * as ts from "typescript";
import * as tsutils from "tsutils";
import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import type { NumStrU, Writable, unknowns } from "@skylib/functions";
import type { ParserServices, TSESTree } from "@typescript-eslint/utils";
import type { Ranges, TypeGroups } from "./types";
import { ReadonlySet, as, assert, is, typedef } from "@skylib/functions";
import type { RuleContext } from "@typescript-eslint/utils/dist/ts-eslint";
import { TypeGroup } from "./types";

export class TypeCheck {
  /**
   * Checks if type is boolean.
   *
   * @param type - Type.
   * @returns _True_ if type is boolean, _false_ otherwise.
   */
  public readonly isBoolish = (type: ts.Type): boolean => {
    if (safeTypes.has(type.getFlags())) return true;

    if (tsutils.isUnionType(type)) {
      const parts = tsutils.unionTypeParts(type);

      if (parts.length === 2) {
        if (
          parts.some(part => tsutils.isBooleanLiteralType(part, true)) &&
          parts.some(part => tsutils.isBooleanLiteralType(part, false))
        )
          return true;

        if (
          parts.some(part => tsutils.isBooleanLiteralType(part, true)) &&
          parts.some(part => part.getFlags() === ts.TypeFlags.Undefined)
        )
          return true;

        if (
          parts.some(part => tsutils.isObjectType(part)) &&
          parts.some(part => part.getFlags() === ts.TypeFlags.Undefined)
        )
          return true;

        if (
          parts.some(part => safeTypesWithUndefined.has(part.getFlags())) &&
          parts.some(part => part.getFlags() === ts.TypeFlags.Undefined)
        )
          return true;
      }
    }

    return false;
  };

  public readonly isObjectType = (type: ts.Type): type is ts.ObjectType =>
    tsutils.isObjectType(type);

  /**
   * Creates class instance.
   *
   * @param context - Context.
   */
  public constructor(context: RuleContext<never, unknowns>) {
    const parser = ESLintUtils.getParserServices(context);

    assert.toBeTrue(
      tsutils.isStrictCompilerOptionEnabled(
        parser.program.getCompilerOptions(),
        "strictNullChecks"
      ),
      'Expecting "strictNullChecks" compiler option to be enabled'
    );

    this.checker = parser.program.getTypeChecker();

    this.code = context.getSourceCode().getText();

    this.toTsNode = parser.esTreeNodeToTSNodeMap.get.bind(
      parser.esTreeNodeToTSNodeMap
    );
  }

  /**
   * Checks if node is an array.
   *
   * @param node - Node.
   * @returns _True_ if node is an array, _false_ otherwise.
   */
  public getCallSignatures(node: TSESTree.Node): TypeCheck.Signatures {
    const type = this.getType(node);

    return this.checker.getSignaturesOfType(type, ts.SignatureKind.Call);
  }

  public getComments(node: TSESTree.Node): Ranges {
    const result: Writable<Ranges> = [];

    const tsNode = this.toTsNode(node);

    const offset = node.range[0] - tsNode.pos - tsNode.getLeadingTriviaWidth();

    tsutils.forEachComment(tsNode, (_fullText, comment) => {
      const pos = comment.pos + offset;

      const end = comment.end + offset;

      result.push([pos, pos + this.code.slice(pos, end).trimEnd().length]);
    });

    return result;
  }

  public getConstructorType(node: TSESTree.Node): ts.Type | undefined {
    const tsNode = this.toTsNode(node);

    return tsutils.isConstructorDeclaration(tsNode)
      ? tsutils.getConstructorTypeOfClassLikeDeclaration(
          tsNode.parent,
          this.checker
        )
      : undefined;
  }

  public getContextualType(node: TSESTree.Node): ts.Type | undefined {
    const tsNode = this.toTsNode(node);

    return tsutils.isExpression(tsNode)
      ? this.checker.getContextualType(tsNode)
      : undefined;
  }

  public getFullRange(node: TSESTree.Node): TSESTree.Range {
    return [node.range[0] - this.getLeadingTrivia(node).length, node.range[1]];
  }

  public getFullText(node: TSESTree.Node): string {
    return this.code.slice(
      node.range[0] - this.getLeadingTrivia(node).length,
      node.range[1]
    );
  }

  public getIndexInfo(
    type: ts.Type,
    kind: ts.IndexKind
  ): ts.IndexInfo | undefined {
    return this.checker.getIndexInfoOfType(type, kind);
  }

  public getLeadingTrivia(node: TSESTree.Node): string {
    // May be undefined inside Vue <template>
    const tsNode = typedef<ts.Node | undefined>(this.toTsNode(node));

    return tsNode
      ? this.code.slice(
          node.range[0] - tsNode.getLeadingTriviaWidth(),
          node.range[0]
        )
      : this.code.slice(node.range[0], node.range[0]);
  }

  public getReturnType(signature: ts.Signature): ts.Type {
    return this.checker.getReturnTypeOfSignature(signature);
  }

  public getSymbol(node: TSESTree.Node): ts.Symbol | undefined {
    const tsNode = this.toTsNode(node);

    return this.checker.getSymbolAtLocation(tsNode);
  }

  public getType(node: TSESTree.Node): ts.Type {
    const tsNode = this.toTsNode(node);

    return this.checker.getTypeAtLocation(tsNode);
  }

  /**
   * Checks if signature or symbol is missing doc comment.
   *
   * @param mixed - Signature or symbol.
   * @returns _True_ if signature or symbol is missing doc comment, _false_ otherwise.
   */
  public hasDocComment(mixed: ts.Signature | ts.Symbol): boolean {
    return mixed.getDocumentationComment(this.checker).length > 0;
  }

  public hasLeadingDocComment(node: TSESTree.Node): boolean {
    return this.getLeadingTrivia(node).trimStart().startsWith("/**");
  }

  /**
   * Checks if node is an array.
   *
   * @param node - Node.
   * @returns _True_ if node is an array, _false_ otherwise.
   */
  public isArray(node: TSESTree.Node): boolean {
    const type = this.getType(node);

    return this.checker.isArrayType(type);
  }

  public isReadonlyProperty(property: ts.Symbol, type: ts.Type): boolean {
    return tsutils.isPropertyReadonlyInType(
      type,
      property.getEscapedName(),
      this.checker
    );
  }

  public typeHas(type: ts.Type, expected?: TypeGroup): boolean {
    return expected
      ? this.typeIs(type, expected) ||
          (type.isUnion() &&
            type.types.some(subtype => this.typeIs(subtype, expected)))
      : true;
  }

  public typeHasNoneOf(type: ts.Type, expected?: TypeGroups): boolean {
    return expected ? expected.every(x => !this.typeHas(type, x)) : true;
  }

  public typeHasOneOf(type: ts.Type, expected?: TypeGroups): boolean {
    return expected ? expected.some(x => this.typeHas(type, x)) : true;
  }

  public typeIs(type: ts.Type, expected?: TypeGroup): boolean {
    if (expected)
      switch (expected) {
        case "any":
          return this.zzz(type, ts.TypeFlags.Any);

        case "array":
          return (
            this.zzz(type, ts.TypeFlags.NonPrimitive, ts.TypeFlags.Object) &&
            this.checker.isArrayType(type)
          );

        case "boolean":
          return this.zzz(
            type,
            ts.TypeFlags.Boolean,
            ts.TypeFlags.BooleanLike,
            ts.TypeFlags.BooleanLiteral
          );

        case "complex":
          if (
            this.checker.isArrayType(type) ||
            this.checker.isTupleType(type)
          ) {
            const subtypes = type.typeArguments;

            assert.not.empty(subtypes, "Missing type arguments");

            return subtypes.some(subtype => this.typeIs(subtype, expected));
          }

          if (type.isUnionOrIntersection())
            return type.types.some(subtype => this.typeIs(subtype, expected));

          return type.getSymbol()?.name === "__object";

        case "function":
          return (
            this.zzz(type, ts.TypeFlags.NonPrimitive, ts.TypeFlags.Object) &&
            type.getCallSignatures().length > 0
          );

        case "null":
          return this.zzz(type, ts.TypeFlags.Null);

        case "number":
          return this.zzz(
            type,
            ts.TypeFlags.Number,
            ts.TypeFlags.NumberLike,
            ts.TypeFlags.NumberLiteral
          );

        case "object":
          return (
            this.zzz(type, ts.TypeFlags.NonPrimitive, ts.TypeFlags.Object) &&
            !this.typeIs(type, TypeGroup.array) &&
            !this.typeIs(type, TypeGroup.function)
          );

        case "readonly":
          return type
            .getProperties()
            .some(property =>
              tsutils.isPropertyReadonlyInType(
                type,
                property.getEscapedName(),
                this.checker
              )
            );

        case "string":
          return this.zzz(
            type,
            ts.TypeFlags.String,
            ts.TypeFlags.StringLike,
            ts.TypeFlags.StringLiteral
          );

        case "symbol":
          return this.zzz(
            type,
            ts.TypeFlags.ESSymbol,
            ts.TypeFlags.ESSymbolLike,
            ts.TypeFlags.UniqueESSymbol
          );

        case "tuple":
          return (
            this.zzz(type, ts.TypeFlags.NonPrimitive, ts.TypeFlags.Object) &&
            this.checker.isTupleType(type)
          );

        case "undefined":
          return this.zzz(type, ts.TypeFlags.Undefined);

        case "unknown":
          return this.zzz(type, ts.TypeFlags.Unknown);
      }

    return true;
  }

  public typeIsNoneOf(type: ts.Type, expected?: TypeGroups): boolean {
    return expected ? expected.every(x => !this.typeIs(type, x)) : true;
  }

  public typeIsOneOf(type: ts.Type, expected?: TypeGroups): boolean {
    return expected ? expected.some(x => this.typeIs(type, x)) : true;
  }

  /**
   * Gets type parts.
   *
   * @param node - Node.
   * @returns Type parts.
   */
  public unionTypeParts(node: TSESTree.Node): TypeCheck.TypeParts {
    return node.type === AST_NODE_TYPES.UnaryExpression &&
      node.operator === "typeof"
      ? recurs(this.checker.getTypeAtLocation(this.toTsNode(node.argument)))
      : this.unionTypeParts2(node);

    function recurs(type: ts.Type): TypeCheck.TypeParts {
      if (type.getCallSignatures().length) return ["function"];

      if (type.getConstructSignatures().length) return ["function"];

      if (type.isUnion())
        return tsutils.unionTypeParts(type).flatMap(part => recurs(part));

      switch (as.byGuard(type.flags, isExpectedFlags)) {
        case ts.TypeFlags.BigInt:
        case ts.TypeFlags.BigIntLiteral:
          return ["bigint"];

        case ts.TypeFlags.BooleanLiteral:
          return ["boolean"];

        case ts.TypeFlags.Number:
        case ts.TypeFlags.NumberLiteral:
          return ["number"];

        case ts.TypeFlags.Null:
        case ts.TypeFlags.Object:
          return ["object"];

        case ts.TypeFlags.String:
        case ts.TypeFlags.StringLiteral:
          return ["string"];

        case ts.TypeFlags.ESSymbol:
        case ts.TypeFlags.UniqueESSymbol:
          return ["symbol"];

        case ts.TypeFlags.Undefined:
        case ts.TypeFlags.Void:
          return ["undefined"];
      }
    }
  }

  protected readonly checker: ts.TypeChecker;

  protected readonly code: string;

  protected readonly toTsNode: ParserServices["esTreeNodeToTSNodeMap"]["get"];

  protected readonly zzz = (
    type: ts.Type,
    ...flags: readonly ts.TypeFlags[]
  ): boolean => {
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
  };

  /**
   * Gets type parts.
   *
   * @param node - Node.
   * @returns Type parts.
   */
  protected unionTypeParts2(node: TSESTree.Node): TypeCheck.TypeParts {
    return recurs(this.checker.getTypeAtLocation(this.toTsNode(node)));

    function recurs(type: ts.Type): TypeCheck.TypeParts {
      if (type.isNumberLiteral()) return [type.value];

      if (type.isStringLiteral()) return [type.value];

      if (type.isUnion())
        return tsutils.unionTypeParts(type).flatMap(part => recurs(part));

      return [type];
    }
  }
}

export namespace TypeCheck {
  export type Signatures = readonly ts.Signature[];

  export type TypePart = NumStrU | ts.Type;

  export type TypeParts = readonly TypePart[];
}

const safeTypes = new ReadonlySet([
  ts.TypeFlags.BigInt,
  ts.TypeFlags.BigIntLiteral,
  ts.TypeFlags.Boolean,
  ts.TypeFlags.BooleanLiteral,
  ts.TypeFlags.Number,
  ts.TypeFlags.NumberLiteral,
  ts.TypeFlags.String,
  ts.TypeFlags.StringLiteral
]);

const safeTypesWithUndefined = new ReadonlySet([
  ts.TypeFlags.ESSymbol,
  ts.TypeFlags.Object,
  ts.TypeFlags.NonPrimitive,
  ts.TypeFlags.UniqueESSymbol
]);

const isExpectedFlags: is.Guard<ExpectedFlags> = is.factory(is.enumeration, {
  [ts.TypeFlags.BigInt]: ts.TypeFlags.BigInt,
  [ts.TypeFlags.BigIntLiteral]: ts.TypeFlags.BigIntLiteral,
  [ts.TypeFlags.BooleanLiteral]: ts.TypeFlags.BooleanLiteral,
  [ts.TypeFlags.ESSymbol]: ts.TypeFlags.ESSymbol,
  [ts.TypeFlags.Null]: ts.TypeFlags.Null,
  [ts.TypeFlags.Number]: ts.TypeFlags.Number,
  [ts.TypeFlags.NumberLiteral]: ts.TypeFlags.NumberLiteral,
  [ts.TypeFlags.Object]: ts.TypeFlags.Object,
  [ts.TypeFlags.String]: ts.TypeFlags.String,
  [ts.TypeFlags.StringLiteral]: ts.TypeFlags.StringLiteral,
  [ts.TypeFlags.Undefined]: ts.TypeFlags.Undefined,
  [ts.TypeFlags.UniqueESSymbol]: ts.TypeFlags.UniqueESSymbol,
  [ts.TypeFlags.Void]: ts.TypeFlags.Void
} as const);

type ExpectedFlags =
  | ts.TypeFlags.BigInt
  | ts.TypeFlags.BigIntLiteral
  | ts.TypeFlags.BooleanLiteral
  | ts.TypeFlags.ESSymbol
  | ts.TypeFlags.Null
  | ts.TypeFlags.Number
  | ts.TypeFlags.NumberLiteral
  | ts.TypeFlags.Object
  | ts.TypeFlags.String
  | ts.TypeFlags.StringLiteral
  | ts.TypeFlags.Undefined
  | ts.TypeFlags.UniqueESSymbol
  | ts.TypeFlags.Void;
