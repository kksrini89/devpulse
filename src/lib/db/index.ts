/**
 * In-memory database with simulated async operations.
 *
 * This abstraction allows us to:
 * 1. Focus on Next.js patterns without DB setup
 * 2. Easily swap to a real database later
 * 3. Simulate realistic async behavior
 */

import type {
  Project,
  Activity,
  DailyStats,
  CreateProjectInput,
  UpdateProjectInput,
  ActivityWithProject,
  ProjectWithStats,
} from "@/types";
import { seedProjects, seedActivities, seedDailyStats } from "./seed";

// In-memory stores
const projects = new Map<string, Project>(
  seedProjects.map((p) => [p.id, p])
);
const activities = new Map<string, Activity>(
  seedActivities.map((a) => [a.id, a])
);
const dailyStats = new Map<string, DailyStats>(
  seedDailyStats.map((s) => [s.date, s])
);

// Simulate network delay
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// Projects
// ============================================

export async function getProjects(): Promise<Project[]> {
  await delay();
  return Array.from(projects.values()).sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );
}

export async function getProjectsWithStats(): Promise<ProjectWithStats[]> {
  await delay();
  const allProjects = Array.from(projects.values());
  const allActivities = Array.from(activities.values());

  return allProjects
    .map((project) => {
      const projectActivities = allActivities.filter(
        (a) => a.projectId === project.id
      );
      const commits = projectActivities.filter((a) => a.type === "commit");
      const lastActivity = projectActivities[0]?.timestamp || null;

      return {
        ...project,
        totalCommits: commits.length,
        totalHours: Math.round(Math.random() * 100 + 20), // Mock hours
        lastActivity,
      };
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getProject(id: string): Promise<Project | null> {
  await delay();
  return projects.get(id) || null;
}

export async function getProjectWithStats(
  id: string
): Promise<ProjectWithStats | null> {
  await delay();
  const project = projects.get(id);
  if (!project) return null;

  const projectActivities = Array.from(activities.values()).filter(
    (a) => a.projectId === id
  );
  const commits = projectActivities.filter((a) => a.type === "commit");
  const lastActivity = projectActivities[0]?.timestamp || null;

  return {
    ...project,
    totalCommits: commits.length,
    totalHours: Math.round(Math.random() * 100 + 20),
    lastActivity,
  };
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  await delay();
  const id = `proj_${Date.now()}`;
  const now = new Date();

  const project: Project = {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  projects.set(id, project);
  return project;
}

export async function updateProject(
  id: string,
  data: UpdateProjectInput
): Promise<Project | null> {
  await delay();
  const existing = projects.get(id);
  if (!existing) return null;

  const updated: Project = {
    ...existing,
    ...data,
    updatedAt: new Date(),
  };

  projects.set(id, updated);
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  await delay();
  return projects.delete(id);
}

// ============================================
// Activities
// ============================================

export async function getActivities(limit: number = 50): Promise<Activity[]> {
  await delay();
  return Array.from(activities.values())
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

export async function getActivitiesWithProject(
  limit: number = 50
): Promise<ActivityWithProject[]> {
  await delay();
  const allActivities = Array.from(activities.values())
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);

  return allActivities.map((activity) => {
    const project = projects.get(activity.projectId);
    return {
      ...activity,
      projectName: project?.name || "Unknown",
      projectColor: project?.color || "#gray",
    };
  });
}

export async function getActivitiesByProject(
  projectId: string
): Promise<Activity[]> {
  await delay();
  return Array.from(activities.values())
    .filter((a) => a.projectId === projectId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// ============================================
// Analytics / Stats
// ============================================

export async function getDailyStats(days: number = 30): Promise<DailyStats[]> {
  await delay();
  return Array.from(dailyStats.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-days);
}

export async function getOverviewStats(): Promise<{
  totalProjects: number;
  activeProjects: number;
  totalCommits: number;
  totalHours: number;
  recentActivities: number;
}> {
  await delay();
  const allProjects = Array.from(projects.values());
  const allActivities = Array.from(activities.values());
  const allStats = Array.from(dailyStats.values());

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return {
    totalProjects: allProjects.length,
    activeProjects: allProjects.filter((p) => p.status === "active").length,
    totalCommits: allActivities.filter((a) => a.type === "commit").length,
    totalHours: Math.round(
      allStats.reduce((sum, s) => sum + s.hoursLogged, 0)
    ),
    recentActivities: allActivities.filter(
      (a) => a.timestamp >= sevenDaysAgo
    ).length,
  };
}

// ============================================
// Export all as db object for convenience
// ============================================

export const db = {
  projects: {
    findMany: getProjects,
    findManyWithStats: getProjectsWithStats,
    findById: getProject,
    findByIdWithStats: getProjectWithStats,
    create: createProject,
    update: updateProject,
    delete: deleteProject,
  },
  activities: {
    findMany: getActivities,
    findManyWithProject: getActivitiesWithProject,
    findByProject: getActivitiesByProject,
  },
  stats: {
    getDaily: getDailyStats,
    getOverview: getOverviewStats,
  },
};
