"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useSimulationStore } from "@/store/simulationStore";
import { useCanvasStore } from "@/store/canvasStore";
import { Activity } from "lucide-react";

const STATUS_COLOR: Record<string, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-rose-500",
  idle: "bg-zinc-600",
};

export function MetricsDisplay() {
  const result = useSimulationStore((s) => s.result);
  const nodes = useCanvasStore((s) => s.nodes);

  if (!result) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/80">
          <Activity className="h-5 w-5 text-zinc-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-zinc-400">No simulation data</p>
          <p className="mt-1 max-w-[200px] text-xs text-zinc-400">
            Configure load and click Run Simulation to see real-time metrics
          </p>
        </div>
      </div>
    );
  }

  const sortedMetrics = [...result.nodeMetrics.values()].sort(
    (a, b) => b.utilization - a.utilization
  );

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-zinc-800/60 px-2.5 py-2">
          <p className="text-[11px] text-zinc-400">Throughput</p>
          <p className="font-mono text-sm font-semibold text-cyan-400">
            {result.throughput.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-400">req/s</p>
        </div>
        <div className="rounded-lg bg-zinc-800/60 px-2.5 py-2">
          <p className="text-[11px] text-zinc-400">Total Latency</p>
          <p className="font-mono text-sm font-semibold text-cyan-400">
            {result.totalLatencyMs.toFixed(0)}
          </p>
          <p className="text-[11px] text-zinc-400">ms (longest path)</p>
        </div>
      </div>

      {result.bottleneckNodes.length > 0 && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-2.5 py-2">
          <p className="text-xs font-medium text-rose-400">
            {result.bottleneckNodes.length} Bottleneck{result.bottleneckNodes.length > 1 ? "s" : ""} Detected
          </p>
        </div>
      )}

      {/* Per-node metrics */}
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Per-Node Metrics
      </p>

      <ScrollArea className="max-h-[300px]">
        <div className="space-y-1.5">
          {sortedMetrics.map((m) => {
            const node = nodes.find((n) => n.id === m.nodeId);
            const label = node?.data?.label ?? m.nodeId;
            return (
              <div
                key={m.nodeId}
                className="rounded-lg bg-zinc-800/50 px-2.5 py-2"
              >
                <div className="mb-1 flex items-center gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[m.status]}`} />
                  <span className="text-xs font-medium text-zinc-300">
                    {label}
                  </span>
                  {m.isBottleneck && (
                    <span className="ml-auto text-[11px] font-medium text-rose-400" style={{ animation: 'status-pulse 2s infinite' }}>
                      BOTTLENECK
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[10px] text-zinc-400">QPS</p>
                    <p className="font-mono text-xs text-zinc-300">
                      {m.incomingQPS.toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400">Util</p>
                    <div className="flex items-center gap-1">
                      <div className="h-1 w-8 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className={`h-full rounded-full ${
                            m.utilization > 0.8 ? "bg-rose-500" :
                            m.utilization > 0.5 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(m.utilization * 100, 100)}%` }}
                        />
                      </div>
                      <p className={`font-mono text-xs ${
                        m.utilization > 0.8 ? "text-rose-400" :
                        m.utilization > 0.5 ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {(m.utilization * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400">Latency</p>
                    <p className="font-mono text-xs text-zinc-300">
                      {m.latencyMs.toFixed(0)}ms
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
