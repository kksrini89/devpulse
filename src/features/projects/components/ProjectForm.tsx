"use client";

/**
 * Project Form (Client Component)
 *
 * Handles both create and edit scenarios.
 * Uses useActionState for form state management with Server Actions.
 */

import { useActionState, useState } from "react";
import { Button, Input, Textarea, Select } from "@/components/ui";
import { PROJECT_COLORS, PROJECT_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createProject, updateProject, type ProjectFormState } from "../actions";
import type { Project } from "@/types";

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const isEditing = !!project;

  // Color state (needed for visual feedback)
  const [selectedColor, setSelectedColor] = useState(
    project?.color || PROJECT_COLORS[0].value
  );

  // Form state with Server Action
  const [state, formAction, isPending] = useActionState<ProjectFormState, FormData>(
    isEditing
      ? (prevState, formData) => updateProject(project.id, prevState, formData)
      : createProject,
    null
  );

  // Status options for select
  const statusOptions = Object.entries(PROJECT_STATUSES).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  return (
    <form action={formAction} className="space-y-6 max-w-lg">
      {/* Form-level error */}
      {state?.errors?._form && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm dark:bg-red-900/20 dark:text-red-400">
          {state.errors._form.join(", ")}
        </div>
      )}

      {/* Name */}
      <Input
        name="name"
        label="Project Name"
        placeholder="My Awesome Project"
        defaultValue={project?.name}
        error={state?.errors?.name?.join(", ")}
        required
        disabled={isPending}
      />

      {/* Description */}
      <Textarea
        name="description"
        label="Description"
        placeholder="What is this project about?"
        defaultValue={project?.description}
        error={state?.errors?.description?.join(", ")}
        rows={3}
        disabled={isPending}
      />

      {/* Status */}
      <Select
        name="status"
        label="Status"
        options={statusOptions}
        defaultValue={project?.status || "active"}
        error={state?.errors?.status?.join(", ")}
        disabled={isPending}
      />

      {/* Color Picker */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project Color
        </label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setSelectedColor(color.value)}
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                selectedColor === color.value
                  ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                  : "hover:scale-105"
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
              disabled={isPending}
            />
          ))}
        </div>
        {/* Hidden input for form submission */}
        <input type="hidden" name="color" value={selectedColor} />
        {state?.errors?.color && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">
            {state.errors.color.join(", ")}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button type="submit" isLoading={isPending}>
          {isEditing ? "Update Project" : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
