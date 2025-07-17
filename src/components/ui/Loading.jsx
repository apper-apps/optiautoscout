import React from "react";
import { motion } from "framer-motion";

const VehicleCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="space-y-2">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
      </div>
      <div className="flex gap-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 animate-pulse" />
      </div>
      <div className="flex gap-1">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16 animate-pulse" />
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20 animate-pulse" />
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-14 animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded flex-1 animate-pulse" />
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 animate-pulse" />
      </div>
    </div>
  </div>
);

const FiltersSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse" />
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse" />
      </div>
      
      {[1, 2, 3].map((section) => (
        <div key={section} className="space-y-4 border-b border-gray-200 pb-4">
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse" />
          <div className="space-y-3">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
      
      <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
    </div>
  </div>
);

const Loading = ({ type = "vehicles" }) => {
  if (type === "filters") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        <FiltersSkeleton />
      </motion.div>
    );
  }

  if (type === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[...Array(6)].map((_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </motion.div>
    );
  }

  if (type === "vehicle-detail") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 animate-pulse" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-12"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-200 to-primary-300 rounded-xl mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mx-auto animate-pulse" />
      </div>
    </motion.div>
  );
};

export default Loading;