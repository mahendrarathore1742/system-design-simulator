import type { Node, Edge } from "@xyflow/react";
import type { ComponentNodeData } from "@/store/canvasStore";
import type { CategoryScore } from "@/types/scoring";

export function scoreLatency(
  nodes: Node<ComponentNodeData>[],
  edges: Edge[]
): CategoryScore {
  const feedback: string[] = [];
  const passed: string[] = [];
  let score = 0;

  const componentIds = nodes.map((n) => n.data.componentId);
  const inDegree = new Map<string, number>();
  for (const node of nodes) inDegree.set(node.id, 0);
  for (const edge of edges) {
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  // CDN for static content (3 pts)
  if (componentIds.includes("cdn")) {
    score += 3;
    passed.push("CDN serves content from edge locations, cutting latency from 200ms+ to <20ms for static assets");
  } else {
    feedback.push(
      "Add a CDN (CloudFront, Cloudflare, Google Cloud CDN) to serve static content from edge locations close to users. Without a CDN, every request travels to your origin server — a user in Tokyo hitting a US-East server adds 150-200ms of network latency alone."
    );
  }

  // Cache before DB (3 pts)
  const cacheNodes = nodes.filter((n) => n.data.componentId === "cache");
  const dbNodes = nodes.filter(
    (n) => n.data.componentId === "sql-db" || n.data.componentId === "nosql-db"
  );
  const cacheBeforeDB =
    cacheNodes.length > 0 &&
    dbNodes.length > 0 &&
    cacheNodes.some((c) =>
      edges.some(
        (e) =>
          e.source === c.id || // cache feeds something
          nodes.some(
            (n) =>
              edges.some((e2) => e2.source === n.id && e2.target === c.id) &&
              edges.some((e3) => e3.source === n.id && dbNodes.some((d) => e3.target === d.id))
          )
      )
    );
  if (cacheBeforeDB) {
    score += 3;
    passed.push("Cache intercepts reads before hitting the database — memory access (~1ms) vs disk (~5-10ms)");
  } else if (cacheNodes.length > 0) {
    score += 1;
    feedback.push(
      "Your cache exists but isn't positioned to intercept reads before the database. Connect your App Server to both Cache and DB so it checks the cache first. A cache hit returns in ~1ms; a DB query takes 5-10ms or more — that's a 5-10x latency improvement on every cached read."
    );
  } else {
    feedback.push(
      "Add a Cache layer (Redis/Memcached) between your App Servers and Database. Reading from memory (~1ms) is 5-10x faster than reading from disk (~5-10ms). For read-heavy workloads, caching can serve 80-90% of requests without ever touching the database."
    );
  }

  // Minimal hops — fewer than 6 layers (3 pts)
  const maxDepth = computeMaxDepth(nodes, edges);
  if (maxDepth <= 4) {
    score += 3;
    passed.push("Request path has very few hops (" + maxDepth + " layers) — minimal serialized latency");
  } else if (maxDepth <= 5) {
    score += 2;
    passed.push("Request path has acceptable hop count (" + maxDepth + " layers)");
  } else {
    feedback.push(
      `Request path has ${maxDepth} sequential hops — each hop adds latency (network round-trip + processing time). Consider whether all layers are necessary, or if some can be combined. Every unnecessary hop adds 2-10ms to p99 latency.`
    );
  }

  // DNS entry point (3 pts)
  const hasDNS = componentIds.includes("dns");
  if (hasDNS) {
    score += 3;
    passed.push("DNS as proper entry point — enables geo-routing and failover via DNS-based load balancing");
  } else {
    feedback.push(
      "Add DNS as the entry point for your system. DNS is the first hop of every request and enables geo-based routing (Route 53, Cloud DNS) to direct users to the nearest region, reducing latency by 50-150ms for international users."
    );
  }

  // Async offloading heavy work (3 pts)
  const hasQueue = componentIds.includes("message-queue");
  if (hasQueue) {
    score += 3;
    passed.push("Message queue offloads heavy processing from the request path, keeping responses fast");
  } else {
    feedback.push(
      "Add a Message Queue to offload heavy processing (transcoding, emails, analytics) from the synchronous request path. If your API handler does all the work inline, a 2-second transcoding job blocks the response for 2 seconds. Enqueue it and respond immediately."
    );
  }

  // Load balancer for connection reuse (3 pts)
  const hasLB = componentIds.includes("load-balancer");
  if (hasLB) {
    score += 3;
    passed.push("Load balancer enables connection pooling and keep-alive, reducing TCP/TLS handshake overhead");
  } else {
    feedback.push(
      "Add a Load Balancer for connection pooling and keep-alive support. Without one, each client request may need a fresh TCP handshake (1 RTT) + TLS handshake (2 RTTs), adding 30-100ms of overhead. LBs maintain warm connections to backends."
    );
  }

  // Low-latency data store choice (2 pts)
  const hasLowLatencyStore =
    componentIds.includes("cache") || componentIds.includes("nosql-db");
  if (hasLowLatencyStore) {
    score += 2;
    passed.push("Using low-latency data stores (in-memory cache or NoSQL) for fast data access");
  } else {
    feedback.push(
      "Consider using low-latency data stores for your hot path. Redis serves reads in <1ms, DynamoDB in <5ms single-digit milliseconds, while a complex SQL JOIN can take 50-100ms. Pick the right store for your access pattern."
    );
  }

  return { category: "Latency", score, maxScore: 20, feedback, passed };
}

function computeMaxDepth(nodes: Node<ComponentNodeData>[], edges: Edge[]): number {
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
  for (const entry of entryNodes) dist.set(entry.id, 1);

  const queue = [...entryNodes.map((n) => n.id)];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    for (const child of adjacency.get(id) ?? []) {
      const newDist = (dist.get(id) ?? 1) + 1;
      if (newDist > (dist.get(child) ?? 0)) dist.set(child, newDist);
      if (!visited.has(child)) queue.push(child);
    }
  }

  return Math.max(0, ...dist.values());
}
