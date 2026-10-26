"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-12 text-center">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="mt-4 inline-block rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
