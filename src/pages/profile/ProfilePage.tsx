import { useState } from "react";
import { Phone, Plus, Settings as SettingsIcon } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WSIScore } from "@/components/shared/WSIScore";
import { LOCATION_CATEGORY_ICON } from "@/features/destination-search/components/LocationIcon";
import { SAVED_LOCATIONS } from "@/features/destination-search/mockData";
import { TrustedContactItem } from "@/features/profile/components/TrustedContactItem";
import { SettingsRow } from "@/features/profile/components/SettingsRow";
import { CURRENT_USER, TRUSTED_CONTACTS, EMERGENCY_CONTACT, JOURNEY_HISTORY } from "@/features/profile/mockData";
import { formatRelativeTime, formatDistanceKm } from "@/utils/formatting";

const INITIAL_SETTINGS = [
  { key: "shareLocation", title: "Share live location during journeys", description: "Trusted contacts can see your live location while Journey Mode is active." },
  { key: "reportAlerts", title: "Nearby report alerts", description: "Get notified when a new community report is filed near your saved places." },
  { key: "autoEmergency", title: "Auto-alert emergency contact", description: "Automatically notify your emergency contact if a journey isn't completed on time." },
];

export default function ProfilePage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    shareLocation: true,
    reportAlerts: true,
    autoEmergency: false,
  });

  const initials = CURRENT_USER.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <PageWrapper className="py-0">
      <SectionHeader title="Profile" description="Manage your account, contacts, and preferences." />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card>
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-xl font-semibold text-primary-300">
                {initials}
              </span>
              <div>
                <h2 className="text-lg font-semibold text-neutral-50">{CURRENT_USER.name}</h2>
                <p className="text-sm text-neutral-500">{CURRENT_USER.email}</p>
                <p className="mt-1 text-xs text-neutral-600">Member since {CURRENT_USER.memberSince}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Trusted contacts</CardTitle>
                <CardDescription>People notified during an emergency alert</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus size={14} />
                Add
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {TRUSTED_CONTACTS.map((contact) => (
                <TrustedContactItem key={contact.id} contact={contact} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Journey history</CardTitle>
                <CardDescription>Your past trips and their safety scores</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
              {JOURNEY_HISTORY.map((journey) => (
                <div key={journey.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-100">{journey.destinationName}</p>
                    <p className="text-xs text-neutral-500">
                      {formatRelativeTime(journey.date)} · {formatDistanceKm(journey.distanceKm)}
                    </p>
                  </div>
                  <WSIScore score={journey.wsi} size="sm" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Preferences for safety and privacy</CardDescription>
              </div>
              <SettingsIcon className="text-neutral-500" size={18} />
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
              {INITIAL_SETTINGS.map((setting) => (
                <SettingsRow
                  key={setting.key}
                  title={setting.title}
                  description={setting.description}
                  checked={settings[setting.key]}
                  onChange={(checked) => setSettings((prev) => ({ ...prev, [setting.key]: checked }))}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Emergency contact</CardTitle>
                <CardDescription>Notified first during SOS</CardDescription>
              </div>
              <Badge variant="risk">Priority</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-risk-500/10 text-red-400">
                  <Phone size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-neutral-100">{EMERGENCY_CONTACT.name}</p>
                  <p className="text-xs text-neutral-500">{EMERGENCY_CONTACT.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Saved places</CardTitle>
                <CardDescription>Quick destinations</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {SAVED_LOCATIONS.map((loc) => {
                const Icon = LOCATION_CATEGORY_ICON[loc.category];
                return (
                  <div key={loc.id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-[var(--color-bg-surface-raised)]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary-500/10 text-primary-400">
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-neutral-100">{loc.name}</p>
                      <p className="truncate text-xs text-neutral-500">{loc.address}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
