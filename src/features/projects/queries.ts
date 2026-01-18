/**
 * Project Queries
 *
 * These are thin wrappers around the database layer.
 * In a real app, you might add caching, error handling, or data transformation here.
 */

import { db } from "@/lib/db";

export async function getProjects() {
  return db.projects.findManyWithStats();
}

export async function getProject(id: string) {
  return db.projects.findByIdWithStats(id);
}

export async function getProjectActivities(id: string) {
  return db.activities.findByProject(id);
}
