import type { Node, Edge } from "@xyflow/react";
import type { ComponentNodeData } from "@/store/canvasStore";
import type { CategoryScore } from "@/types/scoring";

export function scoreTradeoffs(
  nodes: Node<ComponentNodeData>[],
  edges: Edge[]
): CategoryScore {
  const feedback: string[] = [];
  const passed: string[] = [];
  let score = 0;

  const componentIds = nodes.map((n) => n.data.componentId);

  // Read/write separation (4 pts) — cache for reads + DB for writes
  const hasCache = componentIds.includes("cache");
  const hasDB = componentIds.includes("sql-db") || componentIds.includes("nosql-db");
  if (hasCache && hasDB) {
    score += 4;
    passed.push("Read/write separation via cache + database");
  } else {
    feedback.push("Consider separating read and write paths (cache for reads, DB for writes)");
  }

  // Consistency/availability tradeoff (4 pts) — using both SQL and NoSQL shows awareness
  const hasSql = componentIds.includes("sql-db");
  const hasNosql = componentIds.includes("nosql-db");
  if (hasSql && hasNosql) {
    score += 4;
    passed.push("Using both SQL (consistency) and NoSQL (availability) shows tradeoff awareness");
  } else if (hasSql || hasNosql) {
    score += 2;
    feedback.push("Consider when to use SQL vs NoSQL — shows understanding of CAP tradeoffs");
  } else {
    feedback.push("No database in design — consider consistency vs availability tradeoffs");
  }

  // Async processing with queues (4 pts)
  if (componentIds.includes("message-queue")) {
    score += 4;
    passed.push("Message queue decouples services for resilience");
  } else {
    feedback.push("Add a Message Queue to decouple synchronous dependencies");
  }

  // Defense in depth (4 pts) — rate limiter or API gateway
  const hasDefense =
    componentIds.includes("rate-limiter") || componentIds.includes("api-gateway");
  if (hasDefense) {
    score += 4;
    passed.push("Defense in depth with rate limiting / API gateway");
  } else {
    feedback.push("Add an API Gateway or Rate Limiter for security and traffic control");
  }

  // Overall architecture depth (4 pts) — at least 5 distinct component types
  const uniqueCategories = new Set(nodes.map((n) => n.data.category));
  if (uniqueCategories.size >= 4) {
    score += 4;
    passed.push("Design covers " + uniqueCategories.size + " architectural layers");
  } else {
    feedback.push("Design is narrow — add components from more categories for depth");
  }

  return { category: "Trade-offs", score, maxScore: 20, feedback, passed };
}
