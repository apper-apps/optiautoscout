import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  type = "general" 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your internet connection and try again."
        };
      case "notfound":
        return {
          icon: "SearchX",
          title: "No Results Found",
          description: "We couldn't find any vehicles matching your criteria. Try adjusting your search filters."
        };
      case "server":
        return {
          icon: "ServerCrash",
          title: "Server Error",
          description: "Our servers are experiencing issues. Please try again in a few moments."
        };
      default:
        return {
          icon: "AlertTriangle",
          title: "Oops! Something went wrong",
          description: message
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon 
          name={errorContent.icon} 
          className="w-10 h-10 text-red-600" 
        />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {errorContent.title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {errorContent.description}
      </p>
      
      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry} className="min-w-24">
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Refresh Page
        </Button>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        If the problem persists, please contact our support team.
      </div>
    </motion.div>
  );
};

export default Error;