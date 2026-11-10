"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { updateUserProfile } from "@/lib/actions/users";

interface EditProfileButtonProps {
  username: string;
  bio: string | null;
}

export default function EditProfileButton({ username, bio }: EditProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await updateUserProfile(formData);
        if ("error" in result) {
          setError(result.error || "Failed to update your profile.");
          return;
        }

        await update();
        setIsOpen(false);
        router.replace(`/profile/${encodeURIComponent(result.username)}`);
        router.refresh();
      } catch {
        setError("Failed to update your profile. Please try again.");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="retro-btn py-1.5 px-3 text-[11px] flex items-center gap-1.5 cursor-pointer"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit profile
      </button>

      {isOpen && (
        <div
          className="avatar-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isPending) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="avatar-modal"
          >
            <div className="glossy-header text-xs flex items-center justify-between rounded-t">
              <h2 id="edit-profile-title">Edit profile</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                aria-label="Close edit profile"
                className="text-white hover:text-amber-300 cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-[#1b2631] space-y-3">
              <div className="flex flex-col space-y-1 text-xs">
                <label htmlFor="profile-username" className="font-bold text-slate-600 dark:text-slate-400">
                  Username
                </label>
                <input
                  id="profile-username"
                  name="username"
                  type="text"
                  defaultValue={username}
                  minLength={3}
                  maxLength={20}
                  pattern="[A-Za-z0-9_]+"
                  autoComplete="username"
                  required
                  className="bg-white dark:bg-[#1a2530] text-slate-800 dark:text-slate-200 p-2 rounded border border-slate-400 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-[#105289] w-full shadow-inner"
                />
                <span className="text-[10px] text-slate-500">3–20 letters, numbers, or underscores.</span>
              </div>

              <div className="flex flex-col space-y-1 text-xs">
                <label htmlFor="profile-bio" className="font-bold text-slate-600 dark:text-slate-400">
                  Bio
                </label>
                <textarea
                  id="profile-bio"
                  name="bio"
                  defaultValue={bio || ""}
                  maxLength={500}
                  rows={4}
                  className="bg-white dark:bg-[#1a2530] text-slate-800 dark:text-slate-200 p-2 rounded border border-slate-400 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-[#105289] w-full shadow-inner resize-y"
                />
                <span className="text-[10px] text-slate-500">Up to 500 characters.</span>
              </div>

              {error && (
                <div role="alert" className="text-xs text-red-600 bg-red-50 dark:bg-[#2a1b1b] border border-red-200 dark:border-red-950 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="retro-btn-gray py-1.5 px-3 text-[11px] cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="retro-btn-green py-1.5 px-3 text-[11px] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {isPending ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}