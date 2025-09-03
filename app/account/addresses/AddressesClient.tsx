"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Plus, Edit, Trash2, Home, Building, CheckCircle, AlertCircle } from "lucide-react"

interface Address {
  id: number
  type: "home" | "work" | "other"
  firstName: string
  lastName: string
  company?: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

export default function AddressesClient() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [newAddress, setNewAddress] = useState({
    type: "home",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "PS",
    phone: "",
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/addresses")
      const data = await response.json()
      if (data.success) {
        setAddresses(data.addresses)
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveAddress = async () => {
    setLoading(true)
    try {
      const url = editingAddress ? "/api/addresses/update" : "/api/addresses/add"
      const payload = editingAddress ? { ...newAddress, id: editingAddress.id } : newAddress

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (data.success) {
        if (editingAddress) {
          setAddresses(addresses.map((addr) => (addr.id === editingAddress.id ? data.address : addr)))
          setMessage({ type: "success", text: "Address updated successfully!" })
        } else {
          setAddresses([...addresses, data.address])
          setMessage({ type: "success", text: "Address added successfully!" })
        }
        resetForm()
      } else {
        setMessage({ type: "error", text: data.message || "Failed to save address" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving address" })
    } finally {
      setLoading(false)
    }
  }

  const deleteAddress = async (id: number) => {
    try {
      const response = await fetch("/api/addresses/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setAddresses(addresses.filter((addr) => addr.id !== id))
        setMessage({ type: "success", text: "Address deleted successfully!" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete address" })
    }
  }

  const setDefaultAddress = async (id: number) => {
    try {
      const response = await fetch("/api/addresses/set-default", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setAddresses(addresses.map((addr) => ({ ...addr, isDefault: addr.id === id })))
        setMessage({ type: "success", text: "Default address updated!" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update default address" })
    }
  }

  const resetForm = () => {
    setNewAddress({
      type: "home",
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "PS",
      phone: "",
    })
    setIsAddingAddress(false)
    setEditingAddress(null)
  }

  const startEdit = (address: Address) => {
    setNewAddress({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || "",
      address: address.address,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
    })
    setEditingAddress(address)
    setIsAddingAddress(true)
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="w-5 h-5 text-blue-600" />
      case "work":
        return <Building className="w-5 h-5 text-green-600" />
      default:
        return <MapPin className="w-5 h-5 text-gray-600" />
    }
  }

  if (loading && addresses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading addresses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Shipping Addresses</h1>
          <p className="text-lg text-gray-600">Manage your delivery addresses</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <Alert
            className={`mb-6 ${
              message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Add Address */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingAddress ? "Edit Address" : "Add New Address"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="type">Address Type</Label>
                    <Select
                      value={newAddress.type}
                      onValueChange={(value) => setNewAddress({ ...newAddress, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newAddress.firstName}
                        onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newAddress.lastName}
                        onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      value={newAddress.company}
                      onChange={(e) => setNewAddress({ ...newAddress, company: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea
                      id="address"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={newAddress.country}
                        onValueChange={(value) => setNewAddress({ ...newAddress, country: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PS">Palestine</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={saveAddress} disabled={loading} className="flex-1">
                      {loading ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                    </Button>
                    <Button variant="outline" onClick={resetForm} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <MapPin className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-2">No Addresses</h3>
                <p className="text-gray-600">Add a shipping address to make checkout faster.</p>
              </CardContent>
            </Card>
          ) : (
            addresses.map((address) => (
              <Card key={address.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getAddressIcon(address.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg capitalize">{address.type} Address</h3>
                          {address.isDefault && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">Default</Badge>
                          )}
                        </div>
                        <div className="text-gray-700 space-y-1">
                          <p className="font-medium">
                            {address.firstName} {address.lastName}
                          </p>
                          {address.company && <p>{address.company}</p>}
                          <p>{address.address}</p>
                          <p>
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                          <p>{address.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultAddress(address.id)}
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(address)}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAddress(address.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
