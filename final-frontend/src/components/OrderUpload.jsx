  import { useState } from "react"
  import { Button } from "../components/ui/button"
  import { Input } from "../components/ui/input"
  import { Label } from "../components/ui/label"
  import { Textarea } from "../components/ui/textarea"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
  import useCrmStore from "../store/crmStore"
  import axios from "axios"

  export default function OrderUpload({  customers }) {
    const [formData, setFormData] = useState({
      customerId: "",
      orderAmount: "",
      orderDate: "",
      items: "",
    })

    const {allCustomers, allOrders,setAllOrders, backendUrl} = useCrmStore()

    const handleSubmit = async(e) => {
      e.preventDefault()
      const newOrder = {
        id: allOrders.length + 1,
        ...formData,
        orderAmount: parseFloat(formData.orderAmount),
      }

      try {
        const token = localStorage.getItem('token'); // token from backend
        const res = await axios.post(`${backendUrl}/api/v1/orders/create`, {...formData},{
            headers: {
              Authorization: `Bearer ${token}`, // this hits the `protect` middleware
            },
          });
          setAllOrders([...allOrders,newOrder])
      } catch (error) {
        console.error('Error', error.response?.data || error.message);
      }

      setFormData({
        customerId: "",
        orderAmount: "",
        orderDate: "",
        items: "",
      })
    }

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }

    const handleCustomerSelect = (value) => {
      setFormData({
        ...formData,
        customerId: value,
      })
    }

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Order Management</h1>
        </div>

        {/* Add Order Form */}
        <Card className="bg-[#1a1a1d]  border-gray-500 text-white">
          <CardHeader>
            <CardTitle>Add New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer</Label>
                  <Select  value={formData.customerId} onValueChange={handleCustomerSelect} required>
                    <SelectTrigger id="customerId">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1d]  border-gray-500 text-white" >
                      {allCustomers.map((customer, id) => (
                        <SelectItem key={id} value={customer.customerId}>
                          {customer.name} ({customer.customerId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderAmount">Order Amount ($)</Label>
                  <Input
                    id="orderAmount"
                    name="orderAmount"
                    type="number"
                    step="0.01"
                    value={formData.orderAmount}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderDate">Order Date</Label>
                  <Input
                    id="orderDate"
                    name="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="items">Items</Label>
                <Textarea
                  id="items"
                  name="items"
                  value={formData.items}
                  onChange={handleInputChange}
                  placeholder="List the items in this order"
                  required
                />
              </div>

              <Button type="submit" className="w-full md:w-auto text-black bg-white">
                Add Order
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order List */}
        <Card className="bg-[#1a1a1d]  border-gray-500 text-white">
          <CardHeader>
            <CardTitle>Order List</CardTitle>
            <CardDescription>All orders in your database</CardDescription>
          </CardHeader>
          <CardContent>
            {allOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Order ID</TableHead>
                    <TableHead className="text-white">Customer ID</TableHead>
                    <TableHead className="text-white"> Amount</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white">Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allOrders.map((order,id) => (
                    <TableRow key={id}>
                      <TableCell className="font-medium">ORD_{id + 1}</TableCell>
                      <TableCell>{order.customerId}</TableCell>
                      <TableCell>Rs. {order.orderAmount.toFixed(2)}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.items}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-gray-500">No orders found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
