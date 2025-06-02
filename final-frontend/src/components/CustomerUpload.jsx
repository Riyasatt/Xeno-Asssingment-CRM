import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import useCrmStore from "../store/crmStore"

export default function CustomerUpload() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    totalSpent: "",
    visits: "",
    lastOrderDate: "",
  })
   const {allCustomers, setAllCustomers, backendUrl} = useCrmStore()

  const handleSubmit = async(e) => {
    e.preventDefault()
    const newCustomer = {
      id: `CUST${String(allCustomers.length + 1).padStart(3, "0")}`,
      customerId: `CUST${String(allCustomers.length + 1).padStart(3, "0")}`,
      name: formData.name,
      email: formData.email,
      totalSpent: parseFloat(formData.totalSpent),
      visits: parseInt(formData.visits),
      lastOrderDate: formData.lastOrderDate,
    }


    try {
      const token = localStorage.getItem('token'); // token from backend
      const res = await axios.post(`${backendUrl}/api/v1/customers/create`, {...formData},{
          headers: {
            Authorization: `Bearer ${token}`, // this hits the `protect` middleware
          },
        });
        setAllCustomers([...allCustomers,newCustomer])
    } catch (error) {
      console.error('Error', error.response?.data || error.message);
    }

    
    
    setFormData({
      name: "",
      email: "",
      totalSpent: "",
      visits: "",
      lastOrderDate: "",
    })
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

 

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Customer Management</h1>
      </div>

      {/* Add Customer Form */}
      <Card className="bg-[#1a1a1d]  border-gray-500 text-white">
        <CardHeader>
          <CardTitle>Add New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalSpent">Total Spent (Rs)</Label>
                <Input
                  id="totalSpent"
                  name="totalSpent"
                  type="number"
                  step="0.01"
                  value={formData.totalSpent}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visits">Visits</Label>
                <Input
                  id="visits"
                  name="visits"
                  type="number"
                  value={formData.visits}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastOrderDate">Last Order Date</Label>
                <Input
                  id="lastOrderDate"
                  name="lastOrderDate"
                  type="date"
                  value={formData.lastOrderDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto text-black bg-white">
              Add Customer
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card  className="bg-[#1a1a1d]  border-gray-500 text-white">
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table >
            <TableHeader className="bg-white/10">
              <TableRow >
                <TableHead  className="text-white">ID</TableHead>
                <TableHead  className="text-white">Name</TableHead>
                <TableHead  className="text-white">Email</TableHead>
                <TableHead  className="text-white">Total Spent</TableHead>
                <TableHead  className="text-white"> Visits</TableHead>
                <TableHead  className="text-white">Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCustomers.map((customer, id) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{customer.customerId}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>Rs. {customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>{customer.visits}</TableCell>
                  <TableCell>{customer.lastOrderDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
