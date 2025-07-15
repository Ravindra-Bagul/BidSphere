import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/Home/HomePage";
import AuctionsListPage from "./pages/AuctionsList/AuctionsListPage";
import AuctionDetailsPage from "./pages/AuctionDetails/AuctionDetailsPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import SellerDashboard from "./pages/SellerDashboard/SellerDashboard";
import BidderDashboard from "./pages/BidderDashboard/BidderDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CreateAuction from "./pages/CreateAuction/CreateAuction";
import EditAuction from "./pages/EditAuction/EditAuction";
import ViewResult from "./pages/ViewResult/ViewResult";
import UserProfile from "./pages/Profile/UserProfile";

import './App.css';

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setIsLoggedIn(true);
      setUserType(user.userType);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserType(userData.userType.toUpperCase()); // Ensure userType is uppercase
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    setUserType("");
    window.location.href = "/";
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} userType={userType} handleLogout={handleLogout} />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auctions" element={<AuctionsListPage />} />
            <Route path="/auction/:id" element={<AuctionDetailsPage />} />
            <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage handleLogin={handleLogin} />} />
            
            {/* Protected Seller Route */}
            <Route 
              path="/seller-dashboard" 
              element={
                <ProtectedRoute allowedUserType="SELLER">
                  <SellerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Bidder Route */}
            <Route 
              path="/bidder-dashboard" 
              element={
                <ProtectedRoute allowedUserType="BIDDER">
                  <BidderDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Create Auction Route */}
            <Route 
              path="/create-auction" 
              element={
                <ProtectedRoute allowedUserType="SELLER">
                  <CreateAuction />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Edit Auction Route */}
            <Route 
              path="/edit-auction/:id" 
              element={
                <ProtectedRoute allowedUserType="SELLER">
                  <EditAuction />
                </ProtectedRoute>
              } 
            />
            
            {/* View Result Route */}
            <Route 
              path="/auction/:id/result" 
              element={<ViewResult />} 
            />
            
            {/* Profile Route */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedUserType="*">
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
