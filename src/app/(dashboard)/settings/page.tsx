import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { Card, CardHeader, CardTitle } from "@/components/ui";
import { Settings, User, Bell, Palette } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your preferences and account settings",
};

/**
 * Settings Page (Server Component)
 *
 * Placeholder for future settings functionality.
 */
export default function SettingsPage() {
  return (
    <>
      <Header
        title="Settings"
        description="Manage your preferences and account"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <SettingsCard
          icon={<User className="h-5 w-5" />}
          title="Profile"
          description="Update your personal information and avatar"
        />
        <SettingsCard
          icon={<Bell className="h-5 w-5" />}
          title="Notifications"
          description="Configure how you receive notifications"
        />
        <SettingsCard
          icon={<Palette className="h-5 w-5" />}
          title="Appearance"
          description="Customize the look and feel of the dashboard"
        />
        <SettingsCard
          icon={<Settings className="h-5 w-5" />}
          title="Preferences"
          description="General application settings"
        />
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg dark:bg-gray-800/50">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Settings functionality coming in a future update. This page
          demonstrates the navigation and layout patterns.
        </p>
      </div>
    </>
  );
}

interface SettingsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SettingsCard({ icon, title, description }: SettingsCardProps) {
  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            {icon}
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
