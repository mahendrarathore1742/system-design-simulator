import type { Node, Edge } from "@xyflow/react";
import type { ComponentNodeData } from "@/store/canvasStore";
import type { CategoryScore } from "@/types/scoring";

export function scoreAvailability(
  nodes: Node<ComponentNodeData>[],
  edges: Edge[]
): CategoryScore {
  const feedback: string[] = [];
  const passed: string[] = [];
  let score = 0;

  const componentIds = nodes.map((n) => n.data.componentId);

  // Check no single point of failure (3 pts)
  const scalableNodes = nodes.filter((n) => n.data.scalable || (n.data.replicas || 1) > 1);
  const noSpof = scalableNodes.length >= Math.floor(nodes.length * 0.5);
  if (noSpof && nodes.length > 0) {
    score += 3;
    passed.push("Most components are scalable or redundant, minimizing single points of failure");
  } else {
    feedback.push(
      "Too many single points of failure — over half your components can't scale or failover. Each non-redundant component is a potential outage point. Use scalable components (App Server, Cache, NoSQL) and add replicas to stateful ones to target 99.9%+ availability."
    );
  }

  // Check DB redundancy (3 pts)
  const hasMultipleStorage = nodes.filter((n) => n.data.category === "storage").length >= 2;
  if (hasMultipleStorage) {
    score += 3;
    passed.push("Multiple storage layers provide data redundancy and failover capability");
  } else {
    feedback.push(
      "Add redundant storage layers (e.g., Cache + Database, or SQL + NoSQL). If your only database goes down, the entire system is unavailable. Having a cache as a read fallback lets you serve stale data during DB outages rather than returning errors."
    );
  }

  // Check multi-path (3 pts)
  const hasMultiPath = edges.length >= nodes.length;
  if (hasMultiPath && nodes.length > 2) {
    score += 3;
    passed.push("Multiple data paths exist, preventing cascading failures from a single link failure");
  } else {
    feedback.push(
      "Add alternative data paths to avoid cascading failures. If every request follows a single chain (A→B→C→D), any link failure takes down the entire system. Add redundant connections so traffic can route around failures."
    );
  }

  // Check monitoring (3 pts)
  if (componentIds.includes("monitoring")) {
    score += 3;
    passed.push("Monitoring enables fast incident detection and reduces Mean Time To Recovery (MTTR)");
  } else {
    feedback.push(
      "Add a Monitoring stack (Prometheus/Grafana, CloudWatch, Datadog) for alerting and observability. Without monitoring, outages go undetected until users complain — increasing MTTR from minutes to hours. You can't improve what you can't measure."
    );
  }

  // Check rate limiter or API gateway for overload protection (3 pts)
  const hasOverloadProtection =
    componentIds.includes("rate-limiter") || componentIds.includes("api-gateway");
  if (hasOverloadProtection) {
    score += 3;
    passed.push("Rate limiting / API gateway protects backend from traffic surges and abuse");
  } else {
    feedback.push(
      "Add a Rate Limiter or API Gateway to protect your backend from traffic surges and DDoS attacks. Without overload protection, a sudden traffic spike (or malicious attack) can cascade through your entire system and cause a full outage."
    );
  }

  // Check cache for graceful degradation (3 pts)
  const hasCache = componentIds.includes("cache");
  const hasDB = componentIds.includes("sql-db") || componentIds.includes("nosql-db");
  if (hasCache && hasDB) {
    score += 3;
    passed.push("Cache enables graceful degradation — serves stale data if database becomes unavailable");
  } else if (hasDB && !hasCache) {
    feedback.push(
      "Add a Cache layer (Redis/Memcached) in front of your database. Beyond performance, caching enables graceful degradation: if your DB goes down, the cache can continue serving recent data while you recover, keeping the system partially available."
    );
  }

  // Check queue for resilience (2 pts)
  if (componentIds.includes("message-queue")) {
    score += 2;
    passed.push("Message queue buffers requests during downstream outages, preventing data loss");
  } else {
    feedback.push(
      "Add a Message Queue (Kafka, SQS) to buffer requests during downstream outages. If a consumer service goes down, messages are retained in the queue and processed when it recovers — no data loss, no user-facing errors for async operations."
    );
  }

  return { category: "Availability", score, maxScore: 20, feedback, passed };
}
