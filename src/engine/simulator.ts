import type { Node, Edge } from "@xyflow/react";
import type { ComponentNodeData } from "@/store/canvasStore";
import type { NodeMetrics, NodeStatus, SimulationResult } from "@/types/simulation";
import {
  UTILIZATION_WARNING,
  UTILIZATION_CRITICAL,
  LATENCY_SPIKE_THRESHOLD,
  LATENCY_SPIKE_MULTIPLIER,
} from "./constants";

function getStatus(utilization: number): NodeStatus {
  if (utilization > UTILIZATION_CRITICAL) return "critical";
  if (utilization > UTILIZATION_WARNING) return "warning";
  return "healthy";
}

function computeLatency(baseLatency: number, utilization: number): number {
  if (utilization > LATENCY_SPIKE_THRESHOLD) {
    return baseLatency * (1 + Math.max(0, utilization - LATENCY_SPIKE_THRESHOLD) * LATENCY_SPIKE_MULTIPLIER);
  }
  return baseLatency;
}

export function runSimulation(
  nodes: Node<ComponentNodeData>[],
  edges: Edge[],
  requestsPerSec: number
): SimulationResult {
  const nodeMetrics = new Map<string, NodeMetrics>();
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Build adjacency list
  for (const node of nodes) {
    adjacency.set(node.id, []);
    inDegree.set(node.id, 0);
  }
  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  // Find entry nodes (no inbound edges)
  const entryNodes = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0);

  // Initialize incoming QPS for entry nodes
  const incomingQPS = new Map<string, number>();
  const qpsPerEntry = entryNodes.length > 0 ? requestsPerSec / entryNodes.length : 0;
  for (const entry of entryNodes) {
    incomingQPS.set(entry.id, qpsPerEntry);
  }

  // BFS propagation
  const queue = [...entryNodes.map((n) => n.id)];
  const visited = new Set<string>();
  const bottleneckNodes: string[] = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) continue;

    const data = node.data;
    const incoming = incomingQPS.get(nodeId) ?? 0;
    const replicas = data.replicas || 1;
    const effectiveQPS = data.maxQPS * replicas;
    const utilization = effectiveQPS === Infinity ? 0 : incoming / effectiveQPS;
    const latency = computeLatency(data.latencyMs, utilization);
    const status = getStatus(utilization);
    const isBottleneck = utilization > UTILIZATION_CRITICAL;

    if (isBottleneck) bottleneckNodes.push(nodeId);

    nodeMetrics.set(nodeId, {
      nodeId,
      incomingQPS: incoming,
      effectiveQPS,
      utilization: Math.min(utilization, 2), // cap at 200% for display
      latencyMs: latency,
      status,
      isBottleneck,
    });

    // Propagate to children — split QPS evenly among targets
    const children = adjacency.get(nodeId) ?? [];
    // Pass through QPS (capped by effective capacity)
    const outputQPS = Math.min(incoming, effectiveQPS);
    for (const childId of children) {
      const existing = incomingQPS.get(childId) ?? 0;
      incomingQPS.set(childId, existing + outputQPS / children.length);
      if (!visited.has(childId)) {
        queue.push(childId);
      }
    }
  }

  // Handle nodes not reached by BFS
  for (const node of nodes) {
    if (!nodeMetrics.has(node.id)) {
      nodeMetrics.set(node.id, {
        nodeId: node.id,
        incomingQPS: 0,
        effectiveQPS: node.data.maxQPS * (node.data.replicas || 1),
        utilization: 0,
        latencyMs: 0,
        status: "idle",
        isBottleneck: false,
      });
    }
  }

  // Compute total latency (longest path)
  const totalLatencyMs = computeLongestPathLatency(nodes, edges, nodeMetrics);

  // Throughput = min effective QPS along critical path
  const throughput = bottleneckNodes.length > 0
    ? Math.min(...bottleneckNodes.map((id) => nodeMetrics.get(id)!.effectiveQPS))
    : requestsPerSec;

  return {
    nodeMetrics,
    totalLatencyMs,
    bottleneckNodes,
    throughput,
    timestamp: Date.now(),
  };
}

function computeLongestPathLatency(
  nodes: Node<ComponentNodeData>[],
  edges: Edge[],
  metrics: Map<string, NodeMetrics>
): number {
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    adjacency.set(node.id, []);
    inDegree.set(node.id, 0);
  }
  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  const dist = new Map<string, number>();
  const entryNodes = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0);

  for (const entry of entryNodes) {
    dist.set(entry.id, metrics.get(entry.id)?.latencyMs ?? 0);
  }

  // Topological BFS
  const queue = [...entryNodes.map((n) => n.id)];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);
    const currentDist = dist.get(nodeId) ?? 0;
    const children = adjacency.get(nodeId) ?? [];

    for (const childId of children) {
      const childLatency = metrics.get(childId)?.latencyMs ?? 0;
      const newDist = currentDist + childLatency;
      if (newDist > (dist.get(childId) ?? 0)) {
        dist.set(childId, newDist);
      }
      if (!visited.has(childId)) {
        queue.push(childId);
      }
    }
  }

  return Math.max(0, ...dist.values());
}
