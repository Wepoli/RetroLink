"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-6 bg-[#f4f8fb] dark:bg-[#1a2530] border border-[#a1b7cd] dark:border-slate-800 rounded p-4 text-[11px] text-slate-600 dark:text-slate-400">
      <div className="flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-400">
        <div>
          Powered by <strong className="text-slate-500 dark:text-slate-400">Retrolink Social Forum v1.0.0</strong> &copy; 2010-2026.
        </div>
        <div className="mt-2 md:mt-0 flex items-center space-x-2">
          <span>All times are UTC+01:00</span>
          <span>&bull;</span>
          <Link href="/forums" className="hover:underline">Contact Admin</Link>
          <span>&bull;</span>
          <Link href="/forums" className="hover:underline">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}
