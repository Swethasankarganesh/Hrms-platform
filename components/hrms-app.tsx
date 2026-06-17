"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Wallet,
  TrendingUp,
  BarChart3,
  Sparkles,
  Settings2,
  Search,
  Menu,
  Sun,
  Moon,
  Bell,
  UserPlus,
  Check,
  X,
  Download,
  ChevronDown,
  Building2,
  AlertTriangle,
  CheckCircle2,
  CalendarClock,
  IndianRupee,
  Star,
  Target,
  Activity,
  Eye,
  ArrowUpRight,
  Shield,
  Database,
  RefreshCw,
  ChevronRight,
  Zap,
  Award,
  LogOut,
  UserCheck,
  Send,
  FileText,
  Fingerprint,
  PlugZap,
  Lock,
  BellDot,
  TrendingDown,
} from "lucide-react";
import { EmployeeForm } from "@/components/employee-form";
import { formatDate, initials, money } from "@/lib/format";
import { seedState } from "@/lib/seed";
import type {
  AttendanceStatus,
  Employee,
  HrmsState,
  PageId,
} from "@/lib/types";

/* ─── constants ────────────────────────────────────────────── */

const THEME_KEY = "peopleflow-theme";

type NavItem = {
  label: string;
  page: PageId;
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
};

const navigation: NavItem[] = [
  { label: "Overview",      page: "overview",    Icon: LayoutDashboard },
  { label: "People",        page: "people",      Icon: Users           },
  { label: "Attendance",    page: "attendance",  Icon: Clock           },
  { label: "Leave",         page: "leave",       Icon: CalendarDays    },
  { label: "Payroll",       page: "payroll",     Icon: Wallet          },
  { label: "Performance",   page: "performance", Icon: TrendingUp      },
  { label: "Reports",       page: "reports",     Icon: BarChart3       },
  { label: "PeopleFlow AI", page: "ai",          Icon: Sparkles        },
  { label: "Settings",      page: "settings",    Icon: Settings2       },
];

/* ─── PeopleFlow SVG Logo ───────────────────────────────────── */

function PFLogo() {
  return (
    <svg viewBox="0 0 22 22" fill="none" className="w-4.5 h-4.5" aria-hidden="true">
      {/* Primary person */}
      <circle cx="8"  cy="7"  r="4"   fill="white" />
      <path
        d="M1 21c0-3.866 3.134-7 7-7h.5"
        stroke="white" strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Secondary person */}
      <circle cx="17" cy="7"  r="3"   fill="white" fillOpacity=".65" />
      <path
        d="M13.5 19c.8-3 3.5-5 6.5-5"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity=".65"
      />
      {/* Flow connector */}
      <path
        d="M12 8.5l2.5 2 2.5-2"
        stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity=".35"
      />
    </svg>
  );
}

/* ─── Full-screen loader ─────────────────────────────────────── */

function AppLoader() {
  return (
    <div className="login-root">
      <div style={{ textAlign: "center", color: "var(--muted)", fontSize: ".9rem" }}>
        <div className="logo-mark" style={{ margin: "0 auto 1rem" }}><PFLogo /></div>
        Loading…
      </div>
    </div>
  );
}

/* ─── Login page ────────────────────────────────────────────── */

function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!email.trim() || !password) { setError("Please enter your email and password."); return; }
    setError("");
    setLoading(true);

    const result = await nextAuthSignIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark"><PFLogo /></div>
          <div>
            <div className="logo-name">PeopleFlow</div>
            <div className="logo-tagline">AI-powered HRMS</div>
          </div>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-sub">Sign in to your HR workspace</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="lf-email">Email address</label>
            <input
              id="lf-email"
              type="email"
              autoComplete="email"
              placeholder="swetha@peopleflow.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-field">
            <label htmlFor="lf-password">Password</label>
            <input
              id="lf-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn primary login-submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="login-hint">Email: sweshinisankar@gmail.com · Password: swetha123</p>
      </div>
    </div>
  );
}

/* ─── Root app ──────────────────────────────────────────────── */

export function HrmsApp() {
  const { data: session, status } = useSession();

  const [state,        setState]        = useState<HrmsState>(seedState);
  const [page,         setPage]         = useState<PageId>("overview");
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [toast,        setToast]        = useState("");
  const [isDark,       setIsDark]       = useState(false);
  const [dataLoaded,   setDataLoaded]   = useState(false);

  /* ── Theme init (runs once on mount, before session resolves) ── */
  useEffect(() => {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
    const hash = location.hash.slice(1) as PageId;
    if (navigation.some((item) => item.page === hash)) setPage(hash);
    if (window.innerWidth >= 1024) setMenuOpen(true);
  }, []);

  /* ── Fetch all HR data from MongoDB when authenticated ───────── */
  const loadData = useCallback(async () => {
    try {
      const [empRes, leaveRes, attRes, payRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/leave"),
        fetch("/api/attendance"),
        fetch("/api/payroll"),
      ]);
      const [employees, leaves, attendance, payroll] = await Promise.all([
        empRes.json(),
        leaveRes.json(),
        attRes.json(),
        payRes.json(),
      ]);
      setState({ employees, leaves, attendance, payroll: payroll.status });
      setDataLoaded(true);
    } catch {
      /* fall back to seed data if API not yet reachable */
      setDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadData();
  }, [status, loadData]);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  }

  function navigate(next: PageId) {
    setPage(next);
    if (window.innerWidth < 1024) setMenuOpen(false);
    history.replaceState(null, "", `#${next}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  async function addEmployee(data: Omit<Employee, "id" | "status" | "joined" | "score">) {
    let employee: Employee | null = null;

    /* Try API (requires MongoDB) */
    try {
      const res = await fetch("/api/employees", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      if (res.ok) employee = await res.json();
    } catch { /* DB not available */ }

    /* Fallback: generate locally when DB is unavailable */
    if (!employee) {
      const id = Math.max(...state.employees.map((e) => e.id), 1000) + 1;
      employee = {
        ...data,
        id,
        status: "Active",
        joined: new Date().toISOString().split("T")[0],
        score:  75,
      };
    }

    setState((cur) => ({
      ...cur,
      employees: [employee!, ...cur.employees],
      attendance: {
        ...cur.attendance,
        [employee!.id]: { status: "Present", clockIn: "09:00", clockOut: "-", hours: "6h 00m" },
      },
    }));
    setEmployeeOpen(false);
    navigate("people");
    notify(`${employee.name} added successfully.`);
  }

  const pendingLeaves = state.leaves.filter((l) => l.status === "Pending").length;

  /* ── Auth gates ──────────────────────────────────────────────── */
  if (status === "loading") return <AppLoader />;
  if (status === "unauthenticated") return <LoginPage />;
  if (!dataLoaded) return <AppLoader />;

  return (
    <div className="min-h-screen text-ink">
      <Sidebar
        page={page}
        open={menuOpen}
        employeeCount={state.employees.length}
        leaveCount={pendingLeaves}
        onNavigate={navigate}
        onClose={() => setMenuOpen(false)}
        onSignOut={() => nextAuthSignOut({ redirect: false })}
        userName={session?.user?.name ?? "Swetha Sankar"}
      />

      {/*
        Push layout — sidebar width is 15.5rem (ml-62 = 62 × 0.25rem = 15.5rem).
        • Mobile  (<640px):  no push — dark overlay covers content
        • Tablet+ (≥640px): content slides right when menuOpen
        • Desktop (≥1024px): same, but menuOpen defaults to true on mount
      */}
      <main
        className={[
          "min-h-screen",
          "transition-[margin-left] duration-300 ease-in-out",
          menuOpen ? "sm:ml-62" : "",
        ].join(" ")}
      >
        <Topbar
          isDark={isDark}
          leaveCount={pendingLeaves}
          onMenu={() => setMenuOpen((v) => !v)}
          onAdd={() => setEmployeeOpen(true)}
          onSearch={(q) => { if (q.length > 1) navigate("people"); }}
          onThemeToggle={toggleTheme}
          onNotifications={() => navigate("leave")}
        />

        <div className="mx-auto max-w-400 px-6 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
          <PageContent
            page={page}
            state={state}
            setState={setState}
            navigate={navigate}
            notify={notify}
            openEmployee={() => setEmployeeOpen(true)}
            userName={session?.user?.name ?? "Swetha Sankar"}
          />
        </div>
      </main>

      {/*
        Overlay — shows on mobile/tablet (<1024px) when sidebar is open.
        On desktop (≥1024px) there is no overlay; content simply shifts right.
        z-40 = above topbar (z-20) but below sidebar (z-50).
      */}
      {menuOpen ? (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(5,8,20,.52)", backdropFilter: "blur(3px)" }}
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      {/* Add employee modal */}
      {employeeOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true" aria-label="Add employee">
            <EmployeeForm
              onSubmit={addEmployee}
              onCancel={() => setEmployeeOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {/* Toast */}
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
        {toast}
      </div>
    </div>
  );
}

/* ─── Sidebar ───────────────────────────────────────────────── */

function Sidebar({
  page, open, employeeCount, leaveCount, onNavigate, onClose, onSignOut, userName,
}: {
  page: PageId;
  open: boolean;
  employeeCount: number;
  leaveCount: number;
  onNavigate: (page: PageId) => void;
  onClose: () => void;
  onSignOut: () => void;
  userName: string;
}) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Main navigation">
      {/* Logo + close button */}
      <div className="logo-wrap">
        <div className="logo-mark" aria-hidden="true">
          <PFLogo />
        </div>
        <div>
          <div className="logo-name">PeopleFlow</div>
          <div className="logo-tagline">AI-powered HRMS</div>
        </div>
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <X size={15} />
        </button>
      </div>

      {/* Workspace switcher */}
      <button className="workspace-card" onClick={() => {}}>
        <span className="avatar purple text-[.6rem]">PF</span>
        <div className="min-w-0 flex-1">
          <strong className="block truncate text-[.78rem] text-white">PeopleFlow Inc.</strong>
          <small className="text-[.6rem]" style={{ color: "var(--sidebar-muted)" }}>Enterprise workspace</small>
        </div>
        <ChevronDown size={13} style={{ color: "var(--sidebar-muted)", flexShrink: 0 }} />
      </button>

      {/* Nav — core modules */}
      <span className="nav-label">Workspace</span>
      <nav className="space-y-0.5" aria-label="Core modules">
        {navigation.slice(0, 6).map((item) => (
          <button
            key={item.page}
            className={`nav-link ${page === item.page ? "active" : ""}`}
            onClick={() => onNavigate(item.page)}
            aria-current={page === item.page ? "page" : undefined}
          >
            <item.Icon size={15} strokeWidth={2} />
            {item.label}
            {item.page === "people" ? (
              <span className="nav-badge-count">{employeeCount}</span>
            ) : null}
            {item.page === "leave" && leaveCount > 0 ? (
              <span className="nav-badge">{leaveCount}</span>
            ) : null}
          </button>
        ))}
      </nav>

      {/* Nav — intelligence */}
      <span className="nav-label mt-5">Intelligence</span>
      <nav className="space-y-0.5" aria-label="Intelligence modules">
        {navigation.slice(6).map((item) => (
          <button
            key={item.page}
            className={`nav-link ${page === item.page ? "active" : ""}`}
            onClick={() => onNavigate(item.page)}
            aria-current={page === item.page ? "page" : undefined}
          >
            <item.Icon size={15} strokeWidth={2} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-4">
        {/* Upgrade card */}
        <div className="sidebar-upgrade mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={13} className="text-blue-400" />
            <strong className="text-[.75rem] text-white">Advanced workspace</strong>
          </div>
          <p className="text-[.62rem]" style={{ color: "var(--sidebar-muted)" }}>
            All HR modules enabled · AI included
          </p>
        </div>

        {/* Current user */}
        <div className="sidebar-user">
          <span className="avatar orange">SS</span>
          <div className="min-w-0 flex-1">
            <strong className="block text-[.78rem] text-white">{userName}</strong>
            <small className="text-[.62rem]" style={{ color: "var(--sidebar-muted)" }}>HR Administrator</small>
          </div>
          <button
            className="icon-btn shrink-0"
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,.1)" }}
            title="Sign out"
            onClick={onSignOut}
          >
            <LogOut size={13} style={{ color: "var(--sidebar-muted)" }} />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ─── Topbar ────────────────────────────────────────────────── */

function Topbar({
  isDark, leaveCount, onMenu, onAdd, onSearch, onThemeToggle, onNotifications,
}: {
  isDark: boolean;
  leaveCount: number;
  onMenu: () => void;
  onAdd: () => void;
  onSearch: (q: string) => void;
  onThemeToggle: () => void;
  onNotifications: () => void;
}) {
  return (
    <header className="topbar">
      {/* Hamburger — always visible */}
      <button
        className="icon-btn shrink-0"
        onClick={onMenu}
        aria-label="Toggle navigation sidebar"
        title="Toggle sidebar"
      >
        <Menu size={17} />
      </button>

      {/* Search — fixed width, left-aligned after hamburger */}
      <label className="search-box shrink-0" aria-label="Search">
        <Search size={14} className="text-muted shrink-0" />
        <input
          type="search"
          placeholder="Search people, modules..."
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search employees or jump to module"
        />
        <kbd aria-label="keyboard shortcut" className="hidden sm:inline-flex">⌘K</kbd>
      </label>

      {/* Spacer — pushes actions to the right */}
      <div className="flex-1" aria-hidden="true" />

      {/* Right actions */}
      <div className="flex items-center gap-2.5">
        {/* Theme toggle */}
        <button
          className="icon-btn hidden sm:grid"
          onClick={onThemeToggle}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button
          className="icon-btn hidden sm:grid"
          onClick={onNotifications}
          aria-label={`Notifications${leaveCount > 0 ? ` — ${leaveCount} pending leave requests` : ""}`}
          title="Notifications"
        >
          <Bell size={16} />
          {leaveCount > 0 && <span className="notif-dot" aria-hidden="true" />}
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-line" aria-hidden="true" />

        {/* Add employee — text label on sm+, icon-only on xs */}
        <button
          className="btn primary hidden sm:inline-flex"
          onClick={onAdd}
          aria-label="Add new employee"
        >
          <UserPlus size={14} strokeWidth={2.5} />
          Add employee
        </button>
        <button
          className="icon-btn sm:hidden"
          onClick={onAdd}
          aria-label="Add employee"
          title="Add employee"
        >
          <UserPlus size={16} />
        </button>
      </div>
    </header>
  );
}

/* ─── Page dispatcher ───────────────────────────────────────── */

function PageContent({
  page, state, setState, navigate, notify, openEmployee, userName,
}: {
  page: PageId;
  state: HrmsState;
  setState: React.Dispatch<React.SetStateAction<HrmsState>>;
  navigate: (page: PageId) => void;
  notify: (msg: string) => void;
  openEmployee: () => void;
  userName: string;
}) {
  if (page === "overview")    return <Overview    state={state} navigate={navigate} userName={userName} />;
  if (page === "people")      return <People      state={state} openEmployee={openEmployee} notify={notify} />;
  if (page === "attendance")  return <Attendance  state={state} setState={setState} notify={notify} />;
  if (page === "leave")       return <Leave       state={state} setState={setState} notify={notify} />;
  if (page === "payroll")     return <Payroll     state={state} setState={setState} notify={notify} />;
  if (page === "performance") return <Performance state={state} notify={notify} />;
  if (page === "reports")     return <Reports     state={state} navigate={navigate} notify={notify} />;
  if (page === "ai")          return <AiWorkspace state={state} />;
  return                             <Settings    setState={setState} notify={notify} />;
}

/* ─── Shared: Page Header ───────────────────────────────────── */

function PageHeader({
  kicker, title, description, actions,
}: {
  kicker: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">{kicker}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}

/* ─── Shared: Stat cards ────────────────────────────────────── */

type StatItem = {
  icon: React.ReactNode;
  iconClass?: string;
  label: string;
  value: string | number;
  note: string;
};

function Stats({ items }: { items: StatItem[] }) {
  return (
    <div className="stats-section">
      {items.map(({ icon, iconClass, label, value, note }) => (
        <article className="card" key={label}>
          <span className={`stat-icon ${iconClass ?? ""}`}>{icon}</span>
          <p className="stat-label">{label}</p>
          <strong className="stat-value">{value}</strong>
          <p className="stat-note">{note}</p>
        </article>
      ))}
    </div>
  );
}

/* ─── Shared: Data Table ────────────────────────────────────── */

function DataTable({
  headers, children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="data-table">
        <thead>
          <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/* ─── Shared: Person cell ───────────────────────────────────── */

function Person({ employee }: { employee: Employee }) {
  return (
    <div className="person">
      <span className="avatar">{initials(employee.name)}</span>
      <div>
        <strong>{employee.name}</strong>
        <small>{employee.email}</small>
      </div>
    </div>
  );
}

/* ─── Shared: Status badge ──────────────────────────────────── */

function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`status ${value.toLowerCase().replace(/\s+/g, "-")}`}>
      {value}
    </span>
  );
}

/* ─── Overview ──────────────────────────────────────────────── */

function Overview({
  state, navigate, userName,
}: {
  state: HrmsState;
  navigate: (page: PageId) => void;
  userName: string;
}) {
  const present = Object.values(state.attendance).filter((r) =>
    ["Present", "Remote", "Late"].includes(r.status),
  ).length;
  const pendingLeaves = state.leaves.filter((l) => l.status === "Pending").length;
  const attendancePct = Math.round((present / state.employees.length) * 100);
  const firstName = userName.split(" ")[0];

  return (
    <>
      <PageHeader
        kicker="Friday, 12 June 2026"
        title={`Good morning, ${firstName} 👋`}
        description="Here is what's happening with your people today."
        actions={
          <button className="btn secondary" onClick={() => navigate("attendance")}>
            <Clock size={14} strokeWidth={2.5} />
            Quick attendance
          </button>
        }
      />

      <Stats items={[
        {
          icon: <Users size={18} strokeWidth={2} />,
          label: "Total employees",
          value: state.employees.length,
          note: "Across 6 departments",
        },
        {
          icon: <UserCheck size={18} strokeWidth={2} />,
          iconClass: "green",
          label: "Present today",
          value: present,
          note: `${attendancePct}% attendance rate`,
        },
        {
          icon: <CalendarClock size={18} strokeWidth={2} />,
          iconClass: "yellow",
          label: "Pending leave",
          value: pendingLeaves,
          note: "Needs your approval",
        },
        {
          icon: <TrendingDown size={18} strokeWidth={2} />,
          iconClass: "red",
          label: "Attrition risk",
          value: "3.2%",
          note: "Low organizational risk",
        },
      ]} />

      <div className="page-grid cols-chart">
        {/* Workforce chart */}
        <article className="card">
          <div className="card-head">
            <div>
              <h2>Workforce growth</h2>
              <p>Employee headcount over the last 6 months</p>
            </div>
            <select className="w-auto" aria-label="Time range">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          <svg className="h-56 w-full" viewBox="0 0 760 220" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#3b82f6" stopOpacity=".28" />
                <stop offset="60%"  stopColor="#8b5cf6" stopOpacity=".10" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity=".01" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            {[20, 64, 108, 152, 196].map((y) => (
              <line key={y} x1="0" y1={y} x2="760" y2={y} stroke="currentColor" strokeOpacity=".08" strokeWidth="1" />
            ))}
            <path
              fill="url(#areaGrad)"
              d="M0 175C80 170 100 150 155 148S245 132 310 126S400 104 465 109S560 85 615 80S700 58 760 48V220H0Z"
            />
            <path
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              d="M0 175C80 170 100 150 155 148S245 132 310 126S400 104 465 109S560 85 615 80S700 58 760 48"
            />
            {([[0,175],[155,148],[310,126],[465,109],[615,80],[760,48]] as [number,number][]).map(([x,y]) => (
              <g key={`${x}-${y}`}>
                <circle cx={x} cy={y} r="5" fill="url(#lineGrad)" opacity=".25" />
                <circle cx={x} cy={y} r="3" fill="white" stroke="#3b82f6" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
        </article>

        {/* AI insights panel */}
        <article className="card ai-panel text-white">
          <div className="ai-panel-header">
            <span className="spark"><Sparkles size={14} /></span>
            <div>
              <p className="ai-panel-kicker">PeopleFlow AI</p>
              <h2 className="ai-panel-title">Daily insights</h2>
            </div>
          </div>
          <p className="ai-panel-signals">3 signals may need attention today.</p>

          {([
            [<TrendingUp size={14} />,  "Retention risk detected",  "Two high performers show lower engagement."],
            [<Clock      size={14} />,  "Attendance pattern",       "Late arrivals concentrated in one team."],
            [<Award      size={14} />,  "Recognition moment",       "Three employees reached key milestones."],
          ] as const).map(([icon, title, note]) => (
            <button className="insight" key={String(title)} onClick={() => navigate("ai")}>
              <span className="insight-icon">{icon}</span>
              <div>
                <strong>{title}</strong>
                <small>{note}</small>
              </div>
              <ChevronRight size={13} className="ml-auto shrink-0 text-white/25" />
            </button>
          ))}

          <button
            className="btn secondary ai-panel-cta"
            onClick={() => navigate("ai")}
          >
            Open AI workspace
            <ArrowUpRight size={13} />
          </button>
        </article>
      </div>
    </>
  );
}

/* ─── People ────────────────────────────────────────────────── */

function People({
  state, openEmployee, notify,
}: {
  state: HrmsState;
  openEmployee: () => void;
  notify: (msg: string) => void;
}) {
  const [query,      setQuery]      = useState("");
  const [department, setDepartment] = useState("");

  const rows = state.employees.filter((e) =>
    `${e.name} ${e.role} ${e.department} ${e.email}`
      .toLowerCase().includes(query.toLowerCase()) &&
    (!department || e.department === department),
  );
  const departments = [...new Set(state.employees.map((e) => e.department))].sort();

  return (
    <>
      <PageHeader
        kicker="People directory"
        title="Your workforce"
        description="Manage employee profiles, teams, roles, and records."
        actions={
          <>
            <button className="btn ghost" onClick={() => exportEmployees(state.employees, notify)}>
              <Download size={14} />
              Export CSV
            </button>
            <button className="btn primary" onClick={openEmployee}>
              <UserPlus size={14} strokeWidth={2.5} />
              Add employee
            </button>
          </>
        }
      />

      <Stats items={[
        { icon: <Users size={18} />,     label: "Total employees", value: state.employees.length,                                              note: "Across all locations"     },
        { icon: <UserCheck size={18} />, iconClass: "green",  label: "Active",        value: state.employees.filter((e) => e.status === "Active").length, note: "Current workforce"        },
        { icon: <Building2 size={18} />, iconClass: "purple", label: "Departments",   value: new Set(state.employees.map((e) => e.department)).size,       note: "Cross-functional teams"   },
        { icon: <UserPlus size={18} />,  iconClass: "teal",   label: "New this month",value: state.employees.filter((e) => e.joined.startsWith("2026-06")).length, note: "June onboarding" },
      ]} />

      <article className="card">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="search-box table-search">
            <Search size={14} className="text-muted shrink-0" />
            <input
              placeholder="Search name, role, department..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search employees"
            />
          </div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-auto"
            aria-label="Filter by department"
          >
            <option value="">All departments</option>
            {departments.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        <DataTable headers={["Employee", "Role", "Department", "Location", "Status", "Joined", ""]}>
          {rows.map((emp) => (
            <tr key={emp.id}>
              <td><Person employee={emp} /></td>
              <td className="text-ink font-medium">{emp.role}</td>
              <td>{emp.department}</td>
              <td>{emp.location}</td>
              <td><StatusBadge value={emp.status} /></td>
              <td>{formatDate(emp.joined)}</td>
              <td>
                <button
                  className="row-btn"
                  onClick={() => notify(`${emp.name} · ${emp.score}% performance score`)}
                >
                  <Eye size={12} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        {rows.length === 0 && (
          <div className="py-14 text-center text-muted">
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No employees match your search.</p>
          </div>
        )}
      </article>
    </>
  );
}

/* ─── Attendance ────────────────────────────────────────────── */

function Attendance({ state, setState, notify }: StateProps) {
  const present = Object.values(state.attendance).filter((r) =>
    ["Present", "Remote", "Late"].includes(r.status),
  ).length;
  const late   = Object.values(state.attendance).filter((r) => r.status === "Late").length;
  const onLeave = Object.values(state.attendance).filter((r) => r.status === "Leave").length;

  return (
    <>
      <PageHeader
        kicker="Live operations"
        title="Attendance"
        description="Monitor clock-ins, work hours, and daily exceptions."
        actions={
          <button className="btn primary" onClick={() => notify("You clocked in at 09:06 IST.")}>
            <Fingerprint size={14} strokeWidth={2.5} />
            Clock in now
          </button>
        }
      />

      <Stats items={[
        { icon: <CheckCircle2 size={18} />, iconClass: "green",  label: "Present today",  value: present,   note: `${Math.round((present / state.employees.length) * 100)}% attendance` },
        { icon: <AlertTriangle size={18} />,iconClass: "yellow", label: "Late arrivals",  value: late,      note: "Needs manager review"     },
        { icon: <CalendarDays size={18} />, iconClass: "purple", label: "On leave",       value: onLeave,   note: "Approved absences"        },
        { icon: <Clock size={18} />,                             label: "Avg. hours today",value: "8h 34m", note: "Target: 8h 30m"           },
      ]} />

      <article className="card">
        <div className="card-head">
          <div>
            <h2>Today&apos;s attendance log</h2>
            <p>Friday, 12 June 2026 · India Standard Time (UTC+5:30)</p>
          </div>
          <StatusBadge value="Live" />
        </div>

        <DataTable headers={["Employee", "Status", "Clock in", "Clock out", "Hours", "Update"]}>
          {state.employees.map((emp) => {
            const rec = state.attendance[emp.id] ?? {
              status: "Absent" as AttendanceStatus,
              clockIn: "-", clockOut: "-", hours: "-",
            };
            return (
              <tr key={emp.id}>
                <td><Person employee={emp} /></td>
                <td><StatusBadge value={rec.status} /></td>
                <td className="font-mono text-[.75rem]">{rec.clockIn}</td>
                <td className="font-mono text-[.75rem]">{rec.clockOut}</td>
                <td className="font-mono text-[.75rem] text-ink font-medium">{rec.hours}</td>
                <td>
                  <select
                    value={rec.status}
                    className="w-auto text-[.73rem]"
                    aria-label={`Update ${emp.name}'s attendance`}
                    onChange={async (e) => {
                      const status = e.target.value as AttendanceStatus;
                      setState((cur) => ({
                        ...cur,
                        attendance: { ...cur.attendance, [emp.id]: { ...rec, status } },
                      }));
                      try {
                        await fetch(`/api/attendance/${emp.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status }),
                        });
                      } catch { /* DB unavailable — local state already updated */ }
                      notify(`${emp.name}'s attendance updated to ${status}.`);
                    }}
                  >
                    {(["Present", "Remote", "Late", "Absent", "Leave"] as AttendanceStatus[]).map(
                      (s) => <option key={s} value={s}>{s}</option>,
                    )}
                  </select>
                </td>
              </tr>
            );
          })}
        </DataTable>
      </article>
    </>
  );
}

/* ─── Leave ─────────────────────────────────────────────────── */

function Leave({ state, setState, notify }: StateProps) {
  const pending  = state.leaves.filter((l) => l.status === "Pending").length;
  const approved = state.leaves.filter((l) => l.status === "Approved").length;
  const onLeave  = state.employees.filter((e) => e.status === "On leave").length;

  return (
    <>
      <PageHeader
        kicker="Time away"
        title="Leave management"
        description="Review requests, monitor balances, and keep coverage healthy."
      />

      <Stats items={[
        { icon: <CalendarClock size={18} />, iconClass: "yellow", label: "Pending approval", value: pending,      note: "Awaiting your decision" },
        { icon: <CheckCircle2 size={18} />,  iconClass: "green",  label: "Approved",         value: approved,     note: "This period"            },
        { icon: <Users size={18} />,         iconClass: "purple", label: "Away today",       value: onLeave,      note: "Approved absences"      },
        { icon: <CalendarDays size={18} />,                       label: "Avg. balance",     value: "14.8 days",  note: "Across all employees"   },
      ]} />

      <article className="card">
        <div className="card-head">
          <div>
            <h2>Leave requests</h2>
            <p>Approve or decline requests with one click.</p>
          </div>
          {pending > 0 && (
            <span className="status pending">{pending} pending</span>
          )}
        </div>

        <DataTable headers={["Employee", "Type", "Dates", "Days", "Reason", "Status", "Action"]}>
          {state.leaves.map((leave) => {
            const emp = state.employees.find((e) => e.id === leave.employeeId)!;
            return (
              <tr key={leave.id}>
                <td><Person employee={emp} /></td>
                <td className="font-medium text-ink">{leave.type}</td>
                <td>{formatDate(leave.from)} – {formatDate(leave.to)}</td>
                <td className="text-center font-medium text-ink">{leave.days}</td>
                <td className="max-w-48 truncate">{leave.reason}</td>
                <td><StatusBadge value={leave.status} /></td>
                <td>
                  <div className="flex gap-1.5">
                    {(["Approved", "Declined"] as const).map((status) => (
                      <button
                        key={status}
                        className={status === "Approved" ? "approve" : "reject"}
                        aria-label={`${status === "Approved" ? "Approve" : "Decline"} ${emp.name}'s leave`}
                        title={status === "Approved" ? "Approve" : "Decline"}
                        onClick={async () => {
                          setState((cur) => ({
                            ...cur,
                            leaves: cur.leaves.map((l) =>
                              l.id === leave.id ? { ...l, status } : l,
                            ),
                          }));
                          try {
                            await fetch(`/api/leave/${leave.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status }),
                            });
                          } catch { /* DB unavailable */ }
                          notify(`Leave request ${status.toLowerCase()}.`);
                        }}
                      >
                        {status === "Approved"
                          ? <Check size={13} strokeWidth={2.5} />
                          : <X    size={13} strokeWidth={2.5} />}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </DataTable>
      </article>
    </>
  );
}

/* ─── Payroll ───────────────────────────────────────────────── */

function Payroll({ state, setState, notify }: StateProps) {
  const gross      = state.employees.reduce((s, e) => s + e.salary, 0) / 12;
  const deductions = gross * 0.116;
  const net        = gross - deductions;

  return (
    <>
      <PageHeader
        kicker="Compensation"
        title="Payroll"
        description="Review monthly compensation, deductions, and run payroll."
        actions={
          <button
            className={`btn ${state.payroll === "Processed" ? "ghost" : "primary"}`}
            onClick={async () => {
              if (state.payroll === "Processed") {
                notify("June payroll is already processed.");
              } else {
                setState((cur) => ({ ...cur, payroll: "Processed" }));
                try {
                  await fetch("/api/payroll", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Processed" }),
                  });
                } catch { /* DB unavailable */ }
                notify("June payroll processed successfully.");
              }
            }}
          >
            {state.payroll === "Processed"
              ? <><CheckCircle2 size={14} /> Payroll processed</>
              : <><IndianRupee  size={14} strokeWidth={2.5} /> Run payroll</>}
          </button>
        }
      />

      {/* Payroll summary banner */}
      <div className="payroll-banner">
        <div>
          <p className="payroll-banner-eyebrow">June 2026 Payroll</p>
          <strong className="payroll-banner-status">{state.payroll}</strong>
          <p className="payroll-banner-sub">Finalize before 28 June 2026.</p>
        </div>
        <div className="payroll-banner-right">
          <p className="payroll-banner-eyebrow">Estimated net pay</p>
          <strong className="payroll-banner-amount">{money(net)}</strong>
          <p className="payroll-banner-disburse">
            {state.payroll === "Processed" ? "✓ Disbursed" : "Pending run"}
          </p>
        </div>
      </div>

      <Stats items={[
        { icon: <IndianRupee size={18} />, iconClass: "coral",  label: "Gross payroll",  value: money(gross),       note: "For current workforce" },
        { icon: <TrendingDown size={18} />,iconClass: "yellow", label: "Deductions",      value: money(deductions),  note: "Tax, PF, and benefits" },
        { icon: <CheckCircle2 size={18} />,iconClass: "green",  label: "Net payroll",     value: money(net),         note: "Estimated payout"      },
        { icon: <Users size={18} />,                            label: "Employees",       value: state.employees.length, note: "Included in this run" },
      ]} />

      <article className="card">
        <DataTable headers={["Employee", "Annual CTC", "Gross/month", "Deductions", "Net pay", "Status"]}>
          {state.employees.map((emp) => {
            const monthly    = emp.salary / 12;
            const deduction  = monthly * 0.116;
            return (
              <tr key={emp.id}>
                <td><Person employee={emp} /></td>
                <td className="font-medium text-ink">{money(emp.salary)}</td>
                <td>{money(monthly)}</td>
                <td className="text-red-500">{money(deduction)}</td>
                <td><strong className="text-ink">{money(monthly - deduction)}</strong></td>
                <td>
                  <StatusBadge value={state.payroll === "Processed" ? "Approved" : "Draft"} />
                </td>
              </tr>
            );
          })}
        </DataTable>
      </article>
    </>
  );
}

/* ─── Performance ───────────────────────────────────────────── */

function Performance({
  state, notify,
}: {
  state: HrmsState;
  notify: (msg: string) => void;
}) {
  const sorted  = [...state.employees].sort((a, b) => b.score - a.score);
  const average = Math.round(sorted.reduce((s, e) => s + e.score, 0) / sorted.length);
  const topCount = sorted.filter((e) => e.score >= 88).length;

  return (
    <>
      <PageHeader
        kicker="Talent growth"
        title="Performance"
        description="Track goals, review outcomes, and recognize exceptional work."
        actions={
          <button className="btn primary" onClick={() => notify("Q3 review cycle started for all employees.")}>
            <Activity size={14} strokeWidth={2.5} />
            Start review cycle
          </button>
        }
      />

      <Stats items={[
        { icon: <Star size={18} />,        iconClass: "yellow", label: "Company score",  value: `${average}%`,  note: "Up 3 points this quarter" },
        { icon: <CheckCircle2 size={18} />,iconClass: "green",  label: "Reviews done",  value: "82%",           note: "203 submitted"            },
        { icon: <Award size={18} />,       iconClass: "purple", label: "Top performers",value: topCount,        note: "Score 88 or higher"       },
        { icon: <Target size={18} />,                           label: "Goals on track", value: "76%",          note: "Across all departments"   },
      ]} />

      <div className="page-grid cols-perf">
        <article className="card">
          <div className="card-head">
            <div>
              <h2>Performance leaderboard</h2>
              <p>Current review cycle · Q2 2026</p>
            </div>
            <span className="status approved">Live</span>
          </div>
          {sorted.map((emp, i) => (
            <div className="leader" key={emp.id}>
              <span className="text-[.72rem] font-bold text-muted">{i + 1}</span>
              <span className="avatar">{initials(emp.name)}</span>
              <div>
                <strong className="text-[.8rem] text-ink">{emp.name}</strong>
                <small>{emp.role}</small>
              </div>
              <div className="score-track" title={`${emp.score}%`}>
                <span style={{ width: `${emp.score}%` }} />
              </div>
              <span className="text-[.78rem] font-bold text-ink">{emp.score}</span>
            </div>
          ))}
        </article>

        <article className="card">
          <div className="card-head">
            <div>
              <h2>Goals by department</h2>
              <p>Completion vs. targets</p>
            </div>
          </div>
          {([
            ["Engineering", 84],
            ["Product",     79],
            ["Design",      91],
            ["Operations",  73],
            ["People",      88],
          ] as [string, number][]).map(([name, score]) => (
            <div className="dept-goal" key={name}>
              <div className="dept-goal-row">
                <strong>{name}</strong>
                <span>{score}%</span>
              </div>
              <div className="score-track">
                <span style={{ width: `${score}%` }} />
              </div>
            </div>
          ))}

          <button
            className="btn secondary dept-goal-export"
            onClick={() => notify("Department goals report exported.")}
          >
            <Download size={13} />
            Export goals report
          </button>
        </article>
      </div>
    </>
  );
}

/* ─── Reports ───────────────────────────────────────────────── */

const reportItems: {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  desc: string;
}[] = [
  { Icon: Users,       title: "Workforce summary",   desc: "Headcount, locations, and department breakdown."   },
  { Icon: Clock,       title: "Attendance trends",   desc: "Daily and weekly attendance patterns and anomalies." },
  { Icon: CalendarDays,title: "Leave utilization",   desc: "Leave types, balances, and usage over time."        },
  { Icon: IndianRupee, title: "Payroll register",    desc: "Monthly gross, deductions, and net pay summary."    },
  { Icon: Star,        title: "Performance review",  desc: "Scores, goals, and review completion status."       },
  { Icon: TrendingUp,  title: "Attrition analysis",  desc: "Turnover rates, risk flags, and retention signals." },
];

function Reports({
  state, navigate, notify,
}: {
  state: HrmsState;
  navigate: (page: PageId) => void;
  notify: (msg: string) => void;
}) {
  return (
    <>
      <PageHeader
        kicker="People analytics"
        title="Reports & insights"
        description="Turn workforce data into decision-ready reporting."
        actions={
          <button className="btn primary" onClick={() => navigate("ai")}>
            <Sparkles size={14} strokeWidth={2.5} />
            Create AI report
          </button>
        }
      />

      <div className="page-grid cols-reports">
        {reportItems.map(({ Icon, title, desc }) => (
          <article className="card flex gap-5" key={title}>
            <span className="stat-icon shrink-0 mt-0.5"><Icon size={18} strokeWidth={2} /></span>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-[.97rem] text-ink">{title}</h2>
              <p className="mt-2.5 mb-4 text-[.78rem] text-muted leading-relaxed">{desc}</p>
              <button
                className="text-[.76rem] font-semibold text-blue-500 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors"
                onClick={() => exportEmployees(state.employees, notify)}
              >
                Export report
                <ArrowUpRight size={13} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

/* ─── AI Workspace ──────────────────────────────────────────── */

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

function useStreamingChat(hrContext: object) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  async function send(text: string) {
    const content = text.trim();
    if (!content || isLoading) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content };
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);
    try {
      const history = [...messagesRef.current, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, hrContext }),
      });
      if (!res.ok || !res.body) throw new Error("API error");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I couldn't reach the AI. Please make sure ANTHROPIC_API_KEY is set in .env.local." }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { messages, input, setInput, isLoading, send };
}

function AiWorkspace({ state }: { state: HrmsState }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const hrContext = useMemo(() => {
    const present  = Object.values(state.attendance).filter((r) => ["Present", "Remote", "Late"].includes(r.status)).length;
    const onLeave  = Object.values(state.attendance).filter((r) => r.status === "Leave").length;
    const avg      = Math.round(state.employees.reduce((s, e) => s + e.score, 0) / (state.employees.length || 1));
    const depts    = [...new Set(state.employees.map((e) => e.department))];
    return {
      employeeCount:   state.employees.length,
      activeEmployees: state.employees.filter((e) => e.status === "Active").length,
      departments:     depts,
      presentToday:    present,
      onLeaveToday:    onLeave,
      pendingLeaves:   state.leaves.filter((l) => l.status === "Pending").length,
      avgScore:        avg,
      payrollStatus:   state.payroll,
    };
  }, [state]);

  const { messages, input, setInput, isLoading, send } = useStreamingChat(hrContext);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chips = [
    "Summarize today's workforce health",
    "Who needs attention this week?",
    "Analyze attrition risk",
    "Which leave requests are urgent?",
  ];

  return (
    <>
      <PageHeader
        kicker="PeopleFlow Intelligence"
        title="AI assistant"
        description="Ask questions across workforce, leave, payroll, and performance data."
      />

      <div className="page-grid cols-ai">
        {/* Chat panel */}
        <article className="ai-chat-card card">

          {/* Hero — shown only when no messages yet */}
          {messages.length === 0 && (
            <div className="ai-hero">
              <span className="spark"><Sparkles size={24} /></span>
              <h2>Your people data, understood</h2>
              <p>Ask anything about your workforce — powered by Claude AI with live HR context.</p>
              <div className="ai-hero-chips">
                {chips.map((c) => (
                  <button className="prompt-chip" key={c} onClick={() => send(c)}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Message thread */}
          {messages.length > 0 && (
            <div className="ai-messages">
              {messages.map((m) => (
                <div key={m.id} className={`ai-msg ai-msg-${m.role}`}>
                  {m.role === "assistant" && (
                    <span className="ai-msg-avatar"><Sparkles size={13} /></span>
                  )}
                  <div className="ai-msg-bubble">{m.content}</div>
                  {m.role === "user" && (
                    <span className="ai-msg-avatar">
                      <span className="avatar orange" style={{ width: "1.75rem", height: "1.75rem", fontSize: ".65rem" }}>SS</span>
                    </span>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="ai-msg ai-msg-assistant">
                  <span className="ai-msg-avatar"><Sparkles size={13} /></span>
                  <div className="ai-msg-bubble ai-msg-typing"><span /><span /><span /></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Input bar */}
          <form className="ai-input-bar" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <textarea
              className="ai-input-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your organization…"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
              }}
            />
            <button type="submit" className="btn primary ai-send-btn" disabled={isLoading || !input.trim()}>
              {isLoading
                ? <RefreshCw size={14} className="animate-spin" />
                : <Send size={14} strokeWidth={2.5} />}
            </button>
          </form>
        </article>

        {/* Sidebar */}
        <div className="ai-sidebar-panels">
          <article className="card">
            <div className="card-head">
              <div><h2>Live context</h2><p>Data sent to AI</p></div>
              <Database size={16} className="text-muted" />
            </div>
            {([
              [hrContext.employeeCount,   "Employees",          <Users        size={15} />],
              [hrContext.presentToday,    "Present today",      <Clock        size={15} />],
              [hrContext.pendingLeaves,   "Pending leaves",     <CalendarDays size={15} />],
              [hrContext.avgScore + "%",  "Avg perf score",     <TrendingUp   size={15} />],
            ] as const).map(([val, label, icon]) => (
              <div className="ai-context-row" key={String(label)}>
                <div className="ai-context-row-label"><span>{icon}</span><span>{label}</span></div>
                <strong className="ai-context-row-val">{val}</strong>
              </div>
            ))}
          </article>

          <article className="card">
            <div className="card-head">
              <div><h2>Capabilities</h2><p>What AI can do</p></div>
            </div>
            {[
              "Summarize workforce health",
              "Detect attendance anomalies",
              "Flag performance risks",
              "Generate payroll insights",
              "Predict attrition signals",
            ].map((cap) => (
              <div className="ai-cap-row" key={cap}><CheckCircle2 size={14} />{cap}</div>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}

/* ─── Settings ──────────────────────────────────────────────── */

const settingsSections = [
  { label: "Organization",  Icon: Building2   },
  { label: "Notifications", Icon: BellDot     },
  { label: "Security",      Icon: Shield      },
  { label: "Integrations",  Icon: PlugZap     },
  { label: "Data & privacy",Icon: Lock        },
];

function Settings({ setState, notify }: Pick<StateProps, "setState" | "notify">) {
  const [section, setSection] = useState("Organization");

  return (
    <>
      <PageHeader
        kicker="Administration"
        title="Settings"
        description="Configure organization, preferences, and workspace data."
      />

      <div className="page-grid cols-settings">
        {/* Sidebar nav */}
        <article className="settings-nav-card card">
          {settingsSections.map(({ label, Icon }) => (
            <button
              key={label}
              className={`settings-nav-btn${section === label ? " active" : ""}`}
              onClick={() => setSection(label)}
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </button>
          ))}
        </article>

        {/* Main panel — content switches by section */}
        <article className="card">
          {section === "Organization" && (
            <>
              <div className="card-head">
                <div><h2>Organization profile</h2><p>Used across reports and employee documents.</p></div>
                <FileText size={18} className="text-muted" />
              </div>
              <div className="settings-grid">
                <label>Company name<input defaultValue="PeopleFlow Technologies" /></label>
                <label>Company ID<input value="PF-IND-2026" disabled readOnly className="opacity-60" /></label>
                <label>Industry
                  <select defaultValue="Technology">
                    <option>Technology</option><option>Finance</option>
                    <option>Healthcare</option><option>Education</option>
                  </select>
                </label>
                <label>Company size
                  <select defaultValue="50-200">
                    <option>1-50</option><option>50-200</option>
                    <option>200-500</option><option>500+</option>
                  </select>
                </label>
                <label>Timezone
                  <select defaultValue="Asia/Kolkata">
                    <option>Asia/Kolkata (IST)</option><option>UTC</option>
                    <option>America/New_York (EST)</option><option>Europe/London (GMT)</option>
                  </select>
                </label>
                <label>Currency
                  <select defaultValue="INR">
                    <option>INR — Indian Rupee</option><option>USD — US Dollar</option><option>EUR — Euro</option>
                  </select>
                </label>
                <label>Work week starts
                  <select defaultValue="Monday"><option>Monday</option><option>Sunday</option></select>
                </label>
                <label>Financial year starts
                  <select defaultValue="April"><option>April</option><option>January</option></select>
                </label>
              </div>
              <div className="settings-footer">
                <button className="btn danger" onClick={async () => {
                  try { await fetch("/api/seed", { method: "POST" }); } catch { /* DB unavailable */ }
                  setState(seedState);
                  notify("Demo data has been reset.");
                }}>
                  <RefreshCw size={13} />Reset demo data
                </button>
                <button className="btn primary" onClick={() => notify("Settings saved successfully.")}>
                  <Check size={14} strokeWidth={2.5} />Save changes
                </button>
              </div>
            </>
          )}

          {section === "Notifications" && (
            <>
              <div className="card-head">
                <div><h2>Notifications</h2><p>Choose how and when PeopleFlow alerts you.</p></div>
                <BellDot size={18} className="text-muted" />
              </div>
              <div className="settings-checks">
                {[
                  ["Email me when a leave request needs approval", true],
                  ["Notify on payroll deadlines", true],
                  ["Weekly workforce digest", true],
                  ["Alert on unusual attendance patterns", false],
                  ["Monthly HR report summary", false],
                ].map(([label, checked]) => (
                  <label key={String(label)} className="settings-check-row">
                    <input type="checkbox" defaultChecked={Boolean(checked)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <div className="settings-footer">
                <span />
                <button className="btn primary" onClick={() => notify("Notification preferences saved.")}>
                  <Check size={14} strokeWidth={2.5} />Save changes
                </button>
              </div>
            </>
          )}

          {section === "Security" && (
            <>
              <div className="card-head">
                <div><h2>Security</h2><p>Manage passwords, 2FA, and active sessions.</p></div>
                <Shield size={18} className="text-muted" />
              </div>
              <div className="settings-grid">
                <label>Current password<input type="password" placeholder="••••••••" /></label>
                <label>New password<input type="password" placeholder="••••••••" /></label>
                <label>Confirm new password<input type="password" placeholder="••••••••" /></label>
              </div>
              <div className="settings-section-divider">
                <h3>Two-factor authentication</h3>
                <p>Add an extra layer of security to your account.</p>
                <label className="settings-check-row">
                  <input type="checkbox" />
                  <span>Enable 2FA via authenticator app</span>
                </label>
              </div>
              <div className="settings-section-divider">
                <h3>Active sessions</h3>
                <p>You are currently signed in on 1 device.</p>
                <button className="btn danger" style={{ marginTop: ".75rem" }} onClick={() => notify("All other sessions signed out.")}>
                  <LogOut size={13} />Sign out all other sessions
                </button>
              </div>
              <div className="settings-footer">
                <span />
                <button className="btn primary" onClick={() => notify("Security settings saved.")}>
                  <Check size={14} strokeWidth={2.5} />Update password
                </button>
              </div>
            </>
          )}

          {section === "Integrations" && (
            <>
              <div className="card-head">
                <div><h2>Integrations</h2><p>Connect third-party tools to your workspace.</p></div>
                <PlugZap size={18} className="text-muted" />
              </div>
              <div className="integrations-list">
                {[
                  { name: "Slack",         desc: "Send HR alerts to your Slack channels.",       connected: true  },
                  { name: "Google Workspace", desc: "Sync employee directory with Google.",      connected: true  },
                  { name: "Jira",          desc: "Link performance goals to project tasks.",      connected: false },
                  { name: "Zoom",          desc: "Schedule HR meetings directly from PeopleFlow.", connected: false },
                  { name: "QuickBooks",    desc: "Export payroll data to your accounting tool.", connected: false },
                ].map(({ name, desc, connected }) => (
                  <div className="integration-row" key={name}>
                    <div>
                      <strong>{name}</strong>
                      <p>{desc}</p>
                    </div>
                    <button
                      className={`btn ${connected ? "secondary" : "primary"}`}
                      onClick={() => notify(connected ? `${name} disconnected.` : `${name} connected.`)}
                    >
                      {connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === "Data & privacy" && (
            <>
              <div className="card-head">
                <div><h2>Data & privacy</h2><p>Control your organization's data and compliance settings.</p></div>
                <Lock size={18} className="text-muted" />
              </div>
              <div className="settings-checks">
                {[
                  ["Allow anonymized usage analytics", true],
                  ["Share aggregate benchmarks with PeopleFlow", false],
                ].map(([label, checked]) => (
                  <label key={String(label)} className="settings-check-row">
                    <input type="checkbox" defaultChecked={Boolean(checked)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <div className="settings-section-divider">
                <h3>Data export</h3>
                <p>Download a full copy of your organization's HR data.</p>
                <button className="btn secondary" style={{ marginTop: ".75rem" }} onClick={() => notify("Data export requested. You'll receive an email shortly.")}>
                  <Download size={13} />Export all data
                </button>
              </div>
              <div className="settings-section-divider">
                <h3>Reset demo data</h3>
                <p>Restore all data to the original demo state. This cannot be undone.</p>
                <button className="btn danger" style={{ marginTop: ".75rem" }} onClick={async () => {
                  try { await fetch("/api/seed", { method: "POST" }); } catch { /* DB unavailable */ }
                  setState(seedState);
                  notify("Demo data has been reset.");
                }}>
                  <RefreshCw size={13} />Reset demo data
                </button>
              </div>
            </>
          )}
        </article>
      </div>
    </>
  );
}

/* ─── Shared types & helpers ────────────────────────────────── */

type StateProps = {
  state:    HrmsState;
  setState: React.Dispatch<React.SetStateAction<HrmsState>>;
  notify:   (msg: string) => void;
};

function exportEmployees(employees: Employee[], notify: (msg: string) => void) {
  const rows = [
    ["ID", "Name", "Role", "Department", "Email", "Status", "Location", "Joined"],
    ...employees.map((e) => [e.id, e.name, e.role, e.department, e.email, e.status, e.location, e.joined]),
  ];
  const csv  = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.href  = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = "peopleflow-employees.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  notify("Report downloaded successfully.");
}
