import React from "react";
import { cn } from "@/utils/cn";

const Label = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-gray-700 mb-2",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";

export default Label;