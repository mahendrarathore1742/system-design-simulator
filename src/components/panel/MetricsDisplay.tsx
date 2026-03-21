"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useSimulationStore } from "@/store/simulationStore";
import { useCanvasStore } from "@/store/canvasStore";

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
      <div className="py-8 text-center text-xs text-zinc-600">
        Run a simulation to see metrics
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
        <div className="rounded-lg bg-zinc-800/40 px-2.5 py-2">
          <p className="text-[9px] text-zinc-500">Throughput</p>
          <p className="font-mono text-sm font-semibold text-cyan-400">
            {result.throughput.toLocaleString()}
          </p>
          <p className="text-[9px] text-zinc-600">req/s</p>
        </div>
        <div className="rounded-lg bg-zinc-800/40 px-2.5 py-2">
          <p className="text-[9px] text-zinc-500">Total Latency</p>
          <p className="font-mono text-sm font-semibold text-cyan-400">
            {result.totalLatencyMs.toFixed(0)}
          </p>
          <p className="text-[9px] text-zinc-600">ms (longest path)</p>
        </div>
      </div>

      {result.bottleneckNodes.length > 0 && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-2.5 py-2">
          <p className="text-[10px] font-medium text-rose-400">
            {result.bottleneckNodes.length} Bottleneck{result.bottleneckNodes.length > 1 ? "s" : ""} Detected
          </p>
        </div>
      )}

      {/* Per-node metrics */}
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
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
                className="rounded-lg bg-zinc-800/30 px-2.5 py-2"
              >
                <div className="mb-1 flex items-center gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[m.status]}`} />
                  <span className="text-[11px] font-medium text-zinc-300">
                    {label}
                  </span>
                  {m.isBottleneck && (
                    <span className="ml-auto text-[9px] font-medium text-rose-400" style={{ animation: 'status-pulse 2s infinite' }}>
                      BOTTLENECK
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[8px] text-zinc-600">QPS</p>
                    <p className="font-mono text-[10px] text-zinc-400">
                      {m.incomingQPS.toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] text-zinc-600">Util</p>
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
                      <p className={`font-mono text-[10px] ${
                        m.utilization > 0.8 ? "text-rose-400" :
                        m.utilization > 0.5 ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {(m.utilization * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] text-zinc-600">Latency</p>
                    <p className="font-mono text-[10px] text-zinc-400">
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
