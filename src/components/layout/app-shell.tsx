"use client";

import { useCallback } from "react";
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

export function AppShell() {
  const leftSidebarOpen = useAppStore((s) => s.leftSidebarOpen);
  const rightPanelOpen = useAppStore((s) => s.rightPanelOpen);

  const handleSimulate = useCallback(() => {
    const { nodes, edges } = useCanvasStore.getState();
    const { config } = useSimulationStore.getState();

    if (nodes.length === 0) return;

    useSimulationStore.getState().setRunning(true);

    // Run simulation
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
  }, []);

  const handleScore = useCallback(() => {
    const { nodes, edges } = useCanvasStore.getState();
    const result = scoreDesign(nodes, edges);
    useSimulationStore.getState().setScoreResult(result);
    useSimulationStore.getState().setShowScore(true);
  }, []);

  return (
    <ReactFlowProvider>
      <div className="flex h-full flex-col">
        <TopBar onSimulate={handleSimulate} onScore={handleScore} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar open={leftSidebarOpen} />
          <DesignCanvas />
          <RightPanel open={rightPanelOpen} onSimulate={handleSimulate} />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
