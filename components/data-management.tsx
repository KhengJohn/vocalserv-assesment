"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, Trash2, Database, AlertTriangle, CheckCircle } from "lucide-react"
import { DataPersistence } from "@/lib/data-persistence"
import type { Employee, GradeLevel } from "@/app/page"

interface DataManagementProps {
  employees: Employee[]
  gradeLevels: GradeLevel[]
  onImportData: (employees: Employee[], gradeLevels: GradeLevel[]) => void
  onClearData: () => void
}

export function DataManagement({ employees, gradeLevels, onImportData, onClearData }: DataManagementProps) {
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importData, setImportData] = useState("")
  const [importError, setImportError] = useState("")
  const [importSuccess, setImportSuccess] = useState(false)

  const storageInfo = DataPersistence.getStorageInfo()

  const handleExport = () => {
    const data = DataPersistence.exportData(employees, gradeLevels)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `staff-directory-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    setImportError("")
    setImportSuccess(false)

    if (!importData.trim()) {
      setImportError("Please paste your backup data")
      return
    }

    const result = DataPersistence.importData(importData)
    if (result) {
      onImportData(result.employees, result.gradeLevels)
      setImportSuccess(true)
      setImportData("")
      setTimeout(() => {
        setShowImportDialog(false)
        setImportSuccess(false)
      }, 2000)
    } else {
      setImportError("Invalid backup data format. Please check your data and try again.")
    }
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setImportData(content)
      }
      reader.readAsText(file)
    }
  }

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      if (DataPersistence.clearAllData()) {
        onClearData()
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Storage Usage</Label>
              <Progress value={storageInfo.percentage} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {(storageInfo.used / 1024).toFixed(1)} KB used of {(storageInfo.available / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>

            <div className="space-y-2">
              <Label>Data Summary</Label>
              <div className="text-sm space-y-1">
                <div>Employees: {employees.length}</div>
                <div>Grade Levels: {gradeLevels.length}</div>
                <div>Last Updated: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport} variant="outline" className="bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>

            <Button onClick={() => setShowImportDialog(true)} variant="outline" className="bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>

            <Button
              onClick={handleClearAllData}
              variant="outline"
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive bg-transparent"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>

          {storageInfo.percentage > 80 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Storage is {storageInfo.percentage.toFixed(1)}% full. Consider exporting and clearing old data.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-import">Import from File</Label>
              <Input id="file-import" type="file" accept=".json" onChange={handleFileImport} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="data-textarea">Or Paste Backup Data</Label>
              <Textarea
                id="data-textarea"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your exported JSON data here..."
                rows={10}
                className="mt-1 font-mono text-sm"
              />
            </div>

            {importError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}

            {importSuccess && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Data imported successfully!</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={handleImport} disabled={!importData.trim() || importSuccess}>
                Import Data
              </Button>
              <Button variant="outline" onClick={() => setShowImportDialog(false)} className="bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
