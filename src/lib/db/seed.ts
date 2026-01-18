import type { Project, Activity, DailyStats } from "@/types";
import { subDays, format } from "date-fns";

/**
 * Generate seed data for development
 */

const now = new Date();

export const seedProjects: Project[] = [
  {
    id: "proj_1",
    name: "DevPulse",
    description:
      "Developer analytics dashboard for tracking productivity metrics",
    status: "active",
    color: "#3b82f6",
    createdAt: subDays(now, 45),
    updatedAt: subDays(now, 1),
  },
  {
    id: "proj_2",
    name: "API Gateway",
    description: "Centralized API gateway with rate limiting and auth",
    status: "active",
    color: "#22c55e",
    createdAt: subDays(now, 90),
    updatedAt: subDays(now, 3),
  },
  {
    id: "proj_3",
    name: "Mobile App",
    description: "Cross-platform mobile application using React Native",
    status: "paused",
    color: "#a855f7",
    createdAt: subDays(now, 120),
    updatedAt: subDays(now, 14),
  },
  {
    id: "proj_4",
    name: "Design System",
    description: "Component library and design tokens for consistency",
    status: "completed",
    color: "#f97316",
    createdAt: subDays(now, 180),
    updatedAt: subDays(now, 30),
  },
  {
    id: "proj_5",
    name: "E-commerce Platform",
    description: "Full-featured online store with inventory management",
    status: "active",
    color: "#ec4899",
    createdAt: subDays(now, 60),
    updatedAt: subDays(now, 2),
  },
];

function generateActivities(): Activity[] {
  const activities: Activity[] = [];
  const types: Activity["type"][] = ["commit", "review", "deploy", "issue"];
  const descriptions = {
    commit: [
      "Implemented user authentication flow",
      "Fixed pagination bug in dashboard",
      "Added unit tests for API endpoints",
      "Refactored database queries for performance",
      "Updated dependencies to latest versions",
      "Added dark mode support",
      "Improved error handling in forms",
      "Optimized image loading",
    ],
    review: [
      "Reviewed PR: Add caching layer",
      "Approved PR: Fix login redirect",
      "Requested changes on PR: Update styles",
      "Reviewed PR: Refactor auth module",
    ],
    deploy: [
      "Deployed v2.1.0 to production",
      "Deployed hotfix for login issue",
      "Staged release candidate for testing",
      "Deployed database migrations",
    ],
    issue: [
      "Opened issue: Mobile responsiveness",
      "Closed issue: Memory leak in dashboard",
      "Opened issue: Add export feature",
      "Closed issue: Fix date formatting",
    ],
  };

  let activityId = 1;

  for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
    const activitiesPerDay = Math.floor(Math.random() * 8) + 2;

    for (let j = 0; j < activitiesPerDay; j++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const project =
        seedProjects[Math.floor(Math.random() * seedProjects.length)];
      const descList = descriptions[type];
      const description = descList[Math.floor(Math.random() * descList.length)];

      const timestamp = subDays(now, daysAgo);
      timestamp.setHours(
        9 + Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 60)
      );

      activities.push({
        id: `act_${activityId++}`,
        projectId: project.id,
        type,
        description,
        timestamp,
      });
    }
  }

  return activities.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

function generateDailyStats(): DailyStats[] {
  const stats: DailyStats[] = [];

  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    const date = subDays(now, daysAgo);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    stats.push({
      date: format(date, "yyyy-MM-dd"),
      commits: isWeekend
        ? Math.floor(Math.random() * 5)
        : Math.floor(Math.random() * 12) + 3,
      reviews: isWeekend
        ? Math.floor(Math.random() * 2)
        : Math.floor(Math.random() * 5) + 1,
      deploys: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0,
      hoursLogged: isWeekend
        ? Math.random() * 3
        : Math.random() * 4 + 5,
    });
  }

  return stats;
}

export const seedActivities = generateActivities();
export const seedDailyStats = generateDailyStats();
