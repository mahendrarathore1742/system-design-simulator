import { create } from "zustand";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";

export interface ComponentNodeData {
  componentId: string;
  label: string;
  icon: string;
  category: string;
  replicas: number;
  maxQPS: number;
  latencyMs: number;
  scalable: boolean;
  utilization?: number;
  status?: string;
  isBottleneck?: boolean;
  [key: string]: unknown;
}

interface CanvasState {
  nodes: Node<ComponentNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node<ComponentNodeData>) => void;
  setSelectedNode: (id: string | null) => void;
  updateNodeData: (nodeId: string, data: Partial<ComponentNodeData>) => void;
  updateAllNodeData: (
    updates: Map<string, Partial<ComponentNodeData>>
  ) => void;
  clearCanvas: () => void;
  deleteNode: (nodeId: string) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node<ComponentNodeData>[] });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(
        { ...connection, type: "animated" },
        get().edges
      ),
    });
  },
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },
  setSelectedNode: (id) => {
    set({ selectedNodeId: id });
  },
  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
    });
  },
  updateAllNodeData: (updates) => {
    set({
      nodes: get().nodes.map((n) => {
        const update = updates.get(n.id);
        return update ? { ...n, data: { ...n.data, ...update } } : n;
      }),
    });
  },
  clearCanvas: () => {
    set({ nodes: [], edges: [], selectedNodeId: null });
  },
  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
      selectedNodeId:
        get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },
}));
