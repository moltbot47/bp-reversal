"use client";

import { useState, useEffect } from "react";
import { Shield, Users, CheckSquare, Heart, TrendingUp, Flame, Bell } from "lucide-react";

interface AdminStats {
  timestamp: string;
  users: {
    total: number;
    onboarded: number;
    pushEnabled: number;
    activeToday: number;
    activeLast7Days: number;
  };
  activity: {
    totalChecklistCompletions: number;
    totalBPEntries: number;
  };
  recentSignups: {
    email: string;
    name: string | null;
    onboarded: boolean;
    signedUp: string;
  }[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-[#FDFDF8] rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-[#1D2939]">{value}</p>
          <p className="text-xs text-[#667085]">{label}</p>
          {sub && <p className="text-[10px] text-[#667085]">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchStats = async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!res.ok) throw new Error("Invalid admin key");
      const data = await res.json();
      setStats(data);
      setAuthed(true);
      setLastRefresh(new Date());
    } catch {
      setError("Invalid admin key. Try again.");
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats(password);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => fetchStats(password), 30000);
    return () => clearInterval(interval);
  }, [authed, password]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#EEEFE9] flex items-center justify-center p-4">
        <div className="bg-[#FDFDF8] rounded-xl shadow-sm p-8 max-w-sm w-full">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-purple-600" />
          </div>
          <h1 className="text-xl font-bold text-[#1D2939] text-center mb-1">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#667085] text-center mb-6">
            Enter your admin key to view stats
          </p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin key"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-[#1D2939] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EB9D2A]"
            />
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-[#EB9D2A] text-white font-semibold rounded-lg shadow-[0_2px_0_0_#C4800F] hover:bg-[#D4891F] active:translate-y-[1px] active:shadow-[0_1px_0_0_#C4800F] disabled:opacity-50 transition-all"
            >
              {loading ? "Checking..." : "View Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const onboardRate =
    stats.users.total > 0
      ? Math.round((stats.users.onboarded / stats.users.total) * 100)
      : 0;

  const retentionRate =
    stats.users.onboarded > 0
      ? Math.round((stats.users.activeLast7Days / stats.users.onboarded) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#EEEFE9]">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#1D2939]">
              BP Reversal Admin
            </h1>
            <p className="text-xs text-[#667085]">
              {lastRefresh && `Updated ${timeAgo(lastRefresh.toISOString())}`}
              {" · "}Auto-refreshes every 30s
            </p>
          </div>
          <button
            onClick={() => fetchStats(password)}
            className="text-sm text-[#EB9D2A] font-medium hover:underline"
          >
            Refresh
          </button>
        </div>

        {/* Stat Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.users.total}
            sub={`${onboardRate}% onboarded`}
            color="#3B82F6"
          />
          <StatCard
            icon={TrendingUp}
            label="Active Today"
            value={stats.users.activeToday}
            sub={`of ${stats.users.onboarded} onboarded`}
            color="#22C55E"
          />
          <StatCard
            icon={Flame}
            label="Active (7 days)"
            value={stats.users.activeLast7Days}
            sub={`${retentionRate}% retention`}
            color="#F59E0B"
          />
          <StatCard
            icon={Bell}
            label="Push Enabled"
            value={stats.users.pushEnabled}
            sub={`of ${stats.users.total} users`}
            color="#A855F7"
          />
          <StatCard
            icon={CheckSquare}
            label="Completions"
            value={stats.activity.totalChecklistCompletions}
            sub="Total items checked"
            color="#EB9D2A"
          />
          <StatCard
            icon={Heart}
            label="BP Entries"
            value={stats.activity.totalBPEntries}
            sub="Total readings logged"
            color="#EF4444"
          />
        </div>

        {/* Conversion Funnel */}
        <div className="bg-[#FDFDF8] rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <h2 className="text-sm font-semibold text-[#1D2939] mb-3">
            Conversion Funnel
          </h2>
          <div className="space-y-2">
            {[
              { label: "Signed up", value: stats.users.total, pct: 100 },
              {
                label: "Completed onboarding",
                value: stats.users.onboarded,
                pct: onboardRate,
              },
              {
                label: "Active last 7 days",
                value: stats.users.activeLast7Days,
                pct: retentionRate,
              },
              {
                label: "Push enabled",
                value: stats.users.pushEnabled,
                pct:
                  stats.users.total > 0
                    ? Math.round(
                        (stats.users.pushEnabled / stats.users.total) * 100
                      )
                    : 0,
              },
            ].map((step) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="w-28 text-xs text-[#667085] flex-shrink-0">
                  {step.label}
                </div>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-[#EB9D2A] transition-all duration-500"
                    style={{ width: `${Math.max(step.pct, 2)}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-[#1D2939]">
                    {step.value} ({step.pct}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Signups */}
        <div className="bg-[#FDFDF8] rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-[#1D2939] mb-3">
            Recent Signups
          </h2>
          {stats.recentSignups.length === 0 ? (
            <p className="text-sm text-[#667085] text-center py-4">
              No signups yet
            </p>
          ) : (
            <div className="space-y-2">
              {stats.recentSignups.map((user, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        user.onboarded ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {(user.name || user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1D2939]">
                        {user.name || "—"}
                      </p>
                      <p className="text-xs text-[#667085]">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#667085]">
                      {timeAgo(user.signedUp)}
                    </p>
                    <p
                      className={`text-[10px] font-medium ${
                        user.onboarded ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {user.onboarded ? "Onboarded" : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#667085] mt-6 mb-4">
          Admin key: your CRON_SECRET &middot; Data refreshes every 30s
        </p>
      </div>
    </div>
  );
}
