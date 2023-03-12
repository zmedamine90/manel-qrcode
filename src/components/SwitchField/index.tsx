import { FieldPath, FieldValues, useController } from "react-hook-form";

import SwitchInput from "../Switch";
import FieldProps from "../utils/FieldProps";

export const SwitchField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  rules,
  ...rest
}: FieldProps<TFieldValues, TName> & Pick<HTMLButtonElement, "id">) => {
  const { field } = useController({ control, name, rules });
  const { ref, ...restField } = field;

  const { id } = rest;
  return <SwitchInput ref={ref} {...restField} {...(!!id ? { id } : {})} />;
};
