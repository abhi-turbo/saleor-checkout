import React from "react";
import { Radio, RadioOption, RadioProps } from "./Radio";

interface RadioGroupProps
  extends Pick<RadioProps, "onSelect" | "selectedValue" | "alignment"> {
  options: RadioOption[];
  label: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  label,
  ...rest
}) => {
  return (
    <div className="radio-group">
      {options.map(({ id, ...optionProps }) => (
        <Radio key={id} {...optionProps} {...rest} id={id} />
      ))}
    </div>
  );
};
