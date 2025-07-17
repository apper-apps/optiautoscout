import React from "react";

const PriceRange = ({ min, max, value, onChange, step = 1000 }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>${min.toLocaleString()}</span>
        <span>${max.toLocaleString()}</span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="flex justify-between text-sm font-medium">
        <span>${value[0].toLocaleString()}</span>
        <span>${value[1].toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PriceRange;