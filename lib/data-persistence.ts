import type { Employee, GradeLevel } from "@/app/page"

export interface AppData {
  employees: Employee[]
  gradeLevels: GradeLevel[]
  version: string
  exportDate: string
}

const STORAGE_KEYS = {
  EMPLOYEES: "staff-directory-employees",
  GRADE_LEVELS: "staff-directory-grade-levels",
  BACKUP: "staff-directory-backup",
  VERSION: "staff-directory-version",
} as const

const CURRENT_VERSION = "1.0.0"

export class DataPersistence {
  static validateEmployee(employee: any): employee is Employee {
    return (
      typeof employee === "object" &&
      employee !== null &&
      typeof employee.id === "string" &&
      typeof employee.name === "string" &&
      typeof employee.country === "string" &&
      typeof employee.state === "string" &&
      typeof employee.address === "string" &&
      typeof employee.role === "string" &&
      typeof employee.department === "string" &&
      (employee.gradeLevel === undefined || typeof employee.gradeLevel === "string") &&
      (employee.email === undefined || typeof employee.email === "string") &&
      (employee.phone === undefined || typeof employee.phone === "string")
    )
  }

  static validateGradeLevel(gradeLevel: any): gradeLevel is GradeLevel {
    return (
      typeof gradeLevel === "object" &&
      gradeLevel !== null &&
      typeof gradeLevel.id === "string" &&
      typeof gradeLevel.name === "string" &&
      (gradeLevel.description === undefined || typeof gradeLevel.description === "string")
    )
  }

  static safeParseJSON<T>(jsonString: string | null, validator?: (data: any) => data is T): T | null {
    if (!jsonString) return null

    try {
      const parsed = JSON.parse(jsonString)
      if (validator && !validator(parsed)) {
        console.warn("Data validation failed, returning null")
        return null
      }
      return parsed
    } catch (error) {
      console.error("Failed to parse JSON:", error)
      return null
    }
  }

  static loadEmployees(): Employee[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES)
      const employees = this.safeParseJSON(saved)

      if (Array.isArray(employees)) {
        return employees.filter(this.validateEmployee)
      }
      return []
    } catch (error) {
      console.error("Failed to load employees:", error)
      return []
    }
  }

  static loadGradeLevels(): GradeLevel[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GRADE_LEVELS)
      const gradeLevels = this.safeParseJSON(saved)

      if (Array.isArray(gradeLevels)) {
        return gradeLevels.filter(this.validateGradeLevel)
      }

      // Return default grade levels if none exist
      const defaultGradeLevels = [
        { id: "1", name: "LVL1", description: "Entry Level" },
        { id: "2", name: "LVL2", description: "Junior Level" },
        { id: "3", name: "LVL3", description: "Senior Level" },
      ]
      this.saveGradeLevels(defaultGradeLevels)
      return defaultGradeLevels
    } catch (error) {
      console.error("Failed to load grade levels:", error)
      return []
    }
  }

  static saveEmployees(employees: Employee[]): boolean {
    try {
      const validEmployees = employees.filter(this.validateEmployee)
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(validEmployees))
      this.createBackup(validEmployees, this.loadGradeLevels())
      return true
    } catch (error) {
      console.error("Failed to save employees:", error)
      return false
    }
  }

  static saveGradeLevels(gradeLevels: GradeLevel[]): boolean {
    try {
      const validGradeLevels = gradeLevels.filter(this.validateGradeLevel)
      localStorage.setItem(STORAGE_KEYS.GRADE_LEVELS, JSON.stringify(validGradeLevels))
      this.createBackup(this.loadEmployees(), validGradeLevels)
      return true
    } catch (error) {
      console.error("Failed to save grade levels:", error)
      return false
    }
  }

  static createBackup(employees: Employee[], gradeLevels: GradeLevel[]): void {
    try {
      const backup: AppData = {
        employees,
        gradeLevels,
        version: CURRENT_VERSION,
        exportDate: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backup))
    } catch (error) {
      console.error("Failed to create backup:", error)
    }
  }

  static exportData(employees: Employee[], gradeLevels: GradeLevel[]): string {
    const data: AppData = {
      employees,
      gradeLevels,
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  static importData(jsonString: string): { employees: Employee[]; gradeLevels: GradeLevel[] } | null {
    try {
      const data = JSON.parse(jsonString) as AppData

      if (!data.employees || !data.gradeLevels) {
        throw new Error("Invalid data format")
      }

      const validEmployees = Array.isArray(data.employees) ? data.employees.filter(this.validateEmployee) : []
      const validGradeLevels = Array.isArray(data.gradeLevels) ? data.gradeLevels.filter(this.validateGradeLevel) : []

      return {
        employees: validEmployees,
        gradeLevels: validGradeLevels,
      }
    } catch (error) {
      console.error("Failed to import data:", error)
      return null
    }
  }

  static clearAllData(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEYS.EMPLOYEES)
      localStorage.removeItem(STORAGE_KEYS.GRADE_LEVELS)
      localStorage.removeItem(STORAGE_KEYS.BACKUP)
      return true
    } catch (error) {
      console.error("Failed to clear data:", error)
      return false
    }
  }

  static getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      let used = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }

      // Rough estimate of localStorage limit (usually 5-10MB)
      const available = 5 * 1024 * 1024 // 5MB
      const percentage = (used / available) * 100

      return { used, available, percentage }
    } catch (error) {
      console.error("Failed to get storage info:", error)
      return { used: 0, available: 0, percentage: 0 }
    }
  }
}
