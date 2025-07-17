import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import useLocalStorage from "@/hooks/useLocalStorage";
import vehicleService from "@/services/api/vehicleService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ComparisonsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comparedVehicles, setComparedVehicles] = useLocalStorage("comparedVehicles", []);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        // Get vehicle IDs from URL params or localStorage
        const urlVehicleIds = searchParams.get("vehicles")?.split(",") || [];
        const vehicleIds = urlVehicleIds.length > 0 ? urlVehicleIds : comparedVehicles;

        if (vehicleIds.length === 0) {
          setVehicles([]);
          setLoading(false);
          return;
        }

        const vehicleData = await vehicleService.getByIds(vehicleIds);
        setVehicles(vehicleData);
      } catch (err) {
        setError(err.message || "Failed to load vehicles for comparison");
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, [searchParams, comparedVehicles]);

  const handleRemoveVehicle = (vehicleId) => {
    setComparedVehicles(prev => prev.filter(id => id !== vehicleId));
    setVehicles(prev => prev.filter(v => v.Id !== vehicleId));
    toast.info("Vehicle removed from comparison");
  };

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

  const getComparisonRows = () => {
    if (vehicles.length === 0) return [];

    return [
      { 
        label: "Price", 
        values: vehicles.map(v => v.price),
        formatter: formatPrice,
        highlight: "price"
      },
      { 
        label: "Year", 
        values: vehicles.map(v => v.year),
        highlight: "year"
      },
      { 
        label: "Mileage", 
        values: vehicles.map(v => v.mileage),
        formatter: formatMileage,
        highlight: "mileage",
        reverse: true // Lower is better for mileage
      },
      { 
        label: "Make", 
        values: vehicles.map(v => v.make)
      },
      { 
        label: "Model", 
        values: vehicles.map(v => v.model)
      },
      { 
        label: "Body Type", 
        values: vehicles.map(v => v.bodyType)
      },
      { 
        label: "Transmission", 
        values: vehicles.map(v => v.transmission)
      },
      { 
        label: "Fuel Type", 
        values: vehicles.map(v => v.fuelType)
      },
      { 
        label: "Color", 
        values: vehicles.map(v => v.color)
      }
    ];
  };

  const getHighlightClass = (rowType, value, values, reverse = false) => {
    if (!rowType || values.length < 2) return "";
    
    const numericValues = values.filter(v => typeof v === "number");
    if (numericValues.length !== values.length) return "";

    const best = reverse ? Math.min(...values) : Math.max(...values);
    const worst = reverse ? Math.max(...values) : Math.min(...values);

    if (value === best && best !== worst) {
      return "bg-green-100 text-green-800 font-semibold";
    } else if (value === worst && best !== worst) {
      return "bg-red-100 text-red-800";
    }
    return "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error 
            message={error} 
            onRetry={() => window.location.reload()}
            type="network"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Comparison</h1>
            <p className="text-gray-600 mt-1">
              Compare up to 3 vehicles side by side
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => navigate("/")}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add More Vehicles
            </Button>
          </div>
        </div>

        {/* Content */}
        {vehicles.length === 0 ? (
          <Empty 
            type="comparisons"
            onAction={() => navigate("/")}
            actionText="Start Comparing Vehicles"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Vehicle Headers */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-b border-gray-200">
              <div className="hidden md:block">
                <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
              </div>
              
              {vehicles.map((vehicle) => (
                <div key={vehicle.Id} className="text-center">
                  <div className="relative mb-4">
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full aspect-[4/3] object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveVehicle(vehicle.Id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-bold text-lg text-gray-900 mb-1">
                    {vehicle.year} {vehicle.make}
                  </h4>
                  <p className="text-gray-600 mb-2">{vehicle.model}</p>
                  <Badge variant="accent" className="text-lg font-bold">
                    {formatPrice(vehicle.price)}
                  </Badge>
                  
                  <div className="mt-4 space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/vehicle/${vehicle.Id}`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(vehicle.listingUrl, '_blank')}
                    >
                      <ApperIcon name="ExternalLink" className="w-4 h-4 mr-1" />
                      Original Listing
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Placeholder for additional vehicles */}
              {vehicles.length < 3 && (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all"
                  onClick={() => navigate("/")}
                >
                  <ApperIcon name="Plus" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Add Another Vehicle</p>
                </div>
              )}
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {getComparisonRows().map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 w-48">
                        {row.label}
                      </td>
                      {row.values.map((value, vIndex) => (
                        <td 
                          key={vIndex} 
                          className={`px-6 py-4 text-sm text-center ${
                            getHighlightClass(row.highlight, value, row.values, row.reverse)
                          }`}
                        >
                          {row.formatter ? row.formatter(value) : value}
                        </td>
                      ))}
                      {/* Empty cells for missing vehicles */}
                      {Array.from({ length: 3 - vehicles.length }).map((_, emptyIndex) => (
                        <td key={`empty-${emptyIndex}`} className="px-6 py-4 text-sm text-center text-gray-400">
                          -
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Features Comparison */}
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features Comparison</h3>
              
              {/* Get all unique features */}
              {(() => {
                const allFeatures = [...new Set(vehicles.flatMap(v => v.features))].sort();
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="hidden md:block font-medium text-gray-700">
                      Feature
                    </div>
                    
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.Id} className="md:hidden lg:block">
                        <h4 className="font-medium text-gray-900 mb-2 md:hidden">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h4>
                        <div className="space-y-1">
                          {allFeatures.map((feature) => (
                            <div key={feature} className="flex items-center justify-between md:justify-center">
                              <span className="text-sm md:hidden">{feature}</span>
                              <div className="flex items-center">
                                {vehicle.features.includes(feature) ? (
                                  <ApperIcon name="Check" className="w-4 h-4 text-green-600" />
                                ) : (
                                  <ApperIcon name="X" className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ComparisonsPage;