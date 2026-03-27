"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Users,
  ArrowUpDown,
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
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const STATUSES = [
  "All",
  "New",
  "Contacted",
  "Appointment Set",
  "Inspected",
  "Proposal Sent",
  "Sold",
  "Lost",
];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  "Appointment Set": "bg-purple-100 text-purple-700",
  Inspected: "bg-orange-100 text-orange-700",
  "Proposal Sent": "bg-cyan-100 text-cyan-700",
  Sold: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

const PAGE_SIZE = 20;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function scoreBadge(score: number) {
  if (score >= 70) return { bg: "bg-red-100 text-red-700", dot: "bg-red-500" };
  if (score >= 40)
    return { bg: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" };
  return { bg: "bg-green-100 text-green-700", dot: "bg-green-500" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created_at" | "score">("created_at");
  const [page, setPage] = useState(0);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.set("status", statusFilter);
      params.set("sort", sortBy);
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(page * PAGE_SIZE));

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load leads");
      const data = await res.json();
      setLeads(data.leads || []);
      setTotalCount(data.count ?? 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sortBy, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Client-side search filter
  const filtered = searchQuery.trim()
    ? leads.filter((l) => {
        const q = searchQuery.toLowerCase();
        return (
          `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.includes(q) ||
          l.city?.toLowerCase().includes(q) ||
          (l.issues || []).some((i) => i.toLowerCase().includes(q))
        );
      })
    : leads;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
        <p className="text-lg font-medium text-gray-700">
          Something went wrong
        </p>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchLeads}
          className="mt-4 text-sm text-navy hover:underline font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Leads</h2>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Statuses" : s}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, phone, city, issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <button
          onClick={() =>
            setSortBy((prev) =>
              prev === "created_at" ? "score" : "created_at"
            )
          }
          className="inline-flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white hover:bg-gray-50 transition"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort: {sortBy === "created_at" ? "Date" : "Score"}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No leads found</p>
          <p className="text-sm mt-1">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">
                    Phone
                  </th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">
                    City
                  </th>
                  <th className="px-5 py-3 font-medium hidden xl:table-cell">
                    Issues
                  </th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  const badge = scoreBadge(lead.score);
                  const statusColor =
                    STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-700";
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/admin/leads/${lead.id}`)}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition cursor-pointer"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {lead.first_name} {lead.last_name}
                      </td>
                      <td className="px-5 py-4 text-gray-600 hidden md:table-cell whitespace-nowrap">
                        {lead.email}
                      </td>
                      <td className="px-5 py-4 text-gray-600 hidden lg:table-cell whitespace-nowrap">
                        {lead.phone}
                      </td>
                      <td className="px-5 py-4 text-gray-600 hidden md:table-cell whitespace-nowrap">
                        {lead.city}
                        {lead.state ? `, ${lead.state}` : ""}
                      </td>
                      <td className="px-5 py-4 hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(lead.issues || []).slice(0, 3).map((issue) => (
                            <span
                              key={issue}
                              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                            >
                              {issue}
                            </span>
                          ))}
                          {(lead.issues || []).length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{lead.issues.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.bg}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}
                          />
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}
                        >
                          {lead.status || "New"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-navy hover:text-pink text-xs font-medium transition"
                        >
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
