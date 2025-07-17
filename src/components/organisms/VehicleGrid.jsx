import React from "react";
import VehicleCard from "@/components/organisms/VehicleCard";
import { motion } from "framer-motion";

const VehicleGrid = ({ 
  vehicles, 
  onSave, 
  onCompare, 
  savedVehicles = [], 
  comparedVehicles = [] 
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.Id}
          vehicle={vehicle}
          onSave={onSave}
          onCompare={onCompare}
          isSaved={savedVehicles.includes(vehicle.Id)}
          isCompared={comparedVehicles.includes(vehicle.Id)}
        />
      ))}
    </motion.div>
  );
};

export default VehicleGrid;