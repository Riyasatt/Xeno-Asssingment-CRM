import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Users, ShoppingCart, Mail, TrendingUp } from "lucide-react"
import axios from "axios";
import useCrmStore from "../store/crmStore";

export default function Dashboard({ }) {

  const {allCustomers, allOrders, allCampaigns} = useCrmStore();

  const stats = [
    {
      name: "Total Customers",
      value: allCustomers.length.toString(),
      icon: Users,
    },
    {
      name: "Total Orders",
      value: allOrders.length.toString(),
      icon: ShoppingCart,
    },
    {
      name: "Total Campaigns",
      value: allCampaigns.length.toString(),
      icon: Mail,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your campaigns.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.name}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                 <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      
    </div>
  )
}
