import React, { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import PriceRange from "@/components/molecules/PriceRange";
import ApperIcon from "@/components/ApperIcon";
import vehicleService from "@/services/api/vehicleService";
import { motion } from "framer-motion";

const SearchFilters = ({ filters, onFiltersChange, onSaveSearch }) => {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    price: true,
    details: false
  });

  const makes = vehicleService.getMakes();
  const yearRange = vehicleService.getYearRange();
  const vehiclePriceRange = vehicleService.getPriceRange();

  useEffect(() => {
    setPriceRange([vehiclePriceRange.min, vehiclePriceRange.max]);
  }, []);

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleMultiSelectChange = (key, value, checked) => {
    const currentValues = filters[key] || [];
    if (checked) {
      handleFilterChange(key, [...currentValues, value]);
    } else {
      handleFilterChange(key, currentValues.filter(v => v !== value));
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    onFiltersChange({});
    setPriceRange([vehiclePriceRange.min, vehiclePriceRange.max]);
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <ApperIcon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          className="w-5 h-5 text-gray-500" 
        />
      </button>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3 space-y-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  );

  const CheckboxGroup = ({ title, options, filterKey }) => (
    <div>
      <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
      <div className="space-y-2">
        {options.map(option => (
          <label key={option} className="flex items-center">
            <input
              type="checkbox"
              checked={(filters[filterKey] || []).includes(option)}
              onChange={(e) => handleMultiSelectChange(filterKey, option, e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-6">
        <FilterSection 
          title="Basic Search" 
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection('basic')}
        >
          <FormField
            label="Make"
            type="select"
            value={filters.make?.[0] || ""}
            onChange={(e) => handleFilterChange('make', e.target.value ? [e.target.value] : [])}
          >
            <option value="">All Makes</option>
            {makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </FormField>

          <FormField
            label="Model"
            placeholder="Enter model name"
            value={filters.model || ""}
            onChange={(e) => handleFilterChange('model', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Min Year"
              type="number"
              min={yearRange.min}
              max={yearRange.max}
              value={filters.minYear || ""}
              onChange={(e) => handleFilterChange('minYear', e.target.value ? parseInt(e.target.value) : undefined)}
            />
            <FormField
              label="Max Year"
              type="number"
              min={yearRange.min}
              max={yearRange.max}
              value={filters.maxYear || ""}
              onChange={(e) => handleFilterChange('maxYear', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </FilterSection>

        <FilterSection 
          title="Price Range" 
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <PriceRange
            min={vehiclePriceRange.min}
            max={vehiclePriceRange.max}
            value={[filters.minPrice || priceRange[0], filters.maxPrice || priceRange[1]]}
            onChange={([min, max]) => {
              handleFilterChange('minPrice', min);
              handleFilterChange('maxPrice', max);
            }}
          />

          <FormField
            label="Max Mileage"
            type="number"
            placeholder="Enter max mileage"
            value={filters.maxMileage || ""}
            onChange={(e) => handleFilterChange('maxMileage', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </FilterSection>

        <FilterSection 
          title="Vehicle Details" 
          isExpanded={expandedSections.details}
          onToggle={() => toggleSection('details')}
        >
          <CheckboxGroup
            title="Body Type"
            options={["Sedan", "SUV", "Truck", "Coupe", "Convertible", "Wagon"]}
            filterKey="bodyType"
          />

          <CheckboxGroup
            title="Fuel Type"
            options={["Gasoline", "Electric", "Hybrid", "Diesel"]}
            filterKey="fuelType"
          />

          <CheckboxGroup
            title="Transmission"
            options={["Automatic", "Manual", "CVT"]}
            filterKey="transmission"
          />
        </FilterSection>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <Button 
          variant="accent" 
          className="w-full"
          onClick={() => onSaveSearch(filters)}
        >
          <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          Save Search
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;