// eslint-disable-next-line @skylib/consistent-import, import/no-unassigned-import
import "typescript";

declare module "typescript" {
  interface TypeChecker {
    /**
     * Gets type of property of type.
     *
     * @param type - Type.
     * @param propertyName - Property name.
     * @returns Type of property of type.
     */
    readonly getTypeOfPropertyOfType: (
      type: Type,
      propertyName: string
    ) => Type | undefined;
    /**
     * Checks that type is an array type.
     *
     * @param type - Type.
     * @returns _True_ if type is an array type, _false_ otherwise.
     */
    readonly isArrayType: (type: Type) => type is TypeReference;
    /**
     * Checks that type is a tuple type.
     *
     * @param type - Type.
     * @returns _True_ if type is a tuple type, _false_ otherwise.
     */
    readonly isTupleType: (type: Type) => type is TupleTypeReference;
  }
}