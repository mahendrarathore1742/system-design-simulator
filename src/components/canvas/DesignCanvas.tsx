"use client";

import { useCallback, useRef, type DragEvent } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./nodes/nodeTypes";
import { edgeTypes } from "./edges/edgeTypes";
import { useCanvasStore, type ComponentNodeData } from "@/store/canvasStore";
import { getComponentById } from "@/data/components";
import { Layers } from "lucide-react";

export function DesignCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const onNodesChange = useCanvasStore((s) => s.onNodesChange);
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
  const onConnect = useCanvasStore((s) => s.onConnect);
  const addNode = useCanvasStore((s) => s.addNode);
  const setSelectedNode = useCanvasStore((s) => s.setSelectedNode);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const componentId = event.dataTransfer.getData(
        "application/systemsim-component"
      );
      if (!componentId) return;

      const component = getComponentById(componentId);
      if (!component) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<ComponentNodeData> = {
        id: `${componentId}-${Date.now()}`,
        type: "component",
        position,
        data: {
          componentId: component.id,
          label: component.label,
          icon: component.icon,
          category: component.category,
          replicas: 1,
          maxQPS: component.maxQPS,
          latencyMs: component.latencyMs,
          scalable: component.scalable,
        },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const isEmpty = nodes.length === 0;

  return (
    <div ref={reactFlowWrapper} className="canvas-glow relative flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: "animated" }}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-zinc-900"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.2}
          color="rgba(161, 161, 170, 0.3)"
          className="!bg-zinc-900"
        />
        <Controls
          className="!rounded-lg !border-zinc-700 !bg-zinc-800/90 !shadow-lg [&>button]:!border-zinc-700 [&>button]:!bg-zinc-800 [&>button]:!text-zinc-300 [&>button:hover]:!bg-zinc-700 [&>button:hover]:!text-zinc-100"
          position="bottom-left"
        />
        <MiniMap
          className="!rounded-lg !border-zinc-700 !bg-zinc-800/80"
          maskColor="rgba(0, 0, 0, 0.7)"
          nodeColor={(node) => {
            const data = node.data as ComponentNodeData;
            const status = data.status as string;
            if (status === "critical") return "#ef4444";
            if (status === "warning") return "#f59e0b";
            if (status === "healthy") return "#10b981";
            return "#52525b";
          }}
          position="bottom-right"
        />
      </ReactFlow>

      {/* Empty state overlay */}
      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800/80">
              <Layers className="h-8 w-8 text-zinc-400" />
              <div className="absolute inset-0 rounded-2xl" style={{ animation: 'empty-pulse 3s ease-in-out infinite' }} />
              <div className="absolute inset-0 rounded-2xl" style={{ animation: 'empty-pulse 3s ease-in-out infinite 1s' }} />
              <div className="absolute inset-0 rounded-2xl" style={{ animation: 'empty-pulse 3s ease-in-out infinite 2s' }} />
            </div>
            <div>
              <p className="gradient-text text-sm font-medium">
                Design your system
              </p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-zinc-400">
                Select a problem from the sidebar, then drag components to build your architecture
              </p>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 font-mono text-[9px]">
                  Drag
                </kbd>
                to add
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 font-mono text-[9px]">
                  Click
                </kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 font-mono text-[9px]">
                  ⌫
                </kbd>
                to delete
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
