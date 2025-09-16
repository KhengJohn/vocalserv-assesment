"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GradeLevel } from "@/app/page";

interface GradeLevelFormProps {
  gradeLevel?: GradeLevel;
  existingGradeLevels: GradeLevel[];
  onSave: (gradeLevel: GradeLevel) => void;
  onCancel: () => void;
}

export function GradeLevelForm({
  gradeLevel,
  existingGradeLevels,
  onSave,
  onCancel,
}: GradeLevelFormProps) {
  const [formData, setFormData] = useState({
    name: gradeLevel?.name || "",
    description: gradeLevel?.description || "",
    itemCode: gradeLevel?.itemCode || "",
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Grade level name is required";
    } else if (
      existingGradeLevels.some(
        (grade) =>
          grade.name.toLowerCase() === formData.name.toLowerCase() &&
          grade.id !== gradeLevel?.id
      )
    ) {
      newErrors.name = "A grade level with this name already exists";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const gradeLevelData: GradeLevel = {
      id: gradeLevel?.id || Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      itemCode: formData.itemCode.trim() || "",
    };

    onSave(gradeLevelData);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Grade Level Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., LVL1, Senior, Manager"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="name">Grade Item Code *</Label>
          <Input
            id="itemCode"
            value={formData.itemCode}
            onChange={(e) =>
              setFormData({ ...formData, itemCode: e.target.value })
            }
            placeholder="e.g., 0123, 0627, 0322"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description of this grade level..."
            rows={3}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1">
            {gradeLevel ? "Update Grade Level" : "Add Grade Level"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
