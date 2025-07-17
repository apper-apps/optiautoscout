import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import savedSearchService from "@/services/api/savedSearchService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const SavedSearchesPage = () => {
  const navigate = useNavigate();
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSavedSearches = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await savedSearchService.getAll();
      setSavedSearches(data);
    } catch (err) {
      setError(err.message || "Failed to load saved searches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const handleRunSearch = (search) => {
    // Convert filters to URL parameters
    const params = new URLSearchParams();
    Object.entries(search.filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(`${key}[]`, item));
      } else if (value !== "" && value !== undefined && value !== null) {
        params.append(key, value);
      }
    });

    // Update last run date
    savedSearchService.update(search.Id, {
      lastRun: new Date().toISOString().split('T')[0]
    });

    navigate(`/?${params.toString()}`);
  };

  const handleDeleteSearch = async (searchId) => {
    if (!window.confirm("Are you sure you want to delete this saved search?")) {
      return;
    }

    try {
      await savedSearchService.delete(searchId);
      setSavedSearches(prev => prev.filter(s => s.Id !== searchId));
      toast.success("Saved search deleted successfully");
    } catch (err) {
      toast.error("Failed to delete saved search");
    }
  };

  const formatFilters = (filters) => {
    const filterStrings = [];
    
    if (filters.make && filters.make.length > 0) {
      filterStrings.push(`Make: ${filters.make.join(", ")}`);
    }
    if (filters.model) {
      filterStrings.push(`Model: ${filters.model}`);
    }
    if (filters.minYear || filters.maxYear) {
      const yearRange = [filters.minYear, filters.maxYear].filter(Boolean).join("-");
      filterStrings.push(`Year: ${yearRange}`);
    }
    if (filters.minPrice || filters.maxPrice) {
      const priceRange = [
        filters.minPrice ? `$${filters.minPrice.toLocaleString()}` : "",
        filters.maxPrice ? `$${filters.maxPrice.toLocaleString()}` : ""
      ].filter(Boolean).join("-");
      filterStrings.push(`Price: ${priceRange}`);
    }
    if (filters.bodyType && filters.bodyType.length > 0) {
      filterStrings.push(`Type: ${filters.bodyType.join(", ")}`);
    }
    if (filters.fuelType && filters.fuelType.length > 0) {
      filterStrings.push(`Fuel: ${filters.fuelType.join(", ")}`);
    }

    return filterStrings.slice(0, 3);
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
            onRetry={loadSavedSearches}
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
            <h1 className="text-3xl font-bold text-gray-900">Saved Searches</h1>
            <p className="text-gray-600 mt-1">
              Your saved vehicle search criteria
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => navigate("/")}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </div>
        </div>

        {/* Content */}
        {savedSearches.length === 0 ? (
          <Empty 
            type="saved-searches"
            onAction={() => navigate("/")}
            actionText="Create Your First Search"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSearches.map((search, index) => (
              <motion.div
                key={search.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {search.name}
                    </h3>
                    <Badge variant="primary" className="text-xs">
                      {search.resultCount} result{search.resultCount !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteSearch(search.Id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Preview */}
                <div className="space-y-2 mb-6">
                  {formatFilters(search.filters).map((filter, idx) => (
                    <div key={idx} className="text-sm text-gray-600 flex items-center">
                      <ApperIcon name="Filter" className="w-3 h-3 mr-2 text-gray-400" />
                      {filter}
                    </div>
                  ))}
                  {Object.keys(search.filters).length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{Object.keys(search.filters).length - 3} more filters
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="text-xs text-gray-500 mb-4 space-y-1">
                  <div>Created: {new Date(search.createdAt).toLocaleDateString()}</div>
                  <div>Last run: {new Date(search.lastRun).toLocaleDateString()}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    size="sm"
                    onClick={() => handleRunSearch(search)}
                  >
                    <ApperIcon name="Play" className="w-4 h-4 mr-2" />
                    Run Search
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-3"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(search.filters, null, 2));
                      toast.success("Search criteria copied to clipboard");
                    }}
                  >
                    <ApperIcon name="Copy" className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSearchesPage;