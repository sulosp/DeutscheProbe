"use client";

import { DashboardView } from "@/components/dashboard/dashboard-view";
import { findTrack } from "@/content";
import { useAppState } from "@/lib/storage";

export default function OverviewPage() {
  const { profile } = useAppState();
  if (!profile) return null;
  return <DashboardView track={findTrack(profile.exam, profile.level)} />;
}
