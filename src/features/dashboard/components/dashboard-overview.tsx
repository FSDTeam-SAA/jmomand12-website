"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  CircleCheck,
  Clock3,
  FileText,
  Gavel,
  Heart,
  Hourglass,
  Settings,
  TriangleAlert,
  Trophy,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardShell } from "./dashboard-shell";
import {
  useDashboardAuctionActivity,
  useDashboardInvoices,
  useDashboardProfile,
} from "../hooks/useDashboardData";
import type {
  DashboardAuctionActiveItem,
  DashboardAuctionLostItem,
  DashboardAuctionWonItem,
} from "../types";
import {
  formatCompactDate,
  formatMoney,
  formatStatusLabel,
  getTimeUntil,
} from "../utils";

type DashboardTab = "active" | "won" | "lost";

function SummaryCard({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number;
  tone: "orange" | "green" | "red";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const tones = {
    orange: {
      card: "border-[#ffb86a] bg-[#fff7ed]",
      icon: "bg-[#ffedd4] text-[#ff6900]",
      value: "text-[#ff6900]",
    },
    green: {
      card: "border-[rgba(0,166,62,0.5)] bg-[rgba(0,166,62,0.1)]",
      icon: "bg-[#dcfce7] text-[#00a63e]",
      value: "text-[#00a63e]",
    },
    red: {
      card: "border-[rgba(251,44,54,0.5)] bg-[rgba(251,44,54,0.1)]",
      icon: "bg-[#ffe2e2] text-[#fb2c36]",
      value: "text-[#fb2c36]",
    },
  } as const;

  return (
    <div className={`rounded-lg border p-5 ${tones[tone].card}`}>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded ${tones[tone].icon}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-base text-[#737373]">{label}</p>
      </div>
      <p
        className={`mt-5 text-[26px] font-bold leading-none ${tones[tone].value}`}
      >
        {value}
      </p>
    </div>
  );
}

function QuickActionCard({
  href,
  label,
  tone,
  icon: Icon,
  caption,
}: {
  href: string;
  label: string;
  tone: "orange" | "red" | "blue";
  icon: React.ComponentType<{ className?: string }>;
  caption?: string;
}) {
  const tones = {
    orange: "bg-[#ffedd4] text-[#ff6900]",
    red: "bg-[#ffe2e2] text-[#fb2c36]",
    blue: "bg-[#e0e7ff] text-[#4f46e5]",
  } as const;

  return (
    <Link
      href={href}
      className="rounded-lg border border-[#dce6f5] bg-white px-4 py-6 text-center transition hover:border-[#ffb86a] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6900]"
    >
      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-[10px] ${tones[tone]}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-sm font-medium text-[#262626]">{label}</p>
      {caption ? (
        <p className="mt-1 text-xs text-[#737373]">{caption}</p>
      ) : null}
    </Link>
  );
}

function TabButton({
  active,
  label,
  count,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition ${
        active
          ? "bg-[#ff6900] text-white"
          : "bg-[#f5f5f5] text-[#525252] hover:bg-[#fff1e7]"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <span
        className={`rounded-full px-1.5 text-xs ${active ? "bg-white/25" : "bg-[#e5e5e5]"}`}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyActivityState() {
  return (
    <div className="rounded-lg border border-[#dce6f5] bg-white px-4 py-16 text-center">
      <div className="mx-auto flex h-9 w-9 items-center justify-center text-[#d4d4d8]">
        <Gavel className="h-8 w-8" />
      </div>
      <p className="mt-4 text-base text-[#737373]">No active bids right now</p>
      <Link
        href="/category"
        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#ff6900]"
      >
        Browse Auctions
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function ActivityImage({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="h-[120px] w-[120px] overflow-hidden rounded-lg bg-[#f3f4f6]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : null}
    </div>
  );
}

function ActiveBidCard({ item }: { item: DashboardAuctionActiveItem }) {
  const statusTone = item.isLeading
    ? "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]"
    : "border-[#fecdd3] bg-[#fff1f2] text-[#dc2626]";
  const StatusIcon = item.isLeading ? CircleCheck : TriangleAlert;

  return (
    <article className="rounded-lg border border-[#dce6f5] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:border-[#b9c9df] hover:shadow-[0_16px_42px_rgba(15,23,42,0.08)] sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[112px_minmax(0,1fr)_260px] lg:items-start">
        <div className="relative overflow-hidden rounded-lg bg-[#f3f4f6] sm:h-[132px] lg:h-[112px] [&>div]:h-full [&>div]:w-full [&>div]:rounded-lg">
          <ActivityImage src={item.image} alt={item.title} />
        </div>

        <div className="min-w-0 space-y-7">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-2xl font-bold leading-tight text-[#111827]">
              {item.title}
            </h3>
            <p className="mt-1 text-base font-medium text-[#6b7280]">
              {item.category}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <Metric label="Live Bid" value={formatMoney(item.currentBid)} />
            </div>
            <div>
              <Metric
                label="Your Bid"
                value={formatMoney(item.yourBid)}
                highlight="green"
              />
            </div>
            <div>
              <Metric
                label={item.isLeading ? "Minimum Next Bid" : "Outbid By"}
                value={formatMoney(
                  item.isLeading ? item.minimumNextBid : item.outbidBy,
                )}
              />
            </div>
            <div>
              <p className="flex items-center gap-1 text-[11px] font-semibold text-[#434653]">
                <Clock3 className="h-3.5 w-3.5 text-[#6b7280]" />
                Time Left
              </p>
              <p className="mt-1 text-[20px] font-extrabold text-[#1a1b22]">
                {getTimeUntil(item.endsAt ?? undefined)}
              </p>
            </div>
            <div>
              <Metric label="Bids" value={String(item.totalBids)} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row xl:flex-col xl:items-stretch">
          <div className={`rounded-lg border px-4 py-3 ${statusTone}`}>
            <div className="flex items-start gap-3">
              <StatusIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-sm font-bold">
                  {item.isLeading
                    ? "You're the highest bidder!"
                    : "You've been outbid"}
                </p>
                <p className="mt-0.5 text-xs font-medium">
                  {item.isLeading
                    ? "No higher bids yet"
                    : "Someone has overtaken your bid"}
                </p>
              </div>
            </div>
          </div>
          <Button
            asChild
            className="h-14 flex-1 rounded-md bg-[#fe6819] text-base font-bold shadow-[0_10px_20px_rgba(254,104,25,0.25)] hover:bg-[#e45c12] xl:flex-none"
          >
            <Link
              href={
                item.productId
                  ? `/auction-details/${item.productId}`
                  : "/category"
              }
            >
              Increase Bid
            </Link>
          </Button>
          <p className="text-center text-[11px] font-medium text-[#6b7280] sm:flex-1 xl:flex-none">
            Min. increase {formatMoney(item.minimumNextBid - item.currentBid)}
          </p>
        </div>
      </div>
    </article>
  );
}

function WonCard({ item }: { item: DashboardAuctionWonItem }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#dce6f5] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:border-[#b9c9df] hover:shadow-[0_16px_42px_rgba(15,23,42,0.08)]">
      <div className="h-1 bg-[#059669]" />
      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(420px,1.15fr)_170px] xl:items-center">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="shrink-0 sm:[&>div]:h-[128px] sm:[&>div]:w-[128px] [&>div]:h-[180px] [&>div]:w-full [&>div]:rounded-lg">
            <ActivityImage src={item.image} alt={item.title} />
          </div>

          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bbf7d0] bg-[#ecfdf5] px-3 py-1 text-xs font-bold uppercase text-[#047857]">
              <Trophy className="h-3.5 w-3.5" />
              You won
            </div>
            <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-tight text-[#111827] sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-2 text-sm font-medium text-[#6b7280] sm:text-base">
              {item.category}
            </p>
          </div>
        </div>

        <div className="min-w-0 rounded-lg border border-[#e8eef7] bg-[#f8fafc] p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <Metric
                label="Winning Bid"
                value={formatMoney(item.winningBid)}
                highlight="green"
              />
            </div>
            <div className="rounded-md bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <Metric
                label="Winning Date"
                value={formatCompactDate(item.winningDate)}
              />
            </div>
            <div className="rounded-md bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <StatusMetric
                label="Payment Status"
                value={formatStatusLabel(item.paymentStatus)}
              />
            </div>
            <div className="rounded-md bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <StatusMetric
                label="Pickup Status"
                value={formatStatusLabel(item.pickupStatus)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2 xl:col-span-1 xl:flex-col">
          {item.invoiceId ? (
            <Button
              asChild
              className="h-11 flex-1 rounded-md bg-[#fe6819] font-semibold hover:bg-[#e45c12] xl:flex-none"
            >
              <Link href={`/dashboard/invoices/${item.invoiceId}`}>
                View Invoice
              </Link>
            </Button>
          ) : null}
          <Button
            asChild
            variant="outline"
            className="h-11 flex-1 rounded-md border-[#dce6f5] font-semibold text-[#1f2937] hover:border-[#ffb86a] hover:bg-[#fff7ed] hover:text-[#c2410c] xl:flex-none"
          >
            <Link href="/dashboard/invoices">Manage Pickup</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function LostCard({ item }: { item: DashboardAuctionLostItem }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#dce6f5] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:border-[#b9c9df] hover:shadow-[0_16px_42px_rgba(15,23,42,0.08)]">
      <div className="h-1 bg-[#dc2626]" />
      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(380px,1fr)_140px] xl:items-center">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="shrink-0 sm:[&>div]:h-[128px] sm:[&>div]:w-[128px] [&>div]:h-[180px] [&>div]:w-full [&>div]:rounded-lg">
            <ActivityImage src={item.image} alt={item.title} />
          </div>

          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#fecdd3] bg-[#fff1f2] px-3 py-1 text-xs font-bold text-[#dc2626]">
              <XCircle className="h-3.5 w-3.5" />
              Lost
            </div>
            <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-tight text-[#111827] sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-2 text-sm font-medium text-[#6b7280] sm:text-base">
              {item.category}
            </p>
          </div>
        </div>

        <div className="min-w-0 rounded-lg border border-[#e8eef7] bg-[#f8fafc] p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-md bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <Metric
                label="Your Final Bid"
                value={formatMoney(item.yourFinalBid)}
              />
            </div>
            <div className="rounded-md bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <Metric
                label="Winning Bid"
                value={formatMoney(item.winningBid)}
              />
            </div>
            <div className="rounded-md bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:col-span-3 xl:col-span-1">
              <Metric
                label="Ended On"
                value={formatCompactDate(item.endedOn)}
              />
            </div>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-11 rounded-md border-[#dce6f5] font-semibold text-[#1f2937] hover:border-[#ffb86a] hover:bg-[#fff7ed] hover:text-[#c2410c] lg:col-span-2 xl:col-span-1"
        >
          <Link
            href={
              item.auctionId
                ? `/#closed-auctions`
                : "/category"
            }
          >
            View Item
          </Link>
        </Button>
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "green";
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[#434653]">
        {label}
      </p>
      <p
        className={`mt-1 text-[20px] font-extrabold text-[#1a1b22] ${highlight === "green" ? "text-[#059669]" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusMetric({ label, value }: { label: string; value: string }) {
  const tone =
    value.toLowerCase().includes("paid") ||
    value.toLowerCase().includes("ready")
      ? "bg-[#ecfdf5] text-[#15803d]"
      : value.toLowerCase().includes("pending")
        ? "bg-[#fff7ed] text-[#ea580c]"
        : "bg-[#f3f4f6] text-[#4b5563]";

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[#434653]">
        {label}
      </p>
      <span
        className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${tone}`}
      >
        {value}
      </span>
    </div>
  );
}

function ActivitySection({
  tab,
  active,
  won,
  lost,
}: {
  tab: DashboardTab;
  active: DashboardAuctionActiveItem[];
  won: DashboardAuctionWonItem[];
  lost: DashboardAuctionLostItem[];
}) {
  if (tab === "active") {
    if (!active.length) return <EmptyActivityState />;
    return (
      <div className="space-y-4">
        {active.map((item) => (
          <ActiveBidCard key={item.auctionProductId} item={item} />
        ))}
      </div>
    );
  }

  if (tab === "won") {
    if (!won.length) {
      return (
        <div className="rounded-lg border border-[#dce6f5] bg-white px-4 py-16 text-center text-[#737373]">
          No won auctions yet.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {won.map((item) => (
          <WonCard key={item.auctionProductId} item={item} />
        ))}
      </div>
    );
  }

  if (!lost.length) {
    return (
      <div className="rounded-lg border border-[#dce6f5] bg-white px-4 py-16 text-center text-[#737373]">
        No lost auctions yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lost.map((item) => (
        <LostCard key={item.auctionProductId} item={item} />
      ))}
    </div>
  );
}

export function DashboardOverview() {
  const profile = useDashboardProfile();
  const auctionActivity = useDashboardAuctionActivity();
  const invoices = useDashboardInvoices();
  const [tab, setTab] = useState<DashboardTab>("active");
  const [notifications, setNotifications] = useState({
    losing: true,
    winning: true,
  });

  const isLoading =
    profile.isLoading || auctionActivity.isLoading || invoices.isLoading;

  const invoiceCount = useMemo(
    () => invoices.data?.length ?? 0,
    [invoices.data],
  );

  if (isLoading) {
    return (
      <DashboardShell
        title="My Dashboard"
        description="Preparing your auction activity and invoice summary."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[129px] rounded-lg" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[117px] rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[280px] rounded-lg" />
        <Skeleton className="h-[100px] rounded-lg" />
      </DashboardShell>
    );
  }

  if (
    profile.isError ||
    auctionActivity.isError ||
    invoices.isError ||
    !profile.data ||
    !auctionActivity.data
  ) {
    return (
      <DashboardShell
        title="My Dashboard"
        description="We couldn't load your dashboard activity right now."
      >
        <div className="rounded-lg border border-[#fecaca] bg-[#fff7f7] p-6 text-[#991b1b]">
          Please refresh and try again.
        </div>
      </DashboardShell>
    );
  }

  const { summary, active, won, lost } = auctionActivity.data;
  const welcomeName =
    profile.data.firstName || profile.data.lastName
      ? `${profile.data.firstName ?? ""} ${profile.data.lastName ?? ""}`.trim()
      : profile.data.email;

  return (
    <DashboardShell
      title="My Dashboard"
      description={`Welcome back, ${welcomeName}`}
      action={
        <Button
          asChild
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full border border-transparent text-[#171717] hover:bg-white"
        >
          <Link href="/dashboard/profile" aria-label="Open account settings">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            label="Active Bids"
            value={summary.active}
            tone="orange"
            icon={Gavel}
          />
          <SummaryCard
            label="Won"
            value={summary.won}
            tone="green"
            icon={Trophy}
          />
          <SummaryCard
            label="Lost"
            value={summary.lost}
            tone="red"
            icon={XCircle}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <QuickActionCard
            href="/category"
            label="Auctions"
            tone="orange"
            icon={Gavel}
            caption="Browse live lots"
          />
          <QuickActionCard
            href="/dashboard/wishlist"
            label="Wishlist"
            tone="red"
            icon={Heart}
            caption="Saved items"
          />
          <QuickActionCard
            href="/dashboard/invoices"
            label="Invoices"
            tone="blue"
            icon={FileText}
            caption={`${invoiceCount} total`}
          />
        </div>

        <div className="border-b border-[#dce6f5] pb-2">
          <div className="flex flex-wrap gap-3">
            <TabButton
              active={tab === "active"}
              label="Active Bids"
              count={summary.active}
              icon={Gavel}
              onClick={() => setTab("active")}
            />
            <TabButton
              active={tab === "won"}
              label="Won"
              count={summary.won}
              icon={Hourglass}
              onClick={() => setTab("won")}
            />
            <TabButton
              active={tab === "lost"}
              label="Lost"
              count={summary.lost}
              icon={TriangleAlert}
              onClick={() => setTab("lost")}
            />
          </div>
        </div>

        <ActivitySection tab={tab} active={active} won={won} lost={lost} />

        <section className="rounded-lg border border-[#dce6f5] bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-[#171717]">
                My History
              </h2>
              <p className="mt-1 text-base text-[#737373]">
                View and manage your previous activities, records, and
                interactions in one place.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-[10px] border-[rgba(0,0,0,0.1)]"
            >
              <Link href="/dashboard/invoices">View All</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-[#dce6f5] bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#ff6900]" />
              <h2 className="text-[18px] font-semibold text-[#171717]">
                Notification Preferences
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-[10px] border-[#ffb86a] text-[#ff6900] hover:text-[#ff6900]"
            >
              <Link href="/dashboard/profile">Manage All</Link>
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {[
              {
                key: "losing" as const,
                title: "Losing Alerts",
                description: "Notify me when I'm losing on an item",
              },
              {
                key: "winning" as const,
                title: "Win Alerts",
                description: "Notify me when I win an auction",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-[10px] bg-[#fafafa] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#ffedd4] text-[#ff6900]">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#171717]">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#737373]">{item.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications[item.key]}
                  onClick={() => {
                    setNotifications((current) => ({
                      ...current,
                      [item.key]: !current[item.key],
                    }));
                    toast.success(
                      `${item.title} ${notifications[item.key] ? "disabled" : "enabled"}.`,
                    );
                  }}
                  className={`relative h-6 w-11 rounded-full transition ${
                    notifications[item.key] ? "bg-[#ff8904]" : "bg-[#d4d4d8]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      notifications[item.key] ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-[#94a3b8]">
            Notification toggles are currently local UI controls until a
            preference API is added.
          </p>
        </section>
      </div>
    </DashboardShell>
  );
}
