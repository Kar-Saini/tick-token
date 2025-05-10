"use client";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Appbar = () => {
  const router = useRouter();
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div
          className="flex items-center gap-3 hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Sparkles className="h-8 w-8 text-purple-600" />
          <span className="font-bold text-3xl text-gray-800">
            TokenXperience
          </span>
        </div>
      </div>
    </header>
  );
};

export default Appbar;
