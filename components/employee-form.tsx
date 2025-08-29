"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Employee, GradeLevel } from "@/app/page"

interface EmployeeFormProps {
  employee?: Employee
  gradeLevels: GradeLevel[]
  countries: any[]
  onSave: (employee: Employee) => void
  onCancel: () => void
}

export function EmployeeForm({ employee, gradeLevels, countries, onSave, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: "",
    country: "",
    state: "",
    address: "",
    role: "",
    department: "",
    gradeLevel: "",
    email: "",
    phone: "",
    ...employee,
  })

  const [states, setStates] = useState<string[]>([])

  useEffect(() => {
    if (formData.country) {
      const countryStates = countries
        .filter((city) => city.country === formData.country)
        .map((city) => city.subcountry)
        .filter((state, index, arr) => arr.indexOf(state) === index)
        .sort()
      setStates(countryStates)
    }
  }, [formData.country, countries])

  const uniqueCountries = [...new Set(countries.map((city) => city.country))].sort()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const employeeData: Employee = {
      id: employee?.id || Date.now().toString(),
      name: formData.name || "",
      country: formData.country || "",
      state: formData.state || "",
      address: formData.address || "",
      role: formData.role || "",
      department: formData.department || "",
      gradeLevel: formData.gradeLevel,
      email: formData.email,
      phone: formData.phone,
    }

    onSave(employeeData)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="gradeLevel">Grade Level</Label>
            <Select
              value={formData.gradeLevel}
              onValueChange={(value) => setFormData({ ...formData, gradeLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {gradeLevels.map((grade) => (
                  <SelectItem key={grade.id} value={grade.name}>
                    {grade.name} - {grade.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Country *</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => setFormData({ ...formData, country: value, state: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="state">State/Province *</Label>
            <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1">
            {employee ? "Update Employee" : "Add Employee"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
