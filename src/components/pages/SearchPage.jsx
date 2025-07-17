import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchFilters from "@/components/organisms/SearchFilters";
import VehicleGrid from "@/components/organisms/VehicleGrid";
import MapView from "@/components/organisms/MapView";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import useVehicles from "@/hooks/useVehicles";
import useLocalStorage from "@/hooks/useLocalStorage";
import vehicleService from "@/services/api/vehicleService";
import dealershipService from "@/services/api/dealershipService";
import savedSearchService from "@/services/api/savedSearchService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [dealerships, setDealerships] = useState([]);
  const [savedVehicles, setSavedVehicles] = useLocalStorage("savedVehicles", []);
  const [comparedVehicles, setComparedVehicles] = useLocalStorage("comparedVehicles", []);

  const { vehicles, loading, error, refetch } = useVehicles(filters);

  useEffect(() => {
    // Parse URL parameters into filters
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.includes("[]")) {
        const cleanKey = key.replace("[]", "");
        urlFilters[cleanKey] = urlFilters[cleanKey] ? [...urlFilters[cleanKey], value] : [value];
      } else {
        urlFilters[key] = isNaN(value) ? value : Number(value);
      }
    }
    setFilters(urlFilters);
  }, [searchParams]);

  useEffect(() => {
    const loadDealerships = async () => {
      try {
        const data = await dealershipService.getAll();
        setDealerships(data);
      } catch (err) {
        console.error("Failed to load dealerships:", err);
      }
    };
    loadDealerships();
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL parameters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(`${key}[]`, item));
      } else if (value !== "" && value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleSaveVehicle = (vehicleId) => {
    setSavedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        toast.info("Vehicle removed from saved list");
        return prev.filter(id => id !== vehicleId);
      } else {
        toast.success("Vehicle saved successfully!");
        return [...prev, vehicleId];
      }
    });
  };

  const handleCompareVehicle = (vehicleId) => {
    setComparedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        toast.info("Vehicle removed from comparison");
        return prev.filter(id => id !== vehicleId);
      } else if (prev.length >= 3) {
        toast.warning("You can only compare up to 3 vehicles");
        return prev;
      } else {
        toast.success("Vehicle added to comparison!");
        return [...prev, vehicleId];
      }
    });
  };

  const handleSaveSearch = async (searchFilters) => {
    try {
      const searchName = prompt("Enter a name for this search:");
      if (!searchName) return;

      await savedSearchService.create({
        name: searchName,
        filters: searchFilters,
        resultCount: vehicles.length
      });
      
      toast.success("Search saved successfully!");
    } catch (err) {
      toast.error("Failed to save search");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Loading type="filters" />
            </div>
            <div className="lg:col-span-3">
              <Loading type="grid" />
            </div>
          </div>
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
            onRetry={refetch}
            type="network"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSaveSearch={handleSaveSearch}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Vehicle Search
                </h1>
                <p className="text-gray-600 mt-1">
                  {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                {comparedVehicles.length > 0 && (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => window.open(`/comparisons?vehicles=${comparedVehicles.join(',')}`, '_blank')}
                  >
                    <ApperIcon name="Scale" className="w-4 h-4 mr-2" />
                    Compare ({comparedVehicles.length})
                  </Button>
                )}
                
                <Button
                  variant={showMap ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                >
                  <ApperIcon name="Map" className="w-4 h-4 mr-2" />
                  {showMap ? "Hide Map" : "Show Map"}
                </Button>
              </div>
            </div>

            {/* Map View */}
            {showMap && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <MapView
                  vehicles={vehicles}
                  dealerships={dealerships}
                  onVehicleSelect={(vehicle) => {
                    window.open(`/vehicle/${vehicle.Id}`, '_blank');
                  }}
                  onDealershipSelect={(dealership) => {
                    toast.info(`${dealership.name}: ${dealership.vehicleCount} vehicles available`);
                  }}
                />
              </motion.div>
            )}

            {/* Results */}
            {vehicles.length === 0 ? (
              <Empty 
                type="search-results"
                onAction={() => handleFiltersChange({})}
                actionText="Clear All Filters"
              />
            ) : (
              <VehicleGrid
                vehicles={vehicles}
                onSave={handleSaveVehicle}
                onCompare={handleCompareVehicle}
                savedVehicles={savedVehicles}
                comparedVehicles={comparedVehicles}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;