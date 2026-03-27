"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Flame,
  CalendarCheck,
  TrendingUp,
  Clock,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  issues: string[];
  score: number;
  status: string;
  created_at: string;
  answers?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function scoreBadge(score: number) {
  if (score >= 70) return { bg: "bg-red-100 text-red-700", dot: "bg-red-500" };
  if (score >= 40) return { bg: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" };
  return { bg: "bg-green-100 text-green-700", dot: "bg-green-500" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isThisWeek(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return d >= start && d < end;
}

function isThisMonth(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

/* ------------------------------------------------------------------ */
/*  Skeleton loaders                                                   */
/* ------------------------------------------------------------------ */
function CardSkeleton() {
  return <div className="bg-white rounded-xl shadow-sm p-6 h-28 animate-pulse" />;
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded" />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Summary card component                                             */
/* ------------------------------------------------------------------ */
function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
      <div className={`absolute top-4 right-4 h-10 w-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard page                                                     */
/* ------------------------------------------------------------------ */
export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/leads");
        if (!res.ok) throw new Error("Failed to load leads");
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : data.leads || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
        <p className="text-lg font-medium text-gray-700">Something went wrong</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  /* --- Computed stats --- */
  const todayCount = leads.filter((l) => isToday(l.created_at)).length;
  const weekCount = leads.filter((l) => isThisWeek(l.created_at)).length;
  const monthCount = leads.filter((l) => isThisMonth(l.created_at)).length;
  const hotCount = leads.filter((l) => l.score >= 70).length;
  const appointmentsThisWeek = leads.filter(
    (l) => l.status === "Appointment Set" && isThisWeek(l.created_at)
  ).length;

  const recent = [...leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      {/* Summary cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <SummaryCard label="Leads Today" value={todayCount} icon={Clock} color="bg-blue-500" />
          <SummaryCard label="Leads This Week" value={weekCount} icon={TrendingUp} color="bg-indigo-500" />
          <SummaryCard label="Leads This Month" value={monthCount} icon={Users} color="bg-navy" />
          <SummaryCard label="Hot Leads" value={hotCount} icon={Flame} color="bg-red-500" />
          <SummaryCard label="Appointments This Week" value={appointmentsThisWeek} icon={CalendarCheck} color="bg-green-500" />
        </div>
      )}

      {/* Recent leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
          <Link href="/admin/leads" className="text-sm text-navy hover:underline font-medium">
            View all
          </Link>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : recent.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
            <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No leads yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium hidden md:table-cell">City</th>
                    <th className="px-6 py-3 font-medium hidden lg:table-cell">Issue</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                    <th className="px-6 py-3 font-medium hidden sm:table-cell">Date</th>
                    <th className="px-6 py-3 font-medium hidden sm:table-cell">Status</th>
                    <th className="px-6 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {recent.map((lead) => {
                    const badge = scoreBadge(lead.score);
                    return (
                      <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {lead.first_name} {lead.last_name}
                        </td>
                        <td className="px-6 py-4 text-gray-600 hidden md:table-cell whitespace-nowrap">
                          {lead.city}, {lead.state}
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                            {(lead.issues || []).slice(0, 2).join(", ") || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.bg}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                            {lead.score}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                            {lead.status || "New"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="inline-flex items-center gap-1 text-navy hover:text-pink text-xs font-medium transition"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
