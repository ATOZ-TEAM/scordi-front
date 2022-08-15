import {
  Children,
  cloneElement,
  forwardRef,
  InputHTMLAttributes,
  isValidElement,
} from "react";
import { Radio } from "./Radio";

export interface RadioGroupProps
  extends InputHTMLAttributes<HTMLInputElement> {}

/**
 * @example
 * <RadioGroup onChange={(e) => console.log(e.target.value)}>
 *   <Radio label="Radio 1" value="1" />
 *   <Radio label="Radio 2" value="2" />
 *   <Radio label="Radio 3" value="3" />
 * </RadioGroup>
 */
export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ children, ...props }, ref) => {
    return (
      <>
        {Children.map(children, (child) =>
          isValidElement(child) && child.type === Radio
            ? cloneElement(child, { name, ...props })
            : child
        )}
      </>
    );
  }
);
