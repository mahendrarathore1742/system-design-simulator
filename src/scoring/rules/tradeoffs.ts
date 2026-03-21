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

  // Read/write separation (3 pts) — cache for reads + DB for writes
  const hasCache = componentIds.includes("cache");
  const hasDB = componentIds.includes("sql-db") || componentIds.includes("nosql-db");
  if (hasCache && hasDB) {
    score += 3;
    passed.push("Read/write separation via cache + database — optimizes each path independently");
  } else {
    feedback.push(
      "Separate your read and write paths (Cache for reads, DB for writes). This is a core system design pattern — reads and writes have different scaling characteristics. Reads can be served from cheap, fast caches while writes go to durable storage. This lets you optimize each path independently."
    );
  }

  // Consistency/availability tradeoff (3 pts) — using both SQL and NoSQL shows awareness
  const hasSql = componentIds.includes("sql-db");
  const hasNosql = componentIds.includes("nosql-db");
  if (hasSql && hasNosql) {
    score += 3;
    passed.push("Using both SQL (strong consistency) and NoSQL (high availability) shows CAP theorem awareness");
  } else if (hasSql || hasNosql) {
    score += 1;
    feedback.push(
      "Consider using both SQL and NoSQL databases for different access patterns. SQL gives you ACID transactions and strong consistency (critical for payments, user accounts). NoSQL gives you horizontal scalability and high availability (ideal for timelines, logs, sessions). Using both shows understanding of the CAP theorem tradeoffs."
    );
  } else {
    feedback.push(
      "No database in your design — add at least one. Consider the CAP theorem: SQL databases prioritize Consistency (CP), while NoSQL databases like DynamoDB/Cassandra prioritize Availability (AP). Most real systems use both for different workloads."
    );
  }

  // Async processing with queues (3 pts)
  if (componentIds.includes("message-queue")) {
    score += 3;
    passed.push("Message queue decouples services — trading immediate consistency for resilience and throughput");
  } else {
    feedback.push(
      "Add a Message Queue (Kafka, SQS, RabbitMQ) to decouple synchronous dependencies. This is a key tradeoff: you accept eventual consistency in exchange for much higher resilience and throughput. If Service B goes down, Service A can still enqueue work instead of failing."
    );
  }

  // Defense in depth (3 pts) — rate limiter or API gateway
  const hasDefense =
    componentIds.includes("rate-limiter") || componentIds.includes("api-gateway");
  if (hasDefense) {
    score += 3;
    passed.push("Defense in depth with rate limiting / API gateway — protects against abuse and overload");
  } else {
    feedback.push(
      "Add an API Gateway or Rate Limiter for security and traffic control. This is a latency-vs-safety tradeoff: each request pays ~1-5ms extra for protection against DDoS, abuse, and cascading failures. Without it, one bad actor can bring down your entire system."
    );
  }

  // Overall architecture depth (3 pts) — at least 4 distinct component categories
  const uniqueCategories = new Set(nodes.map((n) => n.data.category));
  if (uniqueCategories.size >= 4) {
    score += 3;
    passed.push("Design covers " + uniqueCategories.size + " architectural layers — shows breadth of thinking");
  } else if (uniqueCategories.size >= 3) {
    score += 1;
    feedback.push(
      "Your design covers " + uniqueCategories.size + " categories but is missing important layers. A well-rounded system design typically spans networking (LB, CDN), compute (app servers), storage (DB, cache), and messaging (queues) — consider which layers you're missing."
    );
  } else {
    feedback.push(
      "Design only covers " + uniqueCategories.size + " category/categories — production systems need breadth. Add components from networking, compute, storage, and messaging categories to show you've considered the full picture."
    );
  }

  // Auth / security considerations (3 pts)
  const hasAuth = componentIds.includes("auth-service");
  const hasAuthLayer = hasAuth || (componentIds.includes("api-gateway") && componentIds.includes("rate-limiter"));
  if (hasAuthLayer) {
    score += 3;
    passed.push("Security layer (Auth Service / API Gateway + Rate Limiter) protects the system");
  } else {
    feedback.push(
      "Add an Auth Service or security layer (API Gateway + Rate Limiter) to your design. Authentication and authorization are non-negotiable for any user-facing system. Centralizing auth into a dedicated service prevents security logic from being duplicated across microservices."
    );
  }

  // Monitoring / observability awareness (2 pts)
  if (componentIds.includes("monitoring")) {
    score += 2;
    passed.push("Monitoring shows awareness that you need observability to manage tradeoffs in production");
  } else {
    feedback.push(
      "Add Monitoring to your design. In production, every tradeoff you make (consistency vs availability, cost vs performance) needs to be measured and validated. Without metrics, you're flying blind — you won't know if your cache hit rate justifies its cost or if your queue is creating unacceptable delays."
    );
  }

  return { category: "Trade-offs", score, maxScore: 20, feedback, passed };
}
