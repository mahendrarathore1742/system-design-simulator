"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { motion } from "framer-motion";
import type { ComponentNodeData } from "@/store/canvasStore";
import { Server } from "lucide-react";
import { ICON_MAP } from "@/lib/icons";

type ComponentNode = Node<ComponentNodeData, "component">;

const CATEGORY_COLORS: Record<string, { border: string; icon: string; glow: string }> = {
  networking: { border: "border-blue-500/40", icon: "text-blue-400", glow: "shadow-blue-500/20" },
  compute: { border: "border-violet-500/40", icon: "text-violet-400", glow: "shadow-violet-500/20" },
  storage: { border: "border-amber-500/40", icon: "text-amber-400", glow: "shadow-amber-500/20" },
  messaging: { border: "border-emerald-500/40", icon: "text-emerald-400", glow: "shadow-emerald-500/20" },
  infrastructure: { border: "border-cyan-500/40", icon: "text-cyan-400", glow: "shadow-cyan-500/20" },
};

const STATUS_RING: Record<string, string> = {
  healthy: "ring-emerald-500/60",
  warning: "ring-amber-500/60",
  critical: "ring-rose-500/60",
  idle: "ring-zinc-700/60",
};

function ComponentNodeInner({ data, selected }: NodeProps<ComponentNode>) {
  const nodeData = data;
  const Icon = ICON_MAP[nodeData.icon] ?? Server;
  const colors = CATEGORY_COLORS[nodeData.category] ?? CATEGORY_COLORS.compute;
  const status = (nodeData.status as string) ?? "idle";
  const statusRing = STATUS_RING[status] ?? STATUS_RING.idle;
  const isBottleneck = nodeData.isBottleneck ?? false;
  const replicas = nodeData.replicas ?? 1;
  const utilization = nodeData.utilization ?? 0;

  return (
    <motion.div
      animate={
        isBottleneck
          ? {
              boxShadow: [
                "0 0 0px rgba(239,68,68,0)",
                "0 0 20px rgba(239,68,68,0.4)",
                "0 0 0px rgba(239,68,68,0)",
              ],
            }
          : {}
      }
      transition={isBottleneck ? { duration: 1.5, repeat: Infinity } : {}}
      className={`
        relative flex flex-col items-center gap-1.5 rounded-xl border bg-zinc-800/90 px-5 py-4
        backdrop-blur-sm transition-all duration-200
        ${colors.border}
        ${selected ? `ring-2 ring-cyan-400/80 ${colors.glow} shadow-lg` : "shadow-md shadow-black/30"}
        ${isBottleneck ? "border-rose-500/60" : ""}
      `}
    >
      {/* Status indicator dot */}
      <div className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ring-2 ${statusRing} ${
        status === "healthy" ? "bg-emerald-500" :
        status === "warning" ? "bg-amber-500" :
        status === "critical" ? "bg-rose-500" : "bg-zinc-600"
      }`} style={{ animation: status !== 'idle' ? 'status-pulse 2s infinite' : 'none' }} />

      {/* Icon */}
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-700/50 ${colors.icon}`}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Label */}
      <span className="max-w-[90px] truncate text-[10px] font-medium text-zinc-300">
        {nodeData.label}
      </span>
      <span className="font-mono text-[8px] text-zinc-400">{nodeData.maxQPS === Infinity ? '∞' : ((nodeData.maxQPS ?? 0)/1000).toFixed(0) + 'k'} qps</span>

      {/* Replicas badge */}
      {replicas > 1 && (
        <span className="absolute -left-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-600 px-1 text-[8px] font-bold text-white">
          ×{replicas}
        </span>
      )}

      {/* Utilization bar (shown during simulation) */}
      {utilization > 0 && (
        <div className="mt-0.5 flex w-full items-center gap-1">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className={`h-full rounded-full ${
                utilization > 0.8 ? "bg-rose-500" : utilization > 0.5 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(utilization * 100, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className={`font-mono text-[7px] ${
            utilization > 0.8 ? "text-rose-400" : utilization > 0.5 ? "text-amber-400" : "text-emerald-400"
          }`}>{(utilization * 100).toFixed(0)}%</span>
        </div>
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !rounded-full !border-2 !border-zinc-700 !bg-zinc-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !rounded-full !border-2 !border-zinc-700 !bg-zinc-500"
      />
    </motion.div>
  );
}

function areComponentNodePropsEqual(
  prev: NodeProps<ComponentNode>,
  next: NodeProps<ComponentNode>
): boolean {
  if (prev.selected !== next.selected) return false;
  const p = prev.data;
  const n = next.data;
  return (
    p.componentId === n.componentId &&
    p.label === n.label &&
    p.status === n.status &&
    p.replicas === n.replicas &&
    p.utilization === n.utilization &&
    p.maxQPS === n.maxQPS &&
    p.latencyMs === n.latencyMs &&
    p.category === n.category &&
    p.icon === n.icon &&
    p.isBottleneck === n.isBottleneck
  );
}

export const ComponentNode = memo(ComponentNodeInner, areComponentNodePropsEqual);
