"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Play, Square } from "lucide-react";
import { useSimulationStore } from "@/store/simulationStore";

const PRESETS = [
  { label: "Light", value: 1000 },
  { label: "Medium", value: 10000 },
  { label: "Heavy", value: 100000 },
  { label: "Stress", value: 500000 },
];

interface SimulationControlsProps {
  onSimulate: () => void;
}

export function SimulationControls({ onSimulate }: SimulationControlsProps) {
  const config = useSimulationStore((s) => s.config);
  const setConfig = useSimulationStore((s) => s.setConfig);
  const isRunning = useSimulationStore((s) => s.isRunning);

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        Simulation Config
      </p>

      {/* Presets */}
      <div className="flex gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => setConfig({ requestsPerSec: preset.value })}
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
              config.requestsPerSec === preset.value
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-zinc-800/60 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-[11px] text-zinc-400">Requests/sec</label>
            <span className="font-mono text-[11px] text-cyan-400">
              {config.requestsPerSec.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[config.requestsPerSec]}
            onValueChange={(v) => setConfig({ requestsPerSec: Array.isArray(v) ? v[0] : v })}
            min={100}
            max={500000}
            step={100}
            className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-cyan-500 [&_[role=slider]]:bg-cyan-500"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-[11px] text-zinc-400">Duration (sec)</label>
            <span className="font-mono text-[11px] text-cyan-400">
              {config.durationSec}s
            </span>
          </div>
          <Slider
            value={[config.durationSec]}
            onValueChange={(v) => setConfig({ durationSec: Array.isArray(v) ? v[0] : v })}
            min={1}
            max={60}
            step={1}
            className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-cyan-500 [&_[role=slider]]:bg-cyan-500"
          />
        </div>
      </div>

      <Separator className="bg-zinc-800/60" />

      <Button
        onClick={onSimulate}
        disabled={isRunning}
        className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-400 hover:to-indigo-400 pulse-glow disabled:opacity-50"
        size="sm"
      >
        {isRunning ? (
          <>
            <Square className="h-3 w-3" />
            Running...
          </>
        ) : (
          <>
            <Play className="h-3 w-3" />
            Run Simulation
          </>
        )}
      </Button>
    </div>
  );
}
