import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import SearchPage from "@/components/pages/SearchPage";
import VehicleDetailPage from "@/components/pages/VehicleDetailPage";
import SavedSearchesPage from "@/components/pages/SavedSearchesPage";
import ComparisonsPage from "@/components/pages/ComparisonsPage";

function App() {
  const handleGlobalSearch = (query) => {
    // Handle global search from header
    if (query.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.set("model", query);
      window.location.href = `/?${searchParams.toString()}`;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleGlobalSearch} />
        
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
          <Route path="/saved-searches" element={<SavedSearchesPage />} />
          <Route path="/comparisons" element={<ComparisonsPage />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;