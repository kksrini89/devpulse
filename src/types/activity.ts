import type { ActivityType } from "@/lib/constants";

export interface Activity {
  id: string;
  projectId: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ActivityWithProject extends Activity {
  projectName: string;
  projectColor: string;
}

export type CreateActivityInput = Omit<Activity, "id">;
