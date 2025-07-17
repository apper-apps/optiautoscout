import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const MapView = ({ vehicles, dealerships, onVehicleSelect, onDealershipSelect }) => {
  // Mock map implementation - in a real app, you'd use Google Maps, Mapbox, etc.
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative bg-gray-100 rounded-xl overflow-hidden" style={{ height: "500px" }}>
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Map" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">Interactive Map</h3>
          <p className="text-gray-500">Vehicle and dealership locations</p>
        </div>
      </div>

      {/* Mock Markers */}
      <div className="absolute inset-0">
        {/* Vehicle Markers */}
        {vehicles.slice(0, 6).map((vehicle, index) => (
          <div
            key={vehicle.Id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${20 + (index % 3) * 30}%`,
              top: `${30 + Math.floor(index / 3) * 40}%`
            }}
            onClick={() => onVehicleSelect?.(vehicle)}
          >
            <div className="bg-white rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Car" className="w-4 h-4 text-primary-600" />
                <Badge variant="accent" className="text-xs">
                  {formatPrice(vehicle.price)}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
        ))}

        {/* Dealership Markers */}
        {dealerships.slice(0, 4).map((dealership, index) => (
          <div
            key={dealership.Id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${15 + index * 25}%`,
              top: `${60 + (index % 2) * 20}%`
            }}
            onClick={() => onDealershipSelect?.(dealership)}
          >
            <div className="bg-primary-600 text-white rounded-lg shadow-lg p-2 hover:bg-primary-700 transition-colors">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Building" className="w-4 h-4" />
                <span className="text-xs font-medium">{dealership.vehicleCount}</span>
              </div>
              <p className="text-xs mt-1 truncate max-w-20">
                {dealership.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button variant="secondary" size="sm">
          <ApperIcon name="Plus" className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="sm">
          <ApperIcon name="Minus" className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="sm">
          <ApperIcon name="Locate" className="w-4 h-4" />
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Car" className="w-3 h-3 text-primary-600" />
            <span>Vehicles</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Building" className="w-3 h-3 text-primary-600" />
            <span>Dealerships</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;