"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  CalendarRange,
  PackageSearch,
  Clock,
  Calendar,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardShell } from "./dashboard-shell";
import { getPickupSchedule } from "../api/dashboard.api";
import {
  useCreatePickupScheduleRequest,
  useDashboardAppointments,
  useDashboardInvoices,
  useDashboardPickupRequests,
  useDashboardProfile,
  useDashboardReadyInvoices,
} from "../hooks/useDashboardData";
import type { PickupSchedule } from "../types";
import {
  formatDateTime,
  formatMoney,
  formatSlotWindow,
  mapOrders,
} from "../utils";

const PAGE_SIZE = 6;

type FilterKey = "all" | "ready" | "scheduled" | "completed";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getPickupCalendarDays(schedule: PickupSchedule) {
  const rangeStart = startOfDay(parseISO(schedule.startDate));
  const rangeEnd = endOfDay(parseISO(schedule.endDate));
  const calendarStart = startOfWeek(startOfMonth(rangeStart));
  const calendarEnd = endOfWeek(endOfMonth(rangeEnd));

  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  }).map((day) => ({
    date: day,
    isCurrentMonth: isSameMonth(day, rangeStart) || isSameMonth(day, rangeEnd),
    isStart: isSameDay(day, rangeStart),
    isEnd: isSameDay(day, rangeEnd),
    isAvailable: isWithinInterval(day, {
      start: rangeStart,
      end: rangeEnd,
    }),
  }));
}

export function DashboardOrdersPage() {
  const profile = useDashboardProfile();
  const invoices = useDashboardInvoices();
  const appointments = useDashboardAppointments();
  const pickupRequests = useDashboardPickupRequests();
  const readyInvoices = useDashboardReadyInvoices();
  const createPickupRequest = useCreatePickupScheduleRequest();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterKey>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<PickupSchedule | null>(null);
  const [activeInvoiceNumber, setActiveInvoiceNumber] = useState<string | null>(
    null,
  );
  const [activeAuctionId, setActiveAuctionId] = useState<string | null>(null);
  const [selectedPickupDate, setSelectedPickupDate] = useState("");
  const [selectedPickupTime, setSelectedPickupTime] = useState("");

  const orders = useMemo(
    () => mapOrders(invoices.data, appointments.data, pickupRequests.data),
    [appointments.data, invoices.data, pickupRequests.data],
  );

  const filteredOrders = useMemo(() => {
    switch (filter) {
      case "ready":
        return orders.filter((order) => order.pickupActionable);
      case "scheduled":
        return orders.filter(
          (order) =>
            order.appointment?.status === "scheduled" ||
            order.pickupRequest?.status === "requested" ||
            order.pickupRequest?.status === "approved" ||
            order.pickupRequest?.status === "scheduled",
        );
      case "completed":
        return orders.filter(
          (order) =>
            order.appointment?.status === "completed" ||
            order.pickupRequest?.status === "completed",
        );
      default:
        return orders;
    }
  }, [filter, orders]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const isLoading =
    profile.isLoading ||
    invoices.isLoading ||
    appointments.isLoading ||
    pickupRequests.isLoading ||
    readyInvoices.isLoading;
  const isError =
    profile.isError ||
    invoices.isError ||
    appointments.isError ||
    pickupRequests.isError ||
    readyInvoices.isError;

  // Handler to fetch schedule and open modal
  const handleOpenScheduleModal = async (
    auctionId: string | undefined,
    invoiceNum: string,
  ) => {
    setActiveInvoiceNumber(invoiceNum);
    setIsModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    setScheduleData(null);
    setActiveAuctionId(auctionId ?? null);
    setSelectedPickupDate("");
    setSelectedPickupTime("");

    try {
      if (!auctionId) {
        throw new Error("Auction information is missing for this invoice.");
      }

      const data = await getPickupSchedule(auctionId);
      setScheduleData(data);
      setSelectedPickupDate(format(parseISO(data.startDate), "yyyy-MM-dd"));
      setSelectedPickupTime(data.dailyStartTime);
    } catch (err: unknown) {
      const apiMessage =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : null;
      const errorMessage =
        apiMessage ??
        (err instanceof Error
          ? err.message
          : "An error occurred while loading schedule.");
      setModalError(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setScheduleData(null);
    setModalError(null);
    setActiveAuctionId(null);
    setSelectedPickupDate("");
    setSelectedPickupTime("");
  };

  const handleSubmitPickupRequest = async () => {
    if (!profile.data?._id || !activeAuctionId) {
      toast.error("We couldn't prepare this pickup request.");
      return;
    }

    if (!selectedPickupDate || !selectedPickupTime) {
      toast.error("Please select a pickup date and time.");
      return;
    }

    try {
      await createPickupRequest.mutateAsync({
        userId: profile.data._id,
        auctionId: activeAuctionId,
        pickupDate: selectedPickupDate,
        pickupTime: selectedPickupTime,
      });
      toast.success("Pickup request submitted.");
      closeModal();
    } catch (err: unknown) {
      const apiMessage =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : null;

      toast.error(
        apiMessage ??
          (err instanceof Error
            ? err.message
            : "We couldn't submit this pickup request."),
      );
    }
  };

  return (
    <DashboardShell
      title="Invoices"
      description="Review invoice status, payment completion, and pickup scheduling across your wins."
      action={
        <div className="rounded-2xl border border-[#dce6f5] bg-[#f8fbff] px-4 py-3 text-sm text-[#6b7280]">
          Ready to schedule:{" "}
          <span className="font-semibold text-[#111827]">
            {readyInvoices.data?.length ?? 0}
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3 border-b border-[#dce6f5] pb-4">
          {[
            ["all", "All"],
            ["ready", "Ready for pickup"],
            ["scheduled", "Scheduled"],
            ["completed", "Completed"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFilter(key as FilterKey);
                setPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === key
                  ? "bg-[#fe6819] text-white"
                  : "bg-[#f5f5f5] text-[#525252] hover:bg-[#fff1e7]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-[#fecaca] bg-[#fff7f7] p-6 text-[#991b1b]">
            We couldn&apos;t load your invoices right now.
          </div>
        ) : paginatedOrders.length ? (
          <div className="space-y-4">
            {paginatedOrders.map((order) => {
              const product = order.invoice.product;
              const pickupActionLabel =
                order.appointment?.status === "scheduled"
                  ? "Pickup Reserved"
                  : order.appointment?.status === "completed" ||
                      order.pickupRequest?.status === "completed"
                    ? "Pickup Completed"
                    : order.appointment?.status === "cancelled" ||
                        order.pickupRequest?.status === "cancelled"
                      ? "Pickup Cancelled"
                      : order.pickupRequest?.status === "approved"
                        ? "Pickup Approved"
                        : order.pickupRequest?.status === "scheduled"
                          ? "Pickup Scheduled"
                          : order.pickupRequest
                            ? "Pickup Requested"
                            : "No Action Needed";

              return (
                <article
                  key={order.invoice._id}
                  className="rounded-2xl border border-[#dce6f5] bg-white p-4 sm:p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                    <div className="flex flex-1 items-start gap-4">
                      {/* Product Thumbnail */}
                      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#f3f4f6] border border-slate-100">
                        {product?.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0].url}
                            alt={product.title ?? "Product Image"}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      {/* Product Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] truncate">
                            {product?.title ?? "Auction item"}
                          </h2>
                          <span
                            className={`rounded-md px-3 py-1 text-xs font-semibold ${
                              order.invoice.status === "paid"
                                ? "bg-[#dcfce7] text-[#15803d]"
                                : "bg-[#fff1f2] text-[#b91c1c]"
                            }`}
                          >
                            {order.invoice.status
                              .replaceAll("_", " ")
                              .toUpperCase()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#6b7280]">
                          {product?.category ?? "Category unavailable"}
                        </p>

                        <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                              Invoice
                            </p>
                            <p className="mt-1 text-base sm:text-lg font-bold text-[#111827]">
                              {order.invoice.invoiceNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                              Amount
                            </p>
                            <p className="mt-1 text-base sm:text-lg font-bold text-[#111827]">
                              {formatMoney(order.invoice.amount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                              Order date
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#111827]">
                              {formatDateTime(
                                order.invoice.paidAt ?? order.invoice.createdAt,
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                              Pickup status
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#111827]">
                              {order.pickupStatusLabel}
                            </p>
                          </div>
                        </div>

                        {order.appointment?.slot ? (
                          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#f8fbff] border border-[#dce6f5] px-4 py-2.5 text-sm text-[#4b5563]">
                            <CalendarRange className="h-4 w-4 text-[#003da5]" />
                            <span>
                              {formatSlotWindow(order.appointment.slot)}
                            </span>
                          </div>
                        ) : null}

                        {order.pickupRequest && !order.appointment ? (
                          <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-xl border border-[#bbf7d0] bg-[#ecfdf5] px-4 py-2.5 text-sm text-[#047857]">
                            <CalendarRange className="h-4 w-4" />
                            <span className="font-semibold">
                              Requested pickup:
                            </span>
                            <span>
                              {format(
                                parseISO(order.pickupRequest.pickupDate),
                                "MMM d, yyyy",
                              )}{" "}
                              at {order.pickupRequest.pickupTime}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Action Buttons Container */}
                    <div className="flex w-full flex-col gap-2.5 xl:w-[220px] shrink-0">
                      {/* View Invoice Button */}
                      <Button
                        asChild
                        variant="outline"
                        className="h-11 rounded-xl border-[#fe6819] text-[#fe6819] hover:bg-[#fff3eb] hover:text-[#fe6819] font-semibold text-sm transition-colors"
                      >
                        <Link href={`/dashboard/invoices/${order.invoice._id}`}>
                          {order.invoice.status === "paid"
                            ? "View Invoice"
                            : "View Details"}
                        </Link>
                      </Button>

                      {/* Schedule Pickup Action / Status Indicator */}
                      {order.pickupActionable ? (
                        <Button
                          type="button"
                          onClick={() =>
                            handleOpenScheduleModal(
                              order.invoice.auction?._id,
                              order.invoice.invoiceNumber,
                            )
                          }
                          className="h-11 rounded-xl bg-[#fe6819] hover:bg-[#e45c12] text-white font-semibold text-sm shadow-xs transition-colors"
                        >
                          Schedule Pickup
                        </Button>
                      ) : (
                        <div className="rounded-xl border border-[#dce6f5] bg-[#f8fbff] px-4 py-2.5 text-center text-xs sm:text-sm font-medium text-[#6b7280]">
                          {pickupActionLabel}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Pagination Controls */}
            <div className="flex flex-col gap-4 border-t border-[#dce6f5] pt-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-[#6b7280]">
                Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(page * PAGE_SIZE, filteredOrders.length)} of{" "}
                {filteredOrders.length} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-[#dce6f5]"
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="rounded-xl bg-[#fe6819] px-4 py-2 text-sm font-semibold text-white">
                  {page}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-[#dce6f5]"
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-[#dce6f5] bg-white p-10 text-center">
            <PackageSearch className="mx-auto h-10 w-10 text-[#94a3b8]" />
            <p className="mt-4 text-xl font-semibold text-[#111827]">
              No matching invoices hhhh
            </p>
            <p className="mt-2 text-sm text-[#6b7280]">
              Once invoices are created for your account, they&apos;ll appear
              here with pickup actions.
            </p>
          </div>
        )}
      </div>

      {/* PICKUP SCHEDULE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl transition-all">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Schedule Pickup
                </h3>
                {activeInvoiceNumber && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Invoice:{" "}
                    <span className="font-semibold text-slate-700">
                      {activeInvoiceNumber}
                    </span>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto px-5 py-4">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                  <Loader2 className="h-8 w-8 animate-spin text-[#fe6819]" />
                  <p className="mt-3 text-sm font-medium">
                    Fetching schedule dates...
                  </p>
                </div>
              ) : modalError ? (
                <div className="rounded-xl bg-red-50 p-4 border border-red-100 text-center text-sm text-red-600">
                  {modalError}
                </div>
              ) : scheduleData ? (
                <div className="space-y-3">
                  {/* Date Range Card */}
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <Calendar className="h-5 w-5 text-[#fe6819] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Available Pickup Window
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {new Date(scheduleData.startDate).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}{" "}
                        –{" "}
                        {new Date(scheduleData.endDate).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Duration:{" "}
                        <span className="font-semibold">
                          {scheduleData.durationInDays} days
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-slate-900">
                        Pickup calendar
                      </p>
                      <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#047857]">
                        Available
                      </span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {WEEK_DAYS.map((day) => (
                        <div
                          key={day}
                          className="py-1 text-[11px] font-semibold text-slate-400"
                        >
                          {day}
                        </div>
                      ))}
                      {getPickupCalendarDays(scheduleData).map((day) => {
                        const dateValue = format(day.date, "yyyy-MM-dd");
                        const isSelected = selectedPickupDate === dateValue;

                        return (
                          <button
                            type="button"
                            key={day.date.toISOString()}
                            disabled={!day.isAvailable}
                            onClick={() => setSelectedPickupDate(dateValue)}
                            className={`flex h-8 items-center justify-center rounded-md text-xs font-semibold ${
                              isSelected
                                ? "bg-[#fe6819] text-white shadow-sm"
                                : day.isAvailable
                                  ? "bg-[#ecfdf5] shadow shadow-[#047857]/20 text-[#047857] hover:bg-[#d1fae5]"
                                  : day.isCurrentMonth
                                    ? "bg-slate-50 text-slate-500"
                                    : "text-slate-300"
                            } ${
                              !isSelected && (day.isStart || day.isEnd)
                                ? "ring-2 ring-[#fe6819]"
                                : ""
                            } disabled:cursor-not-allowed`}
                            title={format(day.date, "MMM d, yyyy")}
                          >
                            {format(day.date, "d")}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Select the date you want to pick up your item.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Pickup date
                      </span>
                      <input
                        type="date"
                        value={selectedPickupDate}
                        onChange={(event) =>
                          setSelectedPickupDate(event.target.value)
                        }
                        min={format(
                          parseISO(scheduleData.startDate),
                          "yyyy-MM-dd",
                        )}
                        max={format(
                          parseISO(scheduleData.endDate),
                          "yyyy-MM-dd",
                        )}
                        className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#fe6819]"
                      />
                    </label>

                    <label className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Pickup time
                      </span>
                      <input
                        type="time"
                        value={selectedPickupTime}
                        onChange={(event) =>
                          setSelectedPickupTime(event.target.value)
                        }
                        className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#fe6819]"
                      />
                    </label>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <Clock className="h-5 w-5 text-[#003da5] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Daily Pickup Hours
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {scheduleData.dailyStartTime} –{" "}
                        {scheduleData.dailyEndTime}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="flex shrink-0 flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                onClick={closeModal}
                variant="outline"
                className="h-10 rounded-xl border-slate-200 px-6 text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmitPickupRequest}
                disabled={
                  !scheduleData ||
                  !selectedPickupDate ||
                  !selectedPickupTime ||
                  createPickupRequest.isPending
                }
                className="h-10 rounded-xl bg-[#fe6819] px-6 text-sm font-semibold text-white hover:bg-[#e45c12]"
              >
                {createPickupRequest.isPending
                  ? "Submitting..."
                  : "Submit Request"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
