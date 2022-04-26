import * as utils from "./utils";
import { is, createValidationObject, fn } from "@skylib/functions";

export const noUnnecessaryReadonly = utils.noUnnecessaryReadonliness.createRule(
  "no-unnecessary-readonly",
  fn.run(() => {
    const TypeToCheckVO = createValidationObject<TypeToCheck>({
      DeepReadonly: "DeepReadonly",
      Readonly: "Readonly"
    });

    return is.factory(is.enumeration, TypeToCheckVO);

    type TypeToCheck = "DeepReadonly" | "Readonly";
  }),
  "allDefinitelyReadonly",
  "unnecessaryReadonly",
  'Unnecessary "Readonly" or "DeepReadonly"'
);
