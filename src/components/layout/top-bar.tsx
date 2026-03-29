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
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useCanvasStore } from "@/store/canvasStore";
import { PROBLEMS } from "@/data/problems";
import type { Node, Edge } from "@xyflow/react";
import { getComponentById } from "@/data/components";
import type { ComponentNodeData } from "@/store/canvasStore";

interface TopBarProps {
  onSimulate: () => void;
  onScore: () => void;
  onClearCanvas: () => void;
}

export function TopBar({ onSimulate, onScore, onClearCanvas }: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedProblemId = useAppStore((s) => s.selectedProblemId);
  const setSelectedProblem = useAppStore((s) => s.setSelectedProblem);
  const toggleLeftSidebar = useAppStore((s) => s.toggleLeftSidebar);
  const toggleRightPanel = useAppStore((s) => s.toggleRightPanel);

  const currentProblem = PROBLEMS.find((p) => p.id === selectedProblemId);

  const loadReference = useCallback(() => {
    const problem = PROBLEMS.find((p) => p.id === selectedProblemId);
    if (!problem) return;

    onClearCanvas();

    // Use index-based keys so duplicate componentIds get unique map entries
    const nodeIdMap = new Map<string, string>();
    const newNodes: Node<ComponentNodeData>[] = [];

    problem.referenceSolution.nodes.forEach((ref, index) => {
      const comp = getComponentById(ref.componentId);
      if (!comp) return;

      const nodeId = `${comp.id}-ref-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      nodeIdMap.set(`${ref.componentId}-${index}`, nodeId);

      newNodes.push({
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
      });
    });

    // Build edges. Edge source/target reference componentIds. Find the first
    // matching node for each componentId (handles the common unique-id case and
    // gracefully picks one when there are duplicates).
    const newEdges: Edge[] = [];
    for (const ref of problem.referenceSolution.edges) {
      const sourceId = findNodeIdByComponent(nodeIdMap, ref.source);
      const targetId = findNodeIdByComponent(nodeIdMap, ref.target);
      if (sourceId && targetId) {
        newEdges.push({
          id: `e-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: "animated",
        });
      }
    }

    // Batch nodes and edges in a single state update to avoid race conditions
    const { nodes: currentNodes, edges: currentEdges } = useCanvasStore.getState();
    useCanvasStore.setState({
      nodes: [...currentNodes, ...newNodes],
      edges: [...currentEdges, ...newEdges],
    });
  }, [selectedProblemId, onClearCanvas]);

  return (
    <header className="glass-panel flex h-14 shrink-0 items-center justify-between border-b border-zinc-800/80 px-3">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLeftSidebar}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          title="Toggle sidebar"
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
            className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-700 hover:text-zinc-100"
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
              <div className="absolute left-0 top-full z-50 mt-1 max-h-80 w-52 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 py-1 shadow-xl shadow-black/40">
                {PROBLEMS.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => {
                      setSelectedProblem(problem.id);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors hover:bg-zinc-700 ${
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
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
          title="Load reference solution"
        >
          <Download className="h-3 w-3" />
          Reference
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClearCanvas}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-rose-400"
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
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          title="Toggle panel"
        >
          <PanelRight className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

/** Find the first node ID in the map whose key starts with the given componentId. */
function findNodeIdByComponent(nodeIdMap: Map<string, string>, componentId: string): string | undefined {
  for (const [key, value] of nodeIdMap) {
    if (key.startsWith(`${componentId}-`)) return value;
  }
  return undefined;
}
