import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Plus, Settings as SettingsIcon, LogOut, FileText } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WSIScore } from "@/components/shared/WSIScore";
import { LOCATION_CATEGORY_ICON } from "@/features/destination-search/components/LocationIcon";
import { useSavedPlaces } from "@/features/destination-search/api/useSavedPlaces";
import { TrustedContactItem } from "@/features/profile/components/TrustedContactItem";
import { AddTrustedContactForm } from "@/features/profile/components/AddTrustedContactForm";
import { SettingsRow } from "@/features/profile/components/SettingsRow";
import { useMyProfile, useMyContributionCount, useTrustedContacts } from "@/features/profile/api/useProfile";
import { useJourneyHistory } from "@/features/journey-mode/api/useJourneys";
import { useAuth } from "@/contexts/AuthContext";
import { formatRelativeTime, formatDistanceKm } from "@/utils/formatting";
import { ROUTES } from "@/routes/paths";

const INITIAL_SETTINGS = [
  { key: "shareLocation", title: "Share live location during journeys", description: "Trusted contacts can see your live location while Journey Mode is active." },
  { key: "reportAlerts", title: "Nearby report alerts", description: "Get notified when a new community report is filed near your saved places." },
  { key: "autoEmergency", title: "Auto-alert emergency contact", description: "Automatically notify your emergency contact if a journey isn't completed on time." },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: contributionCount } = useMyContributionCount();
  const { data: trustedContacts, isLoading: contactsLoading } = useTrustedContacts();
  const { data: journeyHistory, isLoading: journeysLoading } = useJourneyHistory(5);
  const { data: savedPlaces, isLoading: placesLoading } = useSavedPlaces();

  const [settings, setSettings] = useState<Record<string, boolean>>({
    shareLocation: true,
    reportAlerts: true,
    autoEmergency: false,
  });
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Your account";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const memberSince = profile?.member_since
    ? new Date(profile.member_since).toLocaleDateString(undefined, { month: "short", year: "numeric" })
    : "—";

  const emergencyContact = trustedContacts?.find((c) => c.is_emergency_contact) ?? trustedContacts?.[0] ?? null;

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.HOME);
  };

  return (
    <PageWrapper className="py-0">
      <SectionHeader
        title="Profile"
        description="Manage your account, contacts, and preferences."
        action={
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut size={14} />
            Log out
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-xl font-semibold text-primary-300">
                  {initials}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-50">{displayName}</h2>
                  <p className="text-sm text-neutral-500">{profile?.email ?? user?.email}</p>
                  <p className="mt-1 text-xs text-neutral-600">Member since {memberSince}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-white/[0.02] px-3.5 py-2.5">
                <FileText size={16} className="text-primary-300" />
                <div>
                  <p className="text-sm font-semibold text-neutral-50">{contributionCount ?? 0}</p>
                  <p className="text-[11px] text-neutral-500">reports filed</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Trusted contacts</CardTitle>
                <CardDescription>People notified during an emergency alert</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsAddContactOpen(true)}>
                <Plus size={14} />
                Add
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {contactsLoading ? (
                <LoadingSpinner size="sm" label="Loading contacts" />
              ) : !trustedContacts || trustedContacts.length === 0 ? (
                <p className="text-sm text-neutral-500">No trusted contacts added yet.</p>
              ) : (
                trustedContacts.map((contact) => (
                  <TrustedContactItem
                    key={contact.id}
                    contact={{ id: contact.id, name: contact.name, relation: contact.relation, phone: contact.phone, email: contact.email }}
                  />
                ))
              )}
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
              {journeysLoading ? (
                <LoadingSpinner size="sm" label="Loading journey history" />
              ) : !journeyHistory || journeyHistory.length === 0 ? (
                <p className="text-sm text-neutral-500">No journeys yet — start one from Journey Mode.</p>
              ) : (
                journeyHistory.map((journey) => (
                  <div key={journey.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-100">{journey.destination_name}</p>
                      <p className="text-xs text-neutral-500">
                        {formatRelativeTime(journey.started_at)} · {formatDistanceKm(Number(journey.distance_km))}
                        {journey.status !== "completed" && ` · ${journey.status}`}
                      </p>
                    </div>
                    <WSIScore score={journey.wsi_score} size="sm" />
                  </div>
                ))
              )}
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
              {!emergencyContact ? (
                <p className="text-sm text-neutral-500">Add a trusted contact to set an emergency contact.</p>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-risk-500/10 text-red-400">
                    <Phone size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-100">{emergencyContact.name}</p>
                    <p className="text-xs text-neutral-500">{emergencyContact.phone}</p>
                  </div>
                </div>
              )}
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
              {placesLoading ? (
                <LoadingSpinner size="sm" label="Loading saved places" />
              ) : !savedPlaces || savedPlaces.length === 0 ? (
                <p className="text-sm text-neutral-500">No saved places yet.</p>
              ) : (
                savedPlaces.map((loc) => {
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
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal isOpen={isAddContactOpen} onClose={() => setIsAddContactOpen(false)} title="Add trusted contact">
        <AddTrustedContactForm onSubmitted={() => setIsAddContactOpen(false)} />
      </Modal>
    </PageWrapper>
  );
}
