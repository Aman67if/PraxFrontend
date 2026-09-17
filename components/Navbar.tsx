"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

interface NavbarProps {
  title?: string;
  subtitle?: string;
  profileImage?: string | null;
  userName?: string;
}

export function Navbar({
  title,
  subtitle,
  profileImage,
  userName,
}: NavbarProps) {
  const router = useRouter();

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-5 lg:px-8 py-3">
        {/* Left: Title */}
        <div className="flex-1 min-w-0">
          {title && (
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 truncate mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right: Profile avatar — navigates to /profile */}
        <button
          onClick={() => router.push("/profile")}
          className="flex-shrink-0 ml-4 group"
          aria-label="Go to profile"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-brand-400 transition-all shadow-sm group-hover:shadow-md">
            {profileImage ? (
              <img
                src={profileImage}
                alt={userName || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {initials}
                </span>
              </div>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
