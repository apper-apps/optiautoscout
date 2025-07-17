import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const VehicleCard = ({ vehicle, onSave, onCompare, isSaved = false, isCompared = false }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

return (
    <Link to={`/vehicle/${vehicle.Id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card overflow-hidden group cursor-pointer"
      >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Action Buttons */}
<div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSave(vehicle.Id);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isSaved 
                ? "bg-accent-500 text-white" 
                : "bg-white/80 text-gray-700 hover:bg-white"
            }`}
          >
            <ApperIcon name="Heart" className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
          </button>
<button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompare(vehicle.Id);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isCompared 
                ? "bg-primary-500 text-white" 
                : "bg-white/80 text-gray-700 hover:bg-white"
            }`}
          >
            <ApperIcon name="Scale" className="w-4 h-4" />
          </button>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="accent" className="text-lg font-bold px-3 py-1">
            {formatPrice(vehicle.price)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-gray-600">{vehicle.color} • {vehicle.bodyType}</p>
        </div>

        {/* Key Details */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <ApperIcon name="Gauge" className="w-4 h-4" />
            <span>{formatMileage(vehicle.mileage)} mi</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Settings" className="w-4 h-4" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Fuel" className="w-4 h-4" />
            <span>{vehicle.fuelType}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-4">
          {vehicle.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="default" className="text-xs">
              {feature}
            </Badge>
          ))}
          {vehicle.features.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{vehicle.features.length - 3} more
            </Badge>
          )}
        </div>

<div className="flex gap-2">
          <Button 
            className="w-full" 
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="px-3"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(vehicle.listingUrl, '_blank');
            }}
          >
            <ApperIcon name="ExternalLink" className="w-4 h-4" />
          </Button>
        </div>
      </div>
</motion.div>
    </Link>
  );
};

export default VehicleCard;