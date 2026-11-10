"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Mail, Search, Sun, Moon, LogOut, User, Menu, X } from "lucide-react";
import { getUnreadNotificationCount } from "@/lib/actions/notifications";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Poll for notification counts every 20 seconds
  useEffect(() => {
    if (session) {
      const fetchCounts = async () => {
        const count = await getUnreadNotificationCount();
        setUnreadCount(count);
      };
      fetchCounts();
      const interval = setInterval(fetchCounts, 20000);
      return () => clearInterval(interval);
    }
  }, [session, pathname]);

  // Dark Mode Client Hook
  useEffect(() => {
    const root = window.document.documentElement;
    const initialDark = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    if (initialDark) {
      root.classList.add("dark");
      setDarkMode(true);
    } else {
      root.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-[#105289] glossy-header border-b border-[#0e4471]">
      <div className="relative max-w-[1100px] w-full mx-auto flex flex-wrap items-center justify-between gap-y-2 py-1.5 px-3">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link href="/" className="flex items-center space-x-1">
            <span className="text-xl font-black tracking-tight text-white font-serif drop-shadow-md">
              Retro<span className="text-amber-400">link</span>
            </span>
            <span className="bg-amber-500 text-[9px] text-slate-900 font-extrabold uppercase px-1 rounded border border-amber-600 shadow-sm ml-1 select-none">
              Beta
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
            <input
              type="text"
              placeholder="Search forums, posts, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-[#1a2530] text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1.5 rounded-l border border-slate-400 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-[#105289] w-64 shadow-inner"
            />
            <button
              type="submit"
              className="bg-gradient-to-bottom from-[#ffffff] to-[#e6e6e6] dark:from-[#2c3e50] dark:to-[#1c2733] border-y border-r border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-2 py-1.5 rounded-r cursor-pointer hover:bg-slate-100 flex items-center justify-center active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Action Menu */}
        <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 sm:gap-4">
          {/* Main Links */}
          <nav className="hidden sm:flex items-center gap-2 sm:gap-3 text-xs font-bold text-white whitespace-nowrap">
            <Link href="/" className="hover:text-amber-300 transition-colors">
              Board Index
            </Link>
            <Link href="/forums" className="hover:text-amber-300 transition-colors">
              Communities
            </Link>
          </nav>

          {/* Vertical Separator */}
          <div className="w-px h-5 bg-[#337bb5] hidden sm:block"></div>

          {/* Theme and desktop inbox shortcuts */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              title="Toggle Dark Mode Theme"
              className="p-1 hover:bg-[#337bb5] rounded text-slate-200 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {session && (
              <div className="hidden sm:flex items-center space-x-2">
                {/* Messages */}
                <Link
                  href="/messages"
                  title="Private Messages Inbox"
                  className="p-1 hover:bg-[#337bb5] rounded text-slate-200 transition-colors relative flex items-center"
                >
                  <Mail className="w-4 h-4" />
                </Link>

                {/* Notifications */}
                <Link
                  href="/notifications"
                  title="Alert Notifications"
                  className="p-1 hover:bg-[#337bb5] rounded text-slate-200 transition-colors relative flex items-center"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-[8px] text-white px-1 py-0.5 rounded font-black leading-none border border-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </div>

          {/* User profile capsule or login trigger */}
          <div className="hidden sm:flex items-center space-x-2 text-xs">
            {session ? (
              <div className="flex items-center space-x-2">
                <div className="hidden lg:flex flex-col text-right leading-tight">
                  <Link
                    href={`/profile/${session.user.username}`}
                    className="font-bold text-white hover:underline hover:text-amber-300"
                  >
                    {session.user.username}
                  </Link>
                  <span className="text-[10px] text-slate-200">
                    Karma: <strong className="text-amber-300">{session.user.reputation}</strong>
                  </span>
                </div>
                {/* User Avatar */}
                <Link href={`/profile/${session.user.username}`}>
                  {session.user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.avatarUrl}
                      alt={session.user.username}
                      className="w-7 h-7 bg-white dark:bg-[#1a2530] rounded border border-slate-300 p-0.5 shadow-sm hover:opacity-90"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-slate-300 dark:bg-slate-700 flex items-center justify-center rounded border border-slate-400">
                      <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    </div>
                  )}
                </Link>
                {/* Log out */}
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  title="Log Out"
                  className="bg-transparent hover:bg-red-700 text-white rounded p-1 transition-colors cursor-pointer border border-[#337bb5] hover:border-red-800"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <Link
                  href="/login"
                  className="bg-[#3b5998] hover:bg-[#2d4373] text-white px-2 py-1 rounded border border-[#2d4373] font-bold text-[11px]"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-2 py-1 rounded border border-amber-600 font-bold text-[11px] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            className="sm:hidden p-1.5 rounded border border-[#337bb5] text-white hover:bg-[#337bb5] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-navigation-menu"
            className="absolute left-3 right-3 top-full z-50 sm:hidden board-container rounded overflow-hidden bg-white dark:bg-[#1b2631]"
          >
            <form onSubmit={handleSearchSubmit} className="flex gap-2 p-3 border-b border-slate-200 dark:border-slate-700">
              <input
                type="search"
                aria-label="Search forums, posts, and users"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-0 flex-1 bg-white dark:bg-[#1a2530] text-slate-800 dark:text-slate-200 text-xs px-2.5 py-2 rounded border border-slate-400 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-[#105289] shadow-inner"
              />
              <button
                type="submit"
                aria-label="Search"
                className="retro-btn px-3 cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <nav className="grid grid-cols-2 p-2 text-xs font-bold">
              <Link href="/" className="flex items-center px-3 py-3 text-slate-700 dark:text-slate-200 hover:bg-[#e6eff6] dark:hover:bg-[#223141]">
                Board Index
              </Link>
              <Link href="/forums" className="flex items-center px-3 py-3 text-slate-700 dark:text-slate-200 hover:bg-[#e6eff6] dark:hover:bg-[#223141]">
                Communities
              </Link>
              {session ? (
                <>
                  <Link href={`/profile/${session.user.username}`} className="flex items-center px-3 py-3 text-slate-700 dark:text-slate-200 hover:bg-[#e6eff6] dark:hover:bg-[#223141]">
                    My profile
                  </Link>
                  <Link href="/messages" className="flex items-center px-3 py-3 text-slate-700 dark:text-slate-200 hover:bg-[#e6eff6] dark:hover:bg-[#223141]">
                    Messages
                  </Link>
                  <Link href="/notifications" className="flex items-center px-3 py-3 text-slate-700 dark:text-slate-200 hover:bg-[#e6eff6] dark:hover:bg-[#223141]">
                    Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
                  </Link>
                  <Link href="/forums/create" className="flex items-center px-3 py-3 text-slate-700 dark:text-slate-200 hover:bg-[#e6eff6] dark:hover:bg-[#223141]">
                    Start Community
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center px-3 py-3 text-left text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="flex items-center px-3 py-3 text-slate-700 dark:text-slate-200 hover:bg-[#e6eff6] dark:hover:bg-[#223141]">
                    Log in
                  </Link>
                  <Link href="/register" className="flex items-center px-3 py-3 text-slate-700 dark:text-slate-200 hover:bg-[#e6eff6] dark:hover:bg-[#223141]">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
