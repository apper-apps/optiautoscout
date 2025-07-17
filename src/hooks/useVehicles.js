import { useState, useEffect } from "react";
import vehicleService from "@/services/api/vehicleService";

const useVehicles = (filters = {}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = Object.keys(filters).length > 0 
        ? await vehicleService.search(filters)
        : await vehicleService.getAll();
        
      setVehicles(data);
    } catch (err) {
      setError(err.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [JSON.stringify(filters)]);

  return {
    vehicles,
    loading,
    error,
    refetch: loadVehicles
  };
};

export default useVehicles;