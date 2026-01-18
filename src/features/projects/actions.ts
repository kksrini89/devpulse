"use server";

/**
 * Project Server Actions
 *
 * These functions run on the server and can be called from Client Components.
 * They handle all project mutations (create, update, delete).
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import type { ProjectStatus } from "@/lib/constants";

// Validation schema
const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .default(""),
  status: z.enum(["active", "paused", "completed"] as const),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Invalid color format"),
});

export type ProjectFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    status?: string[];
    color?: string[];
    _form?: string[];
  };
  success?: boolean;
} | null;

/**
 * Create a new project
 */
export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  // Extract form data
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status"),
    color: formData.get("color"),
  };

  // Validate
  const validated = ProjectSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Create project
    await db.projects.create({
      name: validated.data.name,
      description: validated.data.description || "",
      status: validated.data.status as ProjectStatus,
      color: validated.data.color,
    });
  } catch (error) {
    return {
      errors: {
        _form: ["Failed to create project. Please try again."],
      },
    };
  }

  // Revalidate and redirect
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/projects");
}

/**
 * Update an existing project
 */
export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  // Extract form data
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status"),
    color: formData.get("color"),
  };

  // Validate
  const validated = ProjectSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const updated = await db.projects.update(id, {
      name: validated.data.name,
      description: validated.data.description || "",
      status: validated.data.status as ProjectStatus,
      color: validated.data.color,
    });

    if (!updated) {
      return {
        errors: {
          _form: ["Project not found."],
        },
      };
    }
  } catch (error) {
    return {
      errors: {
        _form: ["Failed to update project. Please try again."],
      },
    };
  }

  // Revalidate and redirect
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/");
  redirect("/projects");
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<{ error?: string }> {
  try {
    const deleted = await db.projects.delete(id);

    if (!deleted) {
      return { error: "Project not found." };
    }
  } catch (error) {
    return { error: "Failed to delete project." };
  }

  // Revalidate and redirect
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/projects");
}
