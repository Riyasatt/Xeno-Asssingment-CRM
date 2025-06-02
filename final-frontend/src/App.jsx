import './App.css'
import React, { useState, useEffect, createContext, useContext } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

import DashboardLayout from "./components/DashboardLayout"
import Dashboard from "./components/Dashboard"
import CustomerUpload from "./components/CustomerUpload"
import OrderUpload from "./components/OrderUpload"
import CreateCampaign from "./components/CreateCampaign"
import CampaignHistory from "./components/CampaignHistory"
import useCrmStore from './store/crmStore'

// --- Auth Context ---
const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export default function App() {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)


  const { setAllCustomers, setAllOrders, setAllCampaigns, backendUrl} = useCrmStore();

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        setIsLoggedIn(true)
      } catch (err) {
        console.error("Stored user parse failed:", err)
        localStorage.clear()
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token'); // token from backend
      if (!token) {
        alert("Not authorized. Please login.");
        return;
      }

      try {
        setLoading(true)
        const res = await axios.get(`${backendUrl}/api/v1/customers/all`, {
          headers: {
            Authorization: `Bearer ${token}`, // this hits the `protect` middleware
          },
        });
        setAllCustomers(res.data);

        const resOrders = await axios.get(`${backendUrl}/api/v1/orders/all`, {
          headers: {
            Authorization: `Bearer ${token}`, // this hits the `protect` middleware
          },
        });
        setAllOrders(resOrders.data.data);

        const resCampaign = await axios.get(`${backendUrl}/api/v1/campaignHistory/all?includeCustomers=true`, {
          headers: {
            Authorization: `Bearer ${token}`, // this hits the `protect` middleware
          },
        });
        console.log(resCampaign);
        setAllCampaigns(resCampaign.data.history)

        setLoading(false)
      } catch (error) {

        console.error('Error fetching customers:', error.response?.data || error.message);
      }
    };

    fetchCustomers();
  }, []);

  const handleLogin = async (credentialResponse) => {
    console.log(credentialResponse);
    const token = credentialResponse?.credential
    if (!token) {
      alert("Login failed: no credential received.")
      return
    }
    console.log(token);

    try {
      // Send raw Google token to backend
      const res = await axios.post(`${backendUrl}/api/v1/auth/google`, { token })

      console.log("Auth RES",res);

      setUser(res.data.user)
      setIsLoggedIn(true)
      console.log(res.data.token);
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
    } catch (err) {
      console.error("Login error:", err)
      alert("Login failed: Could not verify with backend.")
    }
  }


  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1d]">
        <p className="text-gray-200 text-lg">Loading...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
     <GoogleOAuthProvider clientId="263087723265-kff3fqduj3s2khgpr3nee4jvuagkv2os.apps.googleusercontent.com">
      <div className="flex flex-col items-center justify-center min-h-screen  bg-black px-4 transition-colors duration-300">
        <div className="w-full max-w-md bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-white text-center">Welcome 👋</h1>
          <p className="text-center text-gray-200">
            Please sign in to continue
          </p>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleLogin}
              onError={() => alert("Login Failed")}
              useOneTap
              shape="pill"
              size="large"
              width="100%"
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
    )
  }

  const authContextValue = { user, isLoggedIn, logout: handleLogout }

  return (
    <AuthContext.Provider value={authContextValue}>
      <DashboardLayout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/customers" element={<CustomerUpload  />} />
          <Route path="/orders" element={<OrderUpload />} />
          <Route path="/create-campaign" element={<CreateCampaign  />} />
          <Route path="/campaign-history" element={<CampaignHistory />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </DashboardLayout>
    </AuthContext.Provider>
  )
}
