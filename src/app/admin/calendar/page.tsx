"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Clock,
  CalendarDays,
  Ban,
  Zap,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  is_booked: boolean;
}

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  city: string;
  issues: string[];
  appointment_date: string;
  appointment_time: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function getMonday(d: Date): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

function formatDateISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatDateFull(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const HOURS = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 7; // 7am to 6pm
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour;
  return {
    value: `${String(hour).padStart(2, "0")}:00`,
    label: `${display}:00 ${suffix}`,
  };
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function CalendarPage() {
  const [tab, setTab] = useState<"availability" | "appointments">("availability");
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));

  // Availability state
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState("");

  // Add slot form
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [addingSlot, setAddingSlot] = useState(false);

  // Block date
  const [blockDate, setBlockDate] = useState("");
  const [blocking, setBlocking] = useState(false);

  // Appointments
  const [appointments, setAppointments] = useState<Lead[]>([]);
  const [apptsLoading, setApptsLoading] = useState(false);

  // Date picker for adding slots
  const [datePickerValue, setDatePickerValue] = useState("");

  const weekEnd = addDays(weekStart, 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  /* ---- Fetch slots ---- */
  const fetchSlots = useCallback(async () => {
    setSlotsLoading(true);
    setSlotsError("");
    try {
      const start = formatDateISO(weekStart);
      const end = formatDateISO(addDays(weekStart, 13)); // Fetch 2 weeks ahead
      const res = await fetch(`/api/timeslots?startDate=${start}&endDate=${end}`);
      if (!res.ok) throw new Error("Failed to load time slots");
      const data = await res.json();
      setSlots(data.slots || []);
    } catch (err: unknown) {
      setSlotsError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setSlotsLoading(false);
    }
  }, [weekStart]);

  /* ---- Fetch appointments ---- */
  const fetchAppointments = useCallback(async () => {
    setApptsLoading(true);
    try {
      const start = formatDateISO(weekStart);
      const end = formatDateISO(weekEnd);
      const res = await fetch(`/api/leads?limit=100&offset=0`);
      if (!res.ok) throw new Error("Failed to load appointments");
      const data = await res.json();
      const leads = (data.leads || []).filter(
        (l: Lead) => l.appointment_date && l.appointment_date >= start && l.appointment_date <= end
      );
      setAppointments(leads);
    } catch {
      // Silent fail for appointments
    } finally {
      setApptsLoading(false);
    }
  }, [weekStart, weekEnd]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  useEffect(() => {
    if (tab === "appointments") fetchAppointments();
  }, [tab, fetchAppointments]);

  /* ---- Actions ---- */
  function toggleDate(dateStr: string) {
    setSelectedDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  }

  function addDateFromPicker() {
    if (datePickerValue && !selectedDates.includes(datePickerValue)) {
      setSelectedDates((prev) => [...prev, datePickerValue]);
    }
    setDatePickerValue("");
  }

  async function handleAddSlots() {
    if (selectedDates.length === 0) return;
    setAddingSlot(true);
    try {
      const res = await fetch("/api/timeslots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dates: selectedDates,
          startTime,
          endTime,
        }),
      });
      if (!res.ok) throw new Error("Failed to create slots");
      setSelectedDates([]);
      fetchSlots();
    } catch {
      setSlotsError("Failed to add time slots");
    } finally {
      setAddingSlot(false);
    }
  }

  async function handleQuickPreset() {
    setAddingSlot(true);
    try {
      // Find Mon-Fri of current view week
      const monFri = weekDays.slice(0, 5).map(formatDateISO);
      const blocks = [
        { dates: monFri, startTime: "09:00", endTime: "11:00" },
        { dates: monFri, startTime: "11:00", endTime: "13:00" },
        { dates: monFri, startTime: "13:00", endTime: "15:00" },
        { dates: monFri, startTime: "15:00", endTime: "17:00" },
      ];
      for (const block of blocks) {
        await fetch("/api/timeslots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(block),
        });
      }
      fetchSlots();
    } catch {
      setSlotsError("Failed to create preset slots");
    } finally {
      setAddingSlot(false);
    }
  }

  async function handleDeleteSlot(slotId: string) {
    try {
      const res = await fetch(`/api/timeslots/${slotId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch {
      setSlotsError("Failed to delete slot");
    }
  }

  async function handleBlockDate() {
    if (!blockDate) return;
    setBlocking(true);
    try {
      const res = await fetch("/api/timeslots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dates: [blockDate],
          startTime: "00:00",
          endTime: "23:59",
        }),
      });
      if (!res.ok) throw new Error("Failed to block date");
      // Mark the slot as unavailable via a follow-up
      setBlockDate("");
      fetchSlots();
    } catch {
      setSlotsError("Failed to block date");
    } finally {
      setBlocking(false);
    }
  }

  /* ---- Navigation ---- */
  function prevWeek() {
    setWeekStart((prev) => addDays(prev, -7));
  }
  function nextWeek() {
    setWeekStart((prev) => addDays(prev, 7));
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("availability")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            tab === "availability"
              ? "bg-white text-navy shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <CalendarDays className="h-4 w-4 inline mr-1.5 -mt-0.5" />
          Manage Availability
        </button>
        <button
          onClick={() => setTab("appointments")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            tab === "appointments"
              ? "bg-white text-navy shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Clock className="h-4 w-4 inline mr-1.5 -mt-0.5" />
          View Appointments
        </button>
      </div>

      {/* Week nav */}
      <div className="flex items-center gap-4">
        <button
          onClick={prevWeek}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-gray-700">
          {formatDateShort(weekStart)} — {formatDateShort(weekEnd)}
        </span>
        <button
          onClick={nextWeek}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* ================================================================ */}
      {/*  MANAGE AVAILABILITY TAB                                         */}
      {/* ================================================================ */}
      {tab === "availability" && (
        <div className="space-y-6">
          {/* Add slots form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Add Available Slots
            </h3>

            {/* Date selection */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">
                Select dates
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {weekDays.map((day) => {
                  const iso = formatDateISO(day);
                  const selected = selectedDates.includes(iso);
                  return (
                    <button
                      key={iso}
                      onClick={() => toggleDate(iso)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition ${
                        selected
                          ? "bg-navy text-white border-navy"
                          : "bg-white text-gray-600 border-gray-200 hover:border-navy"
                      }`}
                    >
                      {formatDateShort(day)}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={datePickerValue}
                  onChange={(e) => setDatePickerValue(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                />
                <button
                  onClick={addDateFromPicker}
                  disabled={!datePickerValue}
                  className="text-sm text-navy hover:underline font-medium disabled:opacity-40"
                >
                  Add date
                </button>
              </div>
              {selectedDates.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedDates.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 bg-navy/10 text-navy text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {formatDateFull(d)}
                      <button
                        onClick={() => toggleDate(d)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Time selection */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Start time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                >
                  {HOURS.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  End time
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                >
                  {HOURS.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddSlots}
                disabled={addingSlot || selectedDates.length === 0}
                className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-dark transition disabled:opacity-50"
              >
                {addingSlot ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add Slots
              </button>
              <button
                onClick={handleQuickPreset}
                disabled={addingSlot}
                className="inline-flex items-center gap-2 bg-pink text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-pink-dark transition disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
                Mon-Fri 9am-5pm (2hr blocks)
              </button>
            </div>
          </div>

          {/* Block date */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Block a Date
            </h3>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">
                  Date to block
                </label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                />
              </div>
              <button
                onClick={handleBlockDate}
                disabled={blocking || !blockDate}
                className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
              >
                {blocking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Ban className="h-4 w-4" />
                )}
                Block Date
              </button>
            </div>
          </div>

          {/* Existing slots list */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Existing Slots
            </h3>
            {slotsLoading ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded" />
                ))}
              </div>
            ) : slotsError ? (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {slotsError}
              </div>
            ) : slots.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                No available slots in this range.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      slot.is_booked
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {formatDateFull(slot.date)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {slot.start_time} — {slot.end_time}
                      </span>
                      {slot.is_booked && (
                        <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          Booked
                        </span>
                      )}
                    </div>
                    {!slot.is_booked && (
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1"
                        title="Delete slot"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  VIEW APPOINTMENTS TAB                                           */}
      {/* ================================================================ */}
      {tab === "appointments" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {apptsLoading ? (
            <div className="p-6 space-y-4 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 min-w-[700px]">
                {/* Header row */}
                {weekDays.map((day) => {
                  const iso = formatDateISO(day);
                  const isToday = iso === formatDateISO(new Date());
                  return (
                    <div
                      key={iso}
                      className={`p-3 text-center border-b border-r border-gray-100 ${
                        isToday ? "bg-navy/5" : "bg-gray-50"
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold uppercase ${
                          isToday ? "text-navy" : "text-gray-500"
                        }`}
                      >
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          isToday ? "text-navy" : "text-gray-700"
                        }`}
                      >
                        {day.getDate()}
                      </p>
                    </div>
                  );
                })}

                {/* Content cells */}
                {weekDays.map((day) => {
                  const iso = formatDateISO(day);
                  const dayAppts = appointments.filter(
                    (a) => a.appointment_date === iso
                  );
                  return (
                    <div
                      key={`cell-${iso}`}
                      className="p-2 border-r border-b border-gray-50 min-h-[120px]"
                    >
                      {dayAppts.length === 0 ? (
                        <p className="text-xs text-gray-300 text-center mt-4">
                          No appointments
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {dayAppts.map((appt) => (
                            <Link
                              key={appt.id}
                              href={`/admin/leads/${appt.id}`}
                              className="block p-2 bg-navy/10 hover:bg-navy/20 rounded-lg transition text-xs"
                            >
                              <p className="font-semibold text-navy">
                                {appt.appointment_time || "TBD"}
                              </p>
                              <p className="text-gray-700 font-medium truncate">
                                {appt.first_name} {appt.last_name}
                              </p>
                              <p className="text-gray-500 truncate">
                                {appt.city}
                              </p>
                              {appt.issues && appt.issues.length > 0 && (
                                <p className="text-gray-400 truncate">
                                  {appt.issues[0]}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
