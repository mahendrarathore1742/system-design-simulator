import type { SystemComponent } from "@/types/component";

export const SYSTEM_COMPONENTS: SystemComponent[] = [
  // Networking
  {
    id: "dns",
    label: "DNS",
    category: "networking",
    icon: "Globe",
    maxQPS: 100000,
    latencyMs: 50,
    scalable: false,
    stateful: false,
    description:
      "Domain Name System — resolves human-readable domain names (e.g., example.com) to IP addresses. Every internet request starts with a DNS lookup, making it the first hop in any system design. Services like AWS Route 53 and Google Cloud DNS also support health-checked routing and geo-based load balancing.",
  },
  {
    id: "cdn",
    label: "CDN",
    category: "networking",
    icon: "Cloudy",
    maxQPS: 500000,
    latencyMs: 5,
    scalable: true,
    stateful: false,
    description:
      "Content Delivery Network — caches static assets (images, JS, CSS, videos) at edge locations close to users, reducing latency from hundreds of milliseconds to single digits. Essential for any read-heavy or media-heavy system serving a global audience. Examples include Amazon CloudFront, Google Cloud CDN, and Cloudflare.",
  },
  {
    id: "load-balancer",
    label: "Load Balancer",
    category: "networking",
    icon: "Network",
    maxQPS: 100000,
    latencyMs: 2,
    scalable: true,
    stateful: false,
    description:
      "Distributes incoming traffic across multiple backend servers using algorithms like round-robin, least-connections, or weighted routing. Prevents any single server from becoming a bottleneck and enables zero-downtime deployments via rolling updates. AWS ALB/NLB, Google Cloud Load Balancing, and HAProxy are common choices.",
  },
  {
    id: "api-gateway",
    label: "API Gateway",
    category: "networking",
    icon: "Router",
    maxQPS: 50000,
    latencyMs: 10,
    scalable: true,
    stateful: false,
    description:
      "Single entry point for all API requests — handles routing, authentication, rate limiting, request transformation, and protocol translation. Use it when you have multiple microservices behind a unified API surface. AWS API Gateway, Kong, and Google Cloud Apigee are popular managed options.",
  },
  {
    id: "rate-limiter",
    label: "Rate Limiter",
    category: "networking",
    icon: "ShieldAlert",
    maxQPS: 80000,
    latencyMs: 1,
    scalable: true,
    stateful: false,
    description:
      "Throttles requests per client, IP, or API key to protect downstream services from abuse, DDoS attacks, and traffic spikes. Typically implemented using token bucket or sliding window algorithms backed by Redis. Often built into API gateways like Kong or AWS WAF, or implemented as a standalone service.",
  },
  // Compute
  {
    id: "app-server",
    label: "App Server",
    category: "compute",
    icon: "Server",
    maxQPS: 5000,
    latencyMs: 20,
    scalable: true,
    stateful: false,
    description:
      "Stateless application server that executes core business logic and serves API requests. Designed to scale horizontally — spin up more instances behind a load balancer to handle increased traffic. Runs on AWS EC2/ECS, Google Compute Engine, or containerized in Kubernetes pods.",
  },
  {
    id: "auth-service",
    label: "Auth Service",
    category: "compute",
    icon: "KeyRound",
    maxQPS: 10000,
    latencyMs: 15,
    scalable: true,
    stateful: false,
    description:
      "Dedicated authentication and authorization service that handles user login, token issuance (JWT/OAuth2), session management, and permission checks. Centralizing auth prevents security logic from being scattered across microservices. Examples include AWS Cognito, Auth0, Firebase Auth, and Google Cloud Identity Platform.",
  },
  // Storage
  {
    id: "sql-db",
    label: "SQL Database",
    category: "storage",
    icon: "Database",
    maxQPS: 10000,
    latencyMs: 5,
    scalable: false,
    stateful: true,
    description:
      "Relational database providing ACID transactions, strong consistency, and structured schemas with SQL queries. Best for data with complex relationships, joins, and strict integrity requirements (e.g., financial transactions, user accounts). Examples include Amazon RDS (PostgreSQL/MySQL), Google Cloud SQL, and Amazon Aurora.",
  },
  {
    id: "nosql-db",
    label: "NoSQL Database",
    category: "storage",
    icon: "HardDrive",
    maxQPS: 50000,
    latencyMs: 3,
    scalable: true,
    stateful: true,
    description:
      "Non-relational database optimized for flexible schemas, horizontal scaling, and high-throughput workloads. Choose it when you need low-latency key-value lookups, wide-column storage, or document-oriented data without complex joins. Amazon DynamoDB, Google Cloud Bigtable, MongoDB Atlas, and Apache Cassandra are widely used.",
  },
  {
    id: "cache",
    label: "Cache / Redis",
    category: "storage",
    icon: "Zap",
    maxQPS: 100000,
    latencyMs: 1,
    scalable: true,
    stateful: true,
    description:
      "In-memory data store delivering sub-millisecond read latency for frequently accessed data, session storage, leaderboards, and real-time counters. Placing a cache between your app servers and database can reduce DB load by 80-90% for read-heavy workloads. Amazon ElastiCache (Redis/Memcached) and Google Cloud Memorystore are managed options.",
  },
  {
    id: "object-storage",
    label: "Object Storage",
    category: "storage",
    icon: "Archive",
    maxQPS: 50000,
    latencyMs: 20,
    scalable: true,
    stateful: true,
    description:
      "Highly durable blob/object storage for unstructured data like images, videos, backups, and static website assets. Offers virtually unlimited capacity with 99.999999999% (11 nines) durability. Amazon S3, Google Cloud Storage, and Azure Blob Storage are the industry standards, often paired with a CDN for fast delivery.",
  },
  {
    id: "search",
    label: "Search / ES",
    category: "storage",
    icon: "Search",
    maxQPS: 20000,
    latencyMs: 10,
    scalable: true,
    stateful: true,
    description:
      "Full-text search engine that indexes and queries large volumes of text with features like fuzzy matching, faceted search, and relevance scoring. Use it when users need to search across product catalogs, logs, or content feeds. Elasticsearch (Amazon OpenSearch), Apache Solr, and Google Cloud Search are common choices.",
  },
  // Messaging
  {
    id: "message-queue",
    label: "Message Queue",
    category: "messaging",
    icon: "MessageSquare",
    maxQPS: 100000,
    latencyMs: 5,
    scalable: true,
    stateful: false,
    description:
      "Asynchronous message broker that decouples producers from consumers, enabling reliable background processing, event-driven architectures, and traffic spike buffering. Critical for any workflow where synchronous processing would create bottlenecks or coupling. Apache Kafka, Amazon SQS/SNS, Google Cloud Pub/Sub, and RabbitMQ are widely adopted.",
  },
  // Infrastructure
  {
    id: "service-mesh",
    label: "Service Mesh",
    category: "infrastructure",
    icon: "GitBranch",
    maxQPS: 80000,
    latencyMs: 2,
    scalable: true,
    stateful: false,
    description:
      "Transparent service-to-service communication layer that handles mutual TLS, retries, circuit breaking, load balancing, and distributed tracing between microservices. Use it when your microservice count grows beyond what manual configuration can manage. Istio, Linkerd, and AWS App Mesh are leading implementations.",
  },
  {
    id: "monitoring",
    label: "Monitoring",
    category: "infrastructure",
    icon: "Activity",
    maxQPS: Infinity,
    latencyMs: 0,
    scalable: false,
    stateful: false,
    description:
      "Observability stack for metrics collection, centralized logging, distributed tracing, and alerting. Every production system needs monitoring to detect outages, track SLOs, and debug performance issues. Prometheus + Grafana, AWS CloudWatch, Google Cloud Monitoring, Datadog, and the ELK stack are standard tools.",
  },
];

export const COMPONENT_CATEGORIES = [
  { key: "networking", label: "Networking" },
  { key: "compute", label: "Compute" },
  { key: "storage", label: "Storage" },
  { key: "messaging", label: "Messaging" },
  { key: "infrastructure", label: "Infrastructure" },
] as const;

export function getComponentById(id: string): SystemComponent | undefined {
  return SYSTEM_COMPONENTS.find((c) => c.id === id);
}
