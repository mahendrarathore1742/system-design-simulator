"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Trophy,
  ChevronDown,
  Zap,
  PanelLeft,
  PanelRight,
  Trash2,
  Download,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useCanvasStore } from "@/store/canvasStore";
import { PROBLEMS } from "@/data/problems";
import type { Node } from "@xyflow/react";
import { getComponentById } from "@/data/components";
import type { ComponentNodeData } from "@/store/canvasStore";

interface TopBarProps {
  onSimulate: () => void;
  onScore: () => void;
}

export function TopBar({ onSimulate, onScore }: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedProblemId = useAppStore((s) => s.selectedProblemId);
  const setSelectedProblem = useAppStore((s) => s.setSelectedProblem);
  const leftSidebarOpen = useAppStore((s) => s.leftSidebarOpen);
  const rightPanelOpen = useAppStore((s) => s.rightPanelOpen);
  const toggleLeftSidebar = useAppStore((s) => s.toggleLeftSidebar);
  const toggleRightPanel = useAppStore((s) => s.toggleRightPanel);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const showToast = useAppStore((s) => s.showToast);
  const clearCanvasRaw = useCanvasStore((s) => s.clearCanvas);
  const addNode = useCanvasStore((s) => s.addNode);

  const clearCanvas = useCallback(() => {
    clearCanvasRaw();
    showToast("Canvas cleared", "info");
  }, [clearCanvasRaw, showToast]);

  const currentProblem = PROBLEMS.find((p) => p.id === selectedProblemId);

  const loadReference = useCallback(() => {
    const problem = PROBLEMS.find((p) => p.id === selectedProblemId);
    if (!problem) return;

    clearCanvas();

    const nodeIdMap = new Map<string, string>();

    // Create nodes from reference
    for (const ref of problem.referenceSolution.nodes) {
      const comp = getComponentById(ref.componentId);
      if (!comp) continue;

      const nodeId = `${comp.id}-ref-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      nodeIdMap.set(ref.componentId, nodeId);

      const newNode: Node<ComponentNodeData> = {
        id: nodeId,
        type: "component",
        position: { x: ref.x, y: ref.y },
        data: {
          componentId: comp.id,
          label: comp.label,
          icon: comp.icon,
          category: comp.category,
          replicas: 1,
          maxQPS: comp.maxQPS,
          latencyMs: comp.latencyMs,
          scalable: comp.scalable,
        },
      };
      addNode(newNode);
    }

    // Add edges after a tick so nodes exist
    setTimeout(() => {
      const { edges } = useCanvasStore.getState();
      const newEdges = [...edges];
      for (const ref of problem.referenceSolution.edges) {
        const sourceId = nodeIdMap.get(ref.source);
        const targetId = nodeIdMap.get(ref.target);
        if (sourceId && targetId) {
          newEdges.push({
            id: `e-${sourceId}-${targetId}`,
            source: sourceId,
            target: targetId,
            type: "animated",
          });
        }
      }
      useCanvasStore.setState({ edges: newEdges });
    }, 50);
  }, [selectedProblemId, clearCanvas, addNode]);

  return (
    <header className="glass-panel flex h-14 shrink-0 items-center justify-between border-b border-zinc-800/80 px-3">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLeftSidebar}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-cyan-400" />
          <span className="gradient-text text-sm font-semibold tracking-tight">
            SystemSim
          </span>
          <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[8px] font-medium text-zinc-500">beta</span>
        </div>

        <div className="mx-2 h-4 w-px bg-zinc-800" />

        {/* Problem selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
          >
            {currentProblem?.title ?? "Select Problem"}
            <ChevronDown className="h-3 w-3 text-zinc-500" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 py-1 shadow-xl shadow-black/40">
                {PROBLEMS.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => {
                      setSelectedProblem(problem.id);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors hover:bg-zinc-800 ${
                      problem.id === selectedProblemId
                        ? "text-cyan-400"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {problem.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={loadReference}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          title="Load reference solution"
        >
          <Download className="h-3 w-3" />
          Reference
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        <button
          onClick={toggleSound}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          title={soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </button>

        <button
          onClick={clearCanvas}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-rose-400"
          title="Clear canvas"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <Button
          size="sm"
          onClick={onSimulate}
          className="h-8 gap-1.5 bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 text-xs font-medium text-white hover:from-cyan-400 hover:to-indigo-400 pulse-glow"
        >
          <Play className="h-3 w-3" />
          Simulate
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onScore}
          className="h-8 gap-1.5 border border-zinc-700/50 bg-transparent px-4 text-xs font-medium text-zinc-300 hover:border-cyan-500/30 hover:text-cyan-300"
        >
          <Trophy className="h-3 w-3" />
          Score
        </Button>

        <button
          onClick={toggleRightPanel}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          <PanelRight className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
