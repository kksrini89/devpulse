export interface DailyStats {
  date: string; // ISO date string (YYYY-MM-DD)
  commits: number;
  reviews: number;
  deploys: number;
  hoursLogged: number;
}

export interface PeriodSummary {
  totalCommits: number;
  totalReviews: number;
  totalDeploys: number;
  totalHours: number;
  avgCommitsPerDay: number;
  avgHoursPerDay: number;
  mostActiveDay: string;
  commitsTrend: number; // percentage change from previous period
  hoursTrend: number;
}

export interface ProjectBreakdown {
  projectId: string;
  projectName: string;
  projectColor: string;
  commits: number;
  hours: number;
  percentage: number;
}
