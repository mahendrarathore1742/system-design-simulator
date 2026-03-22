"use client";

import { useCallback, useEffect, useRef } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { TopBar } from "./top-bar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { RightPanel } from "@/components/panel/RightPanel";
import { DesignCanvas } from "@/components/canvas/DesignCanvas";
import { useAppStore } from "@/store/appStore";
import { useCanvasStore } from "@/store/canvasStore";
import { useSimulationStore } from "@/store/simulationStore";
import { runSimulation } from "@/engine/simulator";
import { scoreDesign } from "@/scoring/scorer";
import { playDrop, playSimulate, playScore } from "@/lib/sounds";
import { Toast } from "@/components/ui/Toast";

export function AppShell() {
  const leftSidebarOpen = useAppStore((s) => s.leftSidebarOpen);
  const rightPanelOpen = useAppStore((s) => s.rightPanelOpen);
  const prevNodeCount = useRef(0);

  // Watch for new nodes being added to play drop sound
  useEffect(() => {
    const unsub = useCanvasStore.subscribe((state) => {
      const count = state.nodes.length;
      if (count > prevNodeCount.current) {
        const soundEnabled = useAppStore.getState().soundEnabled;
        if (soundEnabled) playDrop();
      }
      prevNodeCount.current = count;
    });
    return unsub;
  }, []);

  const handleSimulate = useCallback(() => {
    const { nodes, edges } = useCanvasStore.getState();
    const { config } = useSimulationStore.getState();

    if (nodes.length === 0) {
      useAppStore.getState().showToast("No components to simulate", "info");
      return;
    }

    const soundEnabled = useAppStore.getState().soundEnabled;
    if (soundEnabled) playSimulate();

    useSimulationStore.getState().setRunning(true);

    // Use setTimeout to let React render the "Running..." state
    setTimeout(() => {
      const result = runSimulation(nodes, edges, config.requestsPerSec);

      // Update node visuals
      const updates = new Map<string, Record<string, unknown>>();
      for (const [nodeId, metrics] of result.nodeMetrics) {
        updates.set(nodeId, {
          utilization: metrics.utilization,
          status: metrics.status,
          isBottleneck: metrics.isBottleneck,
        });
      }
      useCanvasStore.getState().updateAllNodeData(updates);

      useSimulationStore.getState().setResult(result);
      useSimulationStore.getState().setRunning(false);
      useAppStore.getState().showToast("Simulation complete!", "success");
    }, 100);
  }, []);

  const handleScore = useCallback(() => {
    const { nodes, edges } = useCanvasStore.getState();

    if (nodes.length === 0) {
      useAppStore.getState().showToast("No components to score", "info");
      return;
    }

    const result = scoreDesign(nodes, edges);
    useSimulationStore.getState().setScoreResult(result);
    useSimulationStore.getState().setShowScore(true);

    const soundEnabled = useAppStore.getState().soundEnabled;
    if (soundEnabled) playScore();

    useAppStore.getState().showToast("Design scored!", "success");
  }, []);

  const handleClearCanvas = useCallback(() => {
    useCanvasStore.getState().clearCanvas();
    useAppStore.getState().showToast("Canvas cleared", "info");
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      // Delete or Backspace → delete selected node
      if (e.key === "Delete" || e.key === "Backspace") {
        const { selectedNodeId, deleteNode } = useCanvasStore.getState();
        if (selectedNodeId) {
          e.preventDefault();
          deleteNode(selectedNodeId);
        }
      }

      // Ctrl/Cmd + Enter → run simulation
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSimulate();
      }

      // Ctrl/Cmd + Shift + S → run scoring
      if (e.key === "s" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        handleScore();
      }

      // Escape → deselect node
      if (e.key === "Escape") {
        useCanvasStore.getState().setSelectedNode(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSimulate, handleScore]);

  return (
    <ReactFlowProvider>
      <div className="flex h-full flex-col">
        <TopBar onSimulate={handleSimulate} onScore={handleScore} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar open={leftSidebarOpen} />
          <DesignCanvas />
          <RightPanel open={rightPanelOpen} onSimulate={handleSimulate} />
        </div>

        <Toast />
      </div>
    </ReactFlowProvider>
  );
}
