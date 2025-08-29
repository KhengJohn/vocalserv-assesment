"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Plus,
  Users,
  Building2,
  Award,
  Edit,
  Trash2,
  Eye,
  Settings,
  Filter,
  X,
  ArrowUpDown,
  AlertTriangle,
} from "lucide-react"
import { EmployeeForm } from "@/components/employee-form"
import { EmployeeProfile } from "@/components/employee-profile"
import { GradeLevelForm } from "@/components/grade-level-form"
import { DataManagement } from "@/components/data-management"
import { ThemeToggle } from "@/components/theme-toggle"
import { DataPersistence } from "@/lib/data-persistence"
import { EmployeeCardSkeleton, StatsCardSkeleton } from "@/components/loading-skeleton"

// Types for our data structures
export interface Employee {
  id: string
  name: string
  country: string
  state: string
  address: string
  role: string
  department: string
  gradeLevel?: string
  email?: string
  phone?: string
}

export interface GradeLevel {
  id: string
  name: string
  description?: string
}

export default function StaffDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("all")
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string>("all")
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [countries, setCountries] = useState<any[]>([])
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>()
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>()
  const [editingGradeLevel, setEditingGradeLevel] = useState<GradeLevel | undefined>()
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<GradeLevel | undefined>()
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [showEmployeeProfile, setShowEmployeeProfile] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showGradeLevelForm, setShowGradeLevelForm] = useState(false)
  const [showGradeLevelDeleteDialog, setShowGradeLevelDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("employees")
  const [dataError, setDataError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCountriesLoading, setIsCountriesLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const loadedEmployees = DataPersistence.loadEmployees()
        const loadedGradeLevels = DataPersistence.loadGradeLevels()

        setEmployees(loadedEmployees)
        setGradeLevels(loadedGradeLevels)
        setDataError("")
      } catch (error) {
        console.error("Failed to load data:", error)
        setDataError("Failed to load data from storage. Some features may not work correctly.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
    fetchCountries()
  }, [])

  useEffect(() => {
    if (employees.length > 0 || gradeLevels.length > 0) {
      const success = DataPersistence.saveEmployees(employees)
      if (!success) {
        setDataError("Failed to save employee data. Changes may be lost.")
      }
    }
  }, [employees])

  useEffect(() => {
    if (gradeLevels.length > 0) {
      const success = DataPersistence.saveGradeLevels(gradeLevels)
      if (!success) {
        setDataError("Failed to save grade level data. Changes may be lost.")
      }
    }
  }, [gradeLevels])

  const fetchCountries = async () => {
    try {
      setIsCountriesLoading(true)
      const response = await fetch(
        "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json",
      )
      const data = await response.json()
      setCountries(data)
    } catch (error) {
      console.error("Failed to fetch countries:", error)
    } finally {
      setIsCountriesLoading(false)
    }
  }

  const filteredAndSortedEmployees = (() => {
    const filtered = employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.state.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesGrade = selectedGradeFilter === "all" || employee.gradeLevel === selectedGradeFilter
      const matchesDepartment = selectedDepartmentFilter === "all" || employee.department === selectedDepartmentFilter
      const matchesCountry = selectedCountryFilter === "all" || employee.country === selectedCountryFilter

      return matchesSearch && matchesGrade && matchesDepartment && matchesCountry
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: string | undefined
      let bValue: string | undefined

      switch (sortBy) {
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "role":
          aValue = a.role
          bValue = b.role
          break
        case "department":
          aValue = a.department
          bValue = b.department
          break
        case "country":
          aValue = a.country
          bValue = b.country
          break
        case "gradeLevel":
          aValue = a.gradeLevel || ""
          bValue = b.gradeLevel || ""
          break
        default:
          aValue = a.name
          bValue = b.name
      }

      if (!aValue && !bValue) return 0
      if (!aValue) return 1
      if (!bValue) return -1

      const comparison = aValue.localeCompare(bValue)
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  })()

  const uniqueDepartments = [...new Set(employees.map((emp) => emp.department))].sort()
  const uniqueCountries = [...new Set(employees.map((emp) => emp.country))].sort()

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedGradeFilter("all")
    setSelectedDepartmentFilter("all")
    setSelectedCountryFilter("all")
    setSortBy("name")
    setSortOrder("asc")
  }

  const activeFiltersCount = [
    searchTerm,
    selectedGradeFilter !== "all",
    selectedDepartmentFilter !== "all",
    selectedCountryFilter !== "all",
  ].filter(Boolean).length

  const stats = {
    totalEmployees: employees.length,
    filteredEmployees: filteredAndSortedEmployees.length,
    departments: [...new Set(employees.map((emp) => emp.department))].length,
    gradeLevels: gradeLevels.length,
  }

  const handleImportData = (importedEmployees: Employee[], importedGradeLevels: GradeLevel[]) => {
    setEmployees(importedEmployees)
    setGradeLevels(importedGradeLevels)
    setDataError("")
  }

  const handleClearAllData = () => {
    setEmployees([])
    setGradeLevels([])
    setDataError("")
  }

  const handleAddEmployee = () => {
    setEditingEmployee(undefined)
    setShowEmployeeForm(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setShowEmployeeForm(true)
  }

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowEmployeeProfile(true)
  }

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowDeleteDialog(true)
  }

  const handleSaveEmployee = (employeeData: Employee) => {
    if (editingEmployee) {
      // Update existing employee
      setEmployees((prev) => prev.map((emp) => (emp.id === employeeData.id ? employeeData : emp)))
    } else {
      // Add new employee
      setEmployees((prev) => [...prev, employeeData])
    }
    setShowEmployeeForm(false)
    setEditingEmployee(undefined)
  }

  const confirmDeleteEmployee = () => {
    if (selectedEmployee) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== selectedEmployee.id))
      setShowDeleteDialog(false)
      setSelectedEmployee(undefined)
    }
  }

  const handleAddGradeLevel = () => {
    setEditingGradeLevel(undefined)
    setShowGradeLevelForm(true)
  }

  const handleEditGradeLevel = (gradeLevel: GradeLevel) => {
    setEditingGradeLevel(gradeLevel)
    setShowGradeLevelForm(true)
  }

  const handleDeleteGradeLevel = (gradeLevel: GradeLevel) => {
    setSelectedGradeLevel(gradeLevel)
    setShowGradeLevelDeleteDialog(true)
  }

  const handleSaveGradeLevel = (gradeLevelData: GradeLevel) => {
    if (editingGradeLevel) {
      // Update existing grade level
      setGradeLevels((prev) => prev.map((grade) => (grade.id === gradeLevelData.id ? gradeLevelData : grade)))
      // Update employees with the old grade level name to the new one
      if (editingGradeLevel.name !== gradeLevelData.name) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.gradeLevel === editingGradeLevel.name ? { ...emp, gradeLevel: gradeLevelData.name } : emp,
          ),
        )
      }
    } else {
      // Add new grade level
      setGradeLevels((prev) => [...prev, gradeLevelData])
    }
    setShowGradeLevelForm(false)
    setEditingGradeLevel(undefined)
  }

  const confirmDeleteGradeLevel = () => {
    if (selectedGradeLevel) {
      // Check if any employees are assigned to this grade level
      const employeesWithGrade = employees.filter((emp) => emp.gradeLevel === selectedGradeLevel.name)
      if (employeesWithGrade.length > 0) {
        // Remove grade level assignment from employees
        setEmployees((prev) =>
          prev.map((emp) => (emp.gradeLevel === selectedGradeLevel.name ? { ...emp, gradeLevel: undefined } : emp)),
        )
      }
      setGradeLevels((prev) => prev.filter((grade) => grade.id !== selectedGradeLevel.id))
      setShowGradeLevelDeleteDialog(false)
      setSelectedGradeLevel(undefined)
    }
  }

  const getEmployeeCountByGradeLevel = (gradeLevelName: string) => {
    return employees.filter((emp) => emp.gradeLevel === gradeLevelName).length
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">Staff Directory</h1>
              <p className="text-sm sm:text-base text-muted-foreground text-pretty">
                Manage your organization's employees and grade levels
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <ThemeToggle />
              <Button
                onClick={handleAddGradeLevel}
                variant="outline"
                className="bg-transparent order-2 sm:order-1 transition-all duration-200 hover:scale-105"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Manage Grades</span>
                <span className="sm:hidden">Grades</span>
              </Button>
              <Button
                onClick={handleAddEmployee}
                className="bg-primary hover:bg-primary/90 order-1 sm:order-2 transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {dataError && (
          <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{dataError}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 h-auto p-1">
            <TabsTrigger
              value="employees"
              className="text-xs sm:text-sm py-2 transition-all duration-200 data-[state=active]:scale-105"
            >
              <Users className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Employees</span>
              <span className="sm:hidden">Staff</span>
            </TabsTrigger>
            <TabsTrigger
              value="grades"
              className="text-xs sm:text-sm py-2 transition-all duration-200 data-[state=active]:scale-105"
            >
              <Award className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Grade Levels</span>
              <span className="sm:hidden">Grades</span>
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="text-xs sm:text-sm py-2 transition-all duration-200 data-[state=active]:scale-105"
            >
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Data Management</span>
              <span className="sm:hidden">Data</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {isLoading ? (
                <>
                  <StatsCardSkeleton />
                  <StatsCardSkeleton />
                  <StatsCardSkeleton />
                  <StatsCardSkeleton />
                </>
              ) : (
                <>
                  <Card className="transition-all duration-200 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium">Total Employees</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{stats.totalEmployees}</div>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-200 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium">Filtered Results</CardTitle>
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{stats.filteredEmployees}</div>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-200 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium">Departments</CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{stats.departments}</div>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-200 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium">Grade Levels</CardTitle>
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{stats.gradeLevels}</div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Enhanced Search and Filters */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, role, department, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-ring/20"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="bg-transparent transition-all duration-200 hover:scale-105"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Filters</span>
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs animate-in zoom-in-50 duration-200">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>

                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      size="sm"
                      className="bg-transparent transition-all duration-200 hover:scale-105 animate-in slide-in-from-right-2"
                    >
                      <X className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Clear</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <Card className="p-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Grade Level</label>
                      <Select value={selectedGradeFilter} onValueChange={setSelectedGradeFilter}>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-ring/20">
                          <SelectValue placeholder="All Grades" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Grades</SelectItem>
                          {gradeLevels.map((grade) => (
                            <SelectItem key={grade.id} value={grade.name}>
                              {grade.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Department</label>
                      <Select value={selectedDepartmentFilter} onValueChange={setSelectedDepartmentFilter}>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-ring/20">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {uniqueDepartments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Country</label>
                      <Select value={selectedCountryFilter} onValueChange={setSelectedCountryFilter}>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-ring/20">
                          <SelectValue placeholder="All Countries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Countries</SelectItem>
                          {uniqueCountries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort By</label>
                      <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-ring/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="role">Role</SelectItem>
                            <SelectItem value="department">Department</SelectItem>
                            <SelectItem value="country">Country</SelectItem>
                            <SelectItem value="gradeLevel">Grade Level</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                          className="bg-transparent transition-all duration-200 hover:scale-105"
                        >
                          <ArrowUpDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-1 duration-200">
                  {searchTerm && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 transition-all duration-200 hover:scale-105"
                    >
                      Search: "{searchTerm}"
                      <X
                        className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setSearchTerm("")}
                      />
                    </Badge>
                  )}
                  {selectedGradeFilter !== "all" && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 transition-all duration-200 hover:scale-105"
                    >
                      Grade: {selectedGradeFilter}
                      <X
                        className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setSelectedGradeFilter("all")}
                      />
                    </Badge>
                  )}
                  {selectedDepartmentFilter !== "all" && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 transition-all duration-200 hover:scale-105"
                    >
                      Dept: {selectedDepartmentFilter}
                      <X
                        className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setSelectedDepartmentFilter("all")}
                      />
                    </Badge>
                  )}
                  {selectedCountryFilter !== "all" && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 transition-all duration-200 hover:scale-105"
                    >
                      Country: {selectedCountryFilter}
                      <X
                        className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setSelectedCountryFilter("all")}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Employee Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <EmployeeCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredAndSortedEmployees.length === 0 ? (
              <Card className="text-center py-12 animate-in fade-in-50 duration-300">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">No employees found</h3>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto text-pretty">
                      {employees.length === 0
                        ? "Get started by adding your first employee to the directory."
                        : "Try adjusting your search criteria or filters."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    {activeFiltersCount > 0 && (
                      <Button onClick={clearAllFilters} variant="outline" className="bg-transparent">
                        Clear Filters
                      </Button>
                    )}
                    <Button onClick={handleAddEmployee} className="transition-all duration-200 hover:scale-105">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Employee
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredAndSortedEmployees.map((employee, index) => (
                  <Card
                    key={employee.id}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in-50 slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg truncate group-hover:text-primary transition-colors">
                            {employee.name}
                          </CardTitle>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{employee.role}</p>
                        </div>
                        {employee.gradeLevel && (
                          <Badge
                            variant="secondary"
                            className="ml-2 text-xs transition-all duration-200 group-hover:scale-105"
                          >
                            {employee.gradeLevel}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="truncate">
                          <span className="font-medium">Department:</span> {employee.department}
                        </div>
                        <div className="truncate">
                          <span className="font-medium">Location:</span> {employee.state}, {employee.country}
                        </div>
                        <div className="truncate">
                          <span className="font-medium">Address:</span> {employee.address}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent transition-all duration-200 hover:scale-105"
                          onClick={() => handleViewEmployee(employee)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent transition-all duration-200 hover:scale-105"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive bg-transparent transition-all duration-200 hover:scale-105"
                          onClick={() => handleDeleteEmployee(employee)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="grades" className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Grade Level Management</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Create and manage organizational grade levels
                </p>
              </div>
              <Button onClick={handleAddGradeLevel} className="transition-all duration-200 hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                Add Grade Level
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <EmployeeCardSkeleton key={i} />
                ))}
              </div>
            ) : gradeLevels.length === 0 ? (
              <Card className="text-center py-12 animate-in fade-in-50 duration-300">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">No grade levels found</h3>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto text-pretty">
                      Create your first grade level to start organizing employees by their career progression.
                    </p>
                  </div>
                  <Button onClick={handleAddGradeLevel} className="transition-all duration-200 hover:scale-105">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Grade Level
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {gradeLevels.map((gradeLevel, index) => (
                  <Card
                    key={gradeLevel.id}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in-50 slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg flex items-center group-hover:text-primary transition-colors">
                            <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-secondary flex-shrink-0" />
                            <span className="truncate">{gradeLevel.name}</span>
                          </CardTitle>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                            {gradeLevel.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-medium">Assigned Employees:</span>
                          <Badge variant="outline" className="transition-all duration-200 group-hover:scale-105">
                            {getEmployeeCountByGradeLevel(gradeLevel.name)}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent transition-all duration-200 hover:scale-105"
                            onClick={() => handleEditGradeLevel(gradeLevel)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive bg-transparent transition-all duration-200 hover:scale-105"
                            onClick={() => handleDeleteGradeLevel(gradeLevel)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200">
            <DataManagement
              employees={employees}
              gradeLevels={gradeLevels}
              onImportData={handleImportData}
              onClearData={handleClearAllData}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showEmployeeForm} onOpenChange={setShowEmployeeForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            employee={editingEmployee}
            gradeLevels={gradeLevels}
            countries={countries}
            onSave={handleSaveEmployee}
            onCancel={() => setShowEmployeeForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEmployeeProfile} onOpenChange={setShowEmployeeProfile}>
        <DialogContent className="max-w-2xl h-[80%] overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeProfile
              employee={selectedEmployee}
              onEdit={() => {
                setShowEmployeeProfile(false)
                handleEditEmployee(selectedEmployee)
              }}
              onClose={() => setShowEmployeeProfile(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showGradeLevelForm} onOpenChange={setShowGradeLevelForm}>
        <DialogContent className="max-w-md animate-in fade-in-50 zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle>{editingGradeLevel ? "Edit Grade Level" : "Add New Grade Level"}</DialogTitle>
          </DialogHeader>
          <GradeLevelForm
            gradeLevel={editingGradeLevel}
            existingGradeLevels={gradeLevels}
            onSave={handleSaveGradeLevel}
            onCancel={() => setShowGradeLevelForm(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="animate-in fade-in-50 zoom-in-95 duration-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedEmployee?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEmployee} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showGradeLevelDeleteDialog} onOpenChange={setShowGradeLevelDeleteDialog}>
        <AlertDialogContent className="animate-in fade-in-50 zoom-in-95 duration-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Grade Level</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the grade level "{selectedGradeLevel?.name}"?
              {getEmployeeCountByGradeLevel(selectedGradeLevel?.name || "") > 0 && (
                <span className="block mt-2 text-amber-600">
                  Warning: {getEmployeeCountByGradeLevel(selectedGradeLevel?.name || "")} employee(s) are currently
                  assigned to this grade level. They will be unassigned.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGradeLevel} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
