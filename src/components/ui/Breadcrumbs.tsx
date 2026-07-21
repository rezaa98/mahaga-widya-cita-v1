"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbsProps {
  items: {
    label: string;
    href?: string;
  }[];
  isDarkBg?: boolean;
}

export function Breadcrumbs({ items, isDarkBg = false }: BreadcrumbsProps) {
  return (
    <nav
      className={`scrollbar-hide mb-6 flex items-center space-x-1 overflow-x-auto pb-2 text-sm whitespace-nowrap sm:mb-8 sm:space-x-2 ${
        isDarkBg ? "text-white/80" : "text-gray-600"
      }`}
    >
      <Link
        href="/"
        className={`flex shrink-0 items-center transition-colors ${
          isDarkBg ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-primary-600"
        }`}
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className={`h-4 w-4 shrink-0 ${isDarkBg ? "text-white/60" : "text-gray-400"}`} />
            {isLast || !item.href ? (
              <span
                className={`max-w-[200px] truncate sm:max-w-none ${
                  isDarkBg ? "font-semibold text-white" : "font-semibold text-gray-900"
                }`}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={`shrink-0 transition-colors ${
                  isDarkBg ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-primary-600"
                }`}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
