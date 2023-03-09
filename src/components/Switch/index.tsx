import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

function SwitchInputInner<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(
  { onChange, ...rest }: ControllerRenderProps<TFieldValues, TName>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      checked={enabled}
      onChange={(e) => {
        setEnabled(e);
        !!onChange && e !== undefined && onChange(e);
      }}
      className={`${
        enabled ? "bg-blue-600" : "bg-gray-200"
      } relative inline-flex h-6 w-11 items-center rounded-full`}
      {...rest}
      ref={ref}
    >
      <span className="sr-only">Public</span>
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
}

const SwitchInput = React.forwardRef(SwitchInputInner);
export default SwitchInput;
