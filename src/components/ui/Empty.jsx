import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Empty = ({ 
  type = "vehicles",
  onAction,
  actionText = "Start Searching"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "vehicles":
        return {
          icon: "Car",
          title: "No vehicles found",
          description: "Try adjusting your search filters to find more vehicles, or browse our featured listings.",
          action: "Browse All Vehicles",
          gradient: "from-blue-100 to-blue-200",
          iconColor: "text-blue-600"
        };
      case "saved-searches":
        return {
          icon: "Bookmark",
          title: "No saved searches yet",
          description: "Save your search criteria to quickly find vehicles that match your preferences.",
          action: "Create First Search",
          gradient: "from-purple-100 to-purple-200",
          iconColor: "text-purple-600"
        };
      case "comparisons":
        return {
          icon: "Scale",
          title: "No comparisons yet",
          description: "Compare vehicles side-by-side to make an informed decision.",
          action: "Start Comparing",
          gradient: "from-green-100 to-green-200",
          iconColor: "text-green-600"
        };
      case "search-results":
        return {
          icon: "SearchX",
          title: "No results found",
          description: "Your search didn't return any results. Try broadening your criteria or exploring different options.",
          action: "Clear Filters",
          gradient: "from-orange-100 to-orange-200",
          iconColor: "text-orange-600"
        };
      default:
        return {
          icon: "FileX",
          title: "Nothing here yet",
          description: "Get started by exploring our features and adding content.",
          action: actionText,
          gradient: "from-gray-100 to-gray-200",
          iconColor: "text-gray-600"
        };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className={`w-24 h-24 bg-gradient-to-br ${content.gradient} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
        <ApperIcon 
          name={content.icon} 
          className={`w-12 h-12 ${content.iconColor}`} 
        />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {content.description}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          className="min-w-40"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {content.action}
        </Button>
      )}
      
      {/* Decorative elements */}
      <div className="mt-8 flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full bg-gradient-to-r ${content.gradient} opacity-50`}
            style={{
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Empty;