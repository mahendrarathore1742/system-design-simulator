"use client";

import type { DragEvent } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SYSTEM_COMPONENTS,
  COMPONENT_CATEGORIES,
} from "@/data/components";
import {
  Globe,
  Cloudy,
  Network,
  Router,
  ShieldAlert,
  Server,
  KeyRound,
  Database,
  HardDrive,
  Zap,
  Archive,
  Search,
  MessageSquare,
  GitBranch,
  Activity,
  GripVertical,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Cloudy, Network, Router, ShieldAlert, Server, KeyRound,
  Database, HardDrive, Zap, Archive, Search, MessageSquare, GitBranch, Activity,
};

const CATEGORY_ACCENT: Record<string, string> = {
  networking: "text-blue-400",
  compute: "text-violet-400",
  storage: "text-amber-400",
  messaging: "text-emerald-400",
  infrastructure: "text-cyan-400",
};

const CATEGORY_BORDER: Record<string, string> = {
  networking: "border-l-blue-400",
  compute: "border-l-violet-400",
  storage: "border-l-amber-400",
  messaging: "border-l-emerald-400",
  infrastructure: "border-l-cyan-400",
};

export function ComponentPalette() {
  function handleDragStart(e: DragEvent, componentId: string) {
    e.dataTransfer.setData("application/systemsim-component", componentId);
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-3">
        {COMPONENT_CATEGORIES.map((cat) => {
          const items = SYSTEM_COMPONENTS.filter(
            (c) => c.category === cat.key
          );
          return (
            <div key={cat.key}>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {cat.label} ({items.length})
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = ICON_MAP[item.icon] ?? Server;
                  const accent = CATEGORY_ACCENT[item.category] ?? "text-cyan-400";
                  const borderColor = CATEGORY_BORDER[item.category] ?? "border-l-cyan-400";
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className={`group flex cursor-grab items-center gap-2 rounded-md border-l-2 px-2 py-1.5 text-xs text-zinc-400 transition-all hover:bg-zinc-800/80 hover:text-zinc-200 hover:translate-x-0.5 active:cursor-grabbing ${borderColor}`}
                      title={item.description}
                    >
                      <GripVertical className="h-3 w-3 shrink-0 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      <Icon className={`h-3.5 w-3.5 shrink-0 transition-colors ${accent}`} />
                      <span className="truncate">{item.label}</span>
                      <span className="ml-auto shrink-0 text-[9px] text-zinc-600">
                        {item.maxQPS === Infinity ? "∞" : `${(item.maxQPS / 1000).toFixed(0)}k`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
