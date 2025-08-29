"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, Mail, Phone, MapPin, Building2, Award, User } from "lucide-react"
import type { Employee } from "@/app/page"

interface EmployeeProfileProps {
  employee: Employee
  onEdit: () => void
  onClose: () => void
}

export function EmployeeProfile({ employee, onEdit, onClose }: EmployeeProfileProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-secondary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
            <p className="text-lg text-muted-foreground">{employee.role}</p>
            {employee.gradeLevel && (
              <Badge variant="secondary" className="mt-1">
                <Award className="w-3 h-3 mr-1" />
                {employee.gradeLevel}
              </Badge>
            )}
          </div>
        </div>
        <Button onClick={onEdit} size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <Separator />

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {employee.email && (
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{employee.email}</span>
            </div>
          )}
          {employee.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{employee.phone}</span>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>
              {employee.address}, {employee.state}, {employee.country}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Work Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Work Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Department</label>
              <p className="text-foreground">{employee.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Position</label>
              <p className="text-foreground">{employee.role}</p>
            </div>
            {employee.gradeLevel && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Grade Level</label>
                <p className="text-foreground">{employee.gradeLevel}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Location Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Country</label>
              <p className="text-foreground">{employee.country}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">State/Province</label>
              <p className="text-foreground">{employee.state}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Full Address</label>
              <p className="text-foreground">{employee.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button onClick={onEdit} className="flex-1">
          <Edit className="w-4 h-4 mr-2" />
          Edit Employee
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
          Close
        </Button>
      </div>
    </div>
  )
}
