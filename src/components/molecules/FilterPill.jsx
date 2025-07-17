import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterPill = ({ label, onRemove, className }) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium",
      className
    )}>
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
      >
        <ApperIcon name="X" className="w-3 h-3" />
      </button>
    </div>
  );
};

export default FilterPill;