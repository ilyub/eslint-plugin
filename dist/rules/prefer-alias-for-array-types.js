"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preferAliasForArrayTypes = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("./utils"));
const functions_1 = require("@skylib/functions");
const utils_1 = require("@typescript-eslint/utils");
const ts = tslib_1.__importStar(require("typescript"));
exports.preferAliasForArrayTypes = utils.createRule({
    create: context => {
        return {
            [utils_1.AST_NODE_TYPES.TSTypeAnnotation]: (node) => {
                if (node.typeAnnotation.type === utils_1.AST_NODE_TYPES.TSTypeReference) {
                    // Valid
                }
                else {
                    const tsNode = context.toTsNode(node.typeAnnotation);
                    const type = context.checker.getTypeAtLocation(tsNode);
                    if (context.checker.isArrayType(type)) {
                        const args = functions_1.as.not.empty(type.typeArguments);
                        if (args.every(subtype => subtype.isTypeParameter()) ||
                            args.every(subtype => subtype.flags === ts.TypeFlags.Any)) {
                            // Valid
                        }
                        else
                            context.report({ messageId: "preferAlias", node });
                    }
                }
            }
        };
    },
    isRuleOptions: functions_1.is.object,
    messages: { preferAlias: "Define alias for array type" },
    name: "prefer-alias-for-array-types"
});
//# sourceMappingURL=prefer-alias-for-array-types.js.map