import type { ProjectStatus } from "@/lib/constants";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithStats extends Project {
  totalCommits: number;
  totalHours: number;
  lastActivity: Date | null;
}

export type CreateProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type UpdateProjectInput = Partial<CreateProjectInput>;
