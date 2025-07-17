import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import VehicleGrid from "@/components/organisms/VehicleGrid";
import useLocalStorage from "@/hooks/useLocalStorage";
import vehicleService from "@/services/api/vehicleService";
import dealershipService from "@/services/api/dealershipService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [dealership, setDealership] = useState(null);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedVehicles, setSavedVehicles] = useLocalStorage("savedVehicles", []);
  const [comparedVehicles, setComparedVehicles] = useLocalStorage("comparedVehicles", []);

  useEffect(() => {
    const loadVehicleData = async () => {
      try {
        setLoading(true);
        setError("");

        // Load vehicle details
        const vehicleData = await vehicleService.getById(id);
        setVehicle(vehicleData);

        // Load dealership info
        const dealershipData = await dealershipService.getById(vehicleData.dealershipId);
        setDealership(dealershipData);

        // Load similar vehicles
        const allVehicles = await vehicleService.getAll();
        const similar = allVehicles
          .filter(v => 
            v.Id !== vehicleData.Id && 
            (v.make === vehicleData.make || v.bodyType === vehicleData.bodyType)
          )
          .slice(0, 3);
        setSimilarVehicles(similar);

      } catch (err) {
        setError(err.message || "Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadVehicleData();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading type="vehicle-detail" />
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error 
            message={error || "Vehicle not found"} 
            type="notfound"
          />
        </div>
      </div>
    );
  }

  const isSaved = savedVehicles.includes(vehicle.Id);
  const isCompared = comparedVehicles.includes(vehicle.Id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary-600">Search</Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</span>
        </nav>

        {/* Vehicle Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span>{vehicle.color} • {vehicle.bodyType}</span>
                <Badge variant="primary">VIN: {vehicle.vin}</Badge>
              </div>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">
                  {formatPrice(vehicle.price)}
                </div>
                <div className="text-gray-600">{formatMileage(vehicle.mileage)} miles</div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={isSaved ? "accent" : "outline"}
                  onClick={() => handleSaveVehicle(vehicle.Id)}
                >
                  <ApperIcon name="Heart" className="w-4 h-4 mr-2" fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? "Saved" : "Save"}
                </Button>
                
                <Button
                  variant={isCompared ? "primary" : "outline"}
                  onClick={() => handleCompareVehicle(vehicle.Id)}
                >
                  <ApperIcon name="Scale" className="w-4 h-4 mr-2" />
                  {isCompared ? "Comparing" : "Compare"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative aspect-[4/3]">
                <img
                  src={vehicle.images[currentImageIndex]}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                
                {vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? vehicle.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all"
                    >
                      <ApperIcon name="ChevronLeft" className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === vehicle.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all"
                    >
                      <ApperIcon name="ChevronRight" className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              {vehicle.images.length > 1 && (
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {vehicle.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? "border-primary-500 ring-2 ring-primary-200" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year</span>
                    <span className="font-medium">{vehicle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Make</span>
                    <span className="font-medium">{vehicle.make}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model</span>
                    <span className="font-medium">{vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Body Type</span>
                    <span className="font-medium">{vehicle.bodyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color</span>
                    <span className="font-medium">{vehicle.color}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mileage</span>
                    <span className="font-medium">{formatMileage(vehicle.mileage)} mi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transmission</span>
                    <span className="font-medium">{vehicle.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Type</span>
                    <span className="font-medium">{vehicle.fuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VIN</span>
                    <span className="font-medium text-sm">{vehicle.vin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Added</span>
                    <span className="font-medium">{new Date(vehicle.dateAdded).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <ApperIcon name="Check" className="w-4 h-4 text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dealership Info */}
            {dealership && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Dealership</h3>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">{dealership.name}</h4>
                  <div className="flex items-start space-x-2">
                    <ApperIcon name="MapPin" className="w-4 h-4 text-gray-500 mt-1" />
                    <span className="text-gray-600">{dealership.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Phone" className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{dealership.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Globe" className="w-4 h-4 text-gray-500" />
                    <a 
                      href={dealership.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full">
                    <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                    Call Dealership
                  </Button>
                  <Button variant="outline" className="w-full">
                    <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button 
                    variant="accent" 
                    className="w-full"
                    onClick={() => window.open(vehicle.listingUrl, '_blank')}
                  >
                    <ApperIcon name="ExternalLink" className="w-4 h-4 mr-2" />
                    View Original Listing
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ApperIcon name="Calculator" className="w-4 h-4 mr-3" />
                  Calculate Payment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ApperIcon name="FileText" className="w-4 h-4 mr-3" />
                  Vehicle History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-3" />
                  Schedule Test Drive
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ApperIcon name="Share2" className="w-4 h-4 mr-3" />
                  Share Vehicle
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Vehicles */}
        {similarVehicles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Similar Vehicles</h2>
            <VehicleGrid
              vehicles={similarVehicles}
              onSave={handleSaveVehicle}
              onCompare={handleCompareVehicle}
              savedVehicles={savedVehicles}
              comparedVehicles={comparedVehicles}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailPage;