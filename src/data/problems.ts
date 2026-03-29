import type { Problem } from "@/types/problem";

export const PROBLEMS: Problem[] = [
  {
    id: "url-shortener",
    title: "URL Shortener",
    difficulty: "Easy",
    description:
      "Design a URL shortening service like Bitly or TinyURL. Users submit long URLs and receive short, unique aliases that redirect to the original destination. The system is heavily read-biased — for every URL created, expect 100x more redirect lookups. Real-world services like Bitly handle billions of redirects per month with sub-100ms latency, making caching strategy the key design decision.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 1000,
      storageGB: 500,
      latencyMs: 100,
      users: "100M DAU",
    },
    constraints: [
      "Short URLs should be unique and non-predictable (base62 or base58 encoding)",
      "Redirect latency < 100ms at p99 — users should not notice any delay",
      "System should handle 100:1 read/write ratio",
      "URLs should expire after a configurable TTL (default 5 years)",
      "Analytics tracking for click counts, geographic distribution, and referrer data",
      "Custom alias support — users can choose their own short URL slug",
      "Rate limiting to prevent abuse (e.g., max 100 URLs/min per API key)",
    ],
    hints: [
      {
        title: "Start with the basics",
        content:
          "Consider DNS → Load Balancer → App Server → Database as your starting flow.",
      },
      {
        title: "Think about reads",
        content:
          "Most requests are reads (redirects). A cache layer can dramatically reduce DB load.",
      },
      {
        title: "Scaling writes",
        content:
          "Use a NoSQL database or partition your SQL database by key hash for write scaling.",
      },
      {
        title: "Advanced: Key generation",
        content:
          "Pre-generate keys in a separate Key Generation Service (KGS) to avoid collision checks at write time. Store unused keys in a dedicated table and move them to a 'used' table atomically.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 100, y: 250 },
        { componentId: "cdn", x: 300, y: 100 },
        { componentId: "load-balancer", x: 300, y: 250 },
        { componentId: "rate-limiter", x: 300, y: 400 },
        { componentId: "app-server", x: 500, y: 250 },
        { componentId: "cache", x: 500, y: 100 },
        { componentId: "nosql-db", x: 700, y: 250 },
        { componentId: "monitoring", x: 700, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "dns", target: "cdn" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "rate-limiter", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Storage", "Caching", "Hashing"],
  },
  {
    id: "twitter-feed",
    title: "Twitter / News Feed",
    difficulty: "Hard",
    description:
      "Design a social media feed like Twitter (X). Users can post tweets, follow others, and see a personalized timeline ranked by relevance. The core challenge is fan-out: when a celebrity with 50M followers posts a tweet, how do you deliver it to all their followers' timelines without melting your infrastructure? Real systems like Twitter use a hybrid approach — pre-computing timelines for most users while handling high-follower accounts differently.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 1000,
      storageGB: 500000,
      latencyMs: 200,
      users: "500M DAU",
    },
    constraints: [
      "Timeline should be eventually consistent within 5 seconds of a new post",
      "Support users with millions of followers (celebrities) without write amplification storms",
      "Feed should rank by relevance using signals like recency, engagement, and relationship strength",
      "Media uploads (images/videos up to 512MB) must be supported with async processing",
      "Real-time notifications for mentions, likes, retweets, and DMs",
      "Full-text search across all public tweets with sub-second response time",
      "Graceful degradation — serve stale timelines rather than showing errors during peak load",
    ],
    hints: [
      {
        title: "Fan-out strategy",
        content:
          "Consider fan-out-on-write for normal users and fan-out-on-read for celebrities.",
      },
      {
        title: "Caching the timeline",
        content:
          "Pre-compute and cache each user's timeline in Redis. Update on new posts.",
      },
      {
        title: "Media handling",
        content:
          "Use object storage (S3) for media with a CDN for global delivery.",
      },
      {
        title: "Advanced: Hybrid fan-out",
        content:
          "Set a follower threshold (e.g., 10K). Below it, fan-out-on-write pushes to followers' cached timelines. Above it, fan-out-on-read merges celebrity tweets at read time. This gives you the best of both approaches.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "app-server", x: 500, y: 200 },
        { componentId: "cache", x: 500, y: 50 },
        { componentId: "message-queue", x: 500, y: 380 },
        { componentId: "sql-db", x: 700, y: 200 },
        { componentId: "nosql-db", x: 700, y: 380 },
        { componentId: "object-storage", x: 350, y: 80 },
        { componentId: "search", x: 700, y: 50 },
        { componentId: "monitoring", x: 850, y: 200 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Fan-out", "Cache", "Timeline"],
  },
  {
    id: "chat-system",
    title: "Chat System",
    difficulty: "Hard",
    description:
      "Design a real-time chat application like WhatsApp, Slack, or Discord. Support 1:1 messaging, group chats with up to 1000 members, read receipts, typing indicators, and online presence. Messages must be delivered reliably and in order, even when users switch between devices. WhatsApp processes over 100 billion messages per day — the key challenges are maintaining persistent connections at scale and guaranteeing exactly-once delivery.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 100000,
      storageGB: 2000,
      latencyMs: 50,
      users: "200M DAU",
    },
    constraints: [
      "Messages delivered in under 50ms for online users via persistent WebSocket connections",
      "Guaranteed message ordering within a conversation using sequence numbers",
      "Offline message delivery when user comes back online (store-and-forward pattern)",
      "Support group chats with up to 1000 members with efficient fan-out",
      "End-to-end encryption for 1:1 chats (server should never see plaintext)",
      "Read receipts and typing indicators with minimal overhead (no DB writes for ephemeral events)",
      "Multi-device sync — messages appear on all logged-in devices simultaneously",
    ],
    hints: [
      {
        title: "WebSocket connections",
        content:
          "Use persistent WebSocket connections for real-time delivery. Need a connection gateway.",
      },
      {
        title: "Message ordering",
        content:
          "Use a message queue with per-conversation partitioning to guarantee ordering.",
      },
      {
        title: "Presence system",
        content:
          "Use Redis with TTL keys for online/offline status. Heartbeat every 30 seconds.",
      },
      {
        title: "Advanced: Connection management",
        content:
          "Use a dedicated WebSocket gateway layer that maintains millions of persistent connections. Store connection-to-server mappings in Redis so any app server can route a message to the correct gateway holding the recipient's connection.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "websocket-server", x: 200, y: 100 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 100 },
        { componentId: "app-server", x: 500, y: 180 },
        { componentId: "cache", x: 500, y: 50 },
        { componentId: "message-queue", x: 500, y: 350 },
        { componentId: "nosql-db", x: 700, y: 250 },
        { componentId: "monitoring", x: 700, y: 50 },
        { componentId: "rate-limiter", x: 50, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "load-balancer", target: "websocket-server" },
        { source: "websocket-server", target: "app-server" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["WebSocket", "Messaging", "Real-time"],
  },
  {
    id: "ride-sharing",
    title: "Uber / Ride Sharing",
    difficulty: "Hard",
    description:
      "Design a ride-sharing platform like Uber or Lyft. Match riders with nearby drivers in real-time, track live location updates, calculate accurate ETAs, and handle dynamic surge pricing. The system must ingest millions of location updates per second from active drivers while simultaneously running proximity queries to match riders. Uber processes over 1 million location updates per second during peak hours, making geospatial indexing and real-time stream processing the central design challenges.",
    requirements: {
      readsPerSec: 80000,
      writesPerSec: 300000,
      storageGB: 1000,
      latencyMs: 100,
      users: "50M DAU",
    },
    constraints: [
      "Driver matching within 5 seconds using geospatial proximity search",
      "Location updates every 3 seconds from all active drivers (~1M concurrent drivers)",
      "ETA accuracy within 20% of actual using real-time traffic and historical data",
      "Surge pricing computed in real-time per geo zone based on supply/demand ratios",
      "Trip history and receipts stored permanently for regulatory compliance",
      "Payment processing with idempotent charge guarantees (no double-charging)",
      "Graceful handling of driver/rider disconnections mid-trip without data loss",
    ],
    hints: [
      {
        title: "Geo-spatial indexing",
        content:
          "Use geohashing or a spatial index to efficiently find nearby drivers.",
      },
      {
        title: "Location ingestion",
        content:
          "High-frequency location updates need a message queue to buffer writes.",
      },
      {
        title: "Matching service",
        content:
          "A dedicated matching service queries the spatial index and assigns the optimal driver.",
      },
      {
        title: "Advanced: Geohash sharding",
        content:
          "Partition your driver location data by geohash prefix so each shard handles a geographic region. This lets proximity queries hit a single shard instead of scanning globally. Use Redis Geo commands (GEOADD/GEORADIUS) for O(log N) nearest-neighbor lookups.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "rate-limiter", x: 350, y: 120 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 400 },
        { componentId: "app-server", x: 500, y: 250 },
        { componentId: "cache", x: 500, y: 120 },
        { componentId: "message-queue", x: 500, y: 400 },
        { componentId: "stream-processor", x: 650, y: 400 },
        { componentId: "nosql-db", x: 700, y: 250 },
        { componentId: "sql-db", x: 700, y: 120 },
        { componentId: "monitoring", x: 850, y: 250 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "stream-processor" },
        { source: "stream-processor", target: "nosql-db" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Geo-spatial", "Real-time", "Matching"],
  },
  {
    id: "video-streaming",
    title: "YouTube / Video Streaming",
    difficulty: "Hard",
    description:
      "Design a video streaming platform like YouTube or Netflix. Support video upload, transcoding into multiple formats and resolutions, globally distributed storage, and adaptive bitrate streaming to millions of concurrent viewers. YouTube serves over 1 billion hours of video daily — the key challenges are building an efficient upload-transcode-serve pipeline, leveraging CDN edge caching for popular content, and separating the fast metadata path from the slow video delivery path.",
    requirements: {
      readsPerSec: 200000,
      writesPerSec: 5000,
      storageGB: 1000000,
      latencyMs: 200,
      users: "1B DAU",
    },
    constraints: [
      "Videos transcoded into multiple resolutions (360p, 720p, 1080p, 4K) and codecs (H.264, VP9, AV1)",
      "Adaptive bitrate streaming (HLS/DASH) adjusts quality based on real-time bandwidth",
      "Global delivery with < 200ms video start time for 95th percentile of users",
      "Support live streaming with < 5s glass-to-glass latency",
      "Recommendations engine producing personalized feeds from billions of videos",
      "Upload processing pipeline handles videos up to 256GB with resumable uploads",
      "Copyright detection (Content ID) must scan uploaded content before it goes live",
    ],
    hints: [
      {
        title: "Upload pipeline",
        content:
          "Upload to object storage, then use a message queue to trigger async transcoding workers.",
      },
      {
        title: "CDN is critical",
        content:
          "A CDN is essential for serving video content globally. Cache popular videos at the edge.",
      },
      {
        title: "Metadata vs video",
        content:
          "Separate video metadata (SQL/NoSQL) from video content (object storage + CDN).",
      },
      {
        title: "Advanced: Tiered storage",
        content:
          "Use hot/warm/cold storage tiers. Popular videos stay on CDN edge and fast object storage. Videos older than 30 days with low views move to cheaper infrequent-access storage (S3 IA / Glacier). This can cut storage costs by 60-70% without affecting user experience.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 100 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "rate-limiter", x: 350, y: 100 },
        { componentId: "app-server", x: 500, y: 250 },
        { componentId: "cache", x: 500, y: 100 },
        { componentId: "message-queue", x: 500, y: 400 },
        { componentId: "object-storage", x: 700, y: 100 },
        { componentId: "sql-db", x: 700, y: 250 },
        { componentId: "search", x: 700, y: 400 },
        { componentId: "monitoring", x: 850, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "rate-limiter" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "object-storage" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Streaming", "CDN", "Transcoding"],
  },
  {
    id: "rate-limiter",
    title: "Rate Limiter",
    difficulty: "Easy",
    description:
      "Design a distributed rate limiting service that throttles API requests per client, IP, or API key. Real systems like Cloudflare and AWS WAF use token bucket or sliding window algorithms backed by distributed counters in Redis. The key challenge is achieving consistency across multiple rate limiter instances without adding significant latency to the request path — Stripe processes millions of API calls per minute while enforcing per-key rate limits with sub-millisecond overhead.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 50000,
      storageGB: 10,
      latencyMs: 5,
      users: "50M DAU",
    },
    constraints: [
      "Sub-millisecond decision latency — rate limiting must not become a bottleneck itself",
      "Support multiple limiting algorithms: token bucket, sliding window log, sliding window counter",
      "Distributed counting across multiple instances using Redis with atomic operations (INCR + EXPIRE)",
      "Per-client, per-endpoint, and global rate limits with configurable thresholds",
      "Graceful handling of Redis failures — fail open vs fail closed configurable per rule",
      "Return standard HTTP 429 with Retry-After header and remaining quota in response headers",
      "Support burst allowance — allow short traffic spikes above the sustained rate limit",
    ],
    hints: [
      {
        title: "Start simple",
        content:
          "Begin with an API Gateway fronting app servers. Rate limit checks happen before business logic.",
      },
      {
        title: "Distributed counters",
        content:
          "Use Redis with INCR + EXPIRE for atomic counter updates across all instances. Lua scripts ensure atomicity.",
      },
      {
        title: "Sliding window",
        content:
          "A sliding window counter using two fixed windows with weighted counts gives accuracy without the memory cost of a full log.",
      },
      {
        title: "Advanced: Local + global",
        content:
          "Use a two-tier approach: local in-memory counters for hot-path speed with periodic sync to Redis for global consistency. This reduces Redis round-trips by 90% while keeping limits accurate within a small margin.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "rate-limiter", x: 350, y: 250 },
        { componentId: "api-gateway", x: 500, y: 250 },
        { componentId: "app-server", x: 650, y: 250 },
        { componentId: "cache", x: 350, y: 100 },
        { componentId: "monitoring", x: 650, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "rate-limiter", target: "api-gateway" },
        { source: "rate-limiter", target: "cache" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Distributed", "Algorithm", "Redis"],
  },
  {
    id: "notification-system",
    title: "Notification System",
    difficulty: "Medium",
    description:
      "Design a scalable notification service like Firebase Cloud Messaging or AWS SNS that delivers push notifications, emails, and SMS to hundreds of millions of users. The system must handle priority-based routing, template rendering, delivery tracking, and retry logic across multiple channels. Real platforms like WhatsApp process over 100 billion messages daily — the key challenges are fan-out at scale, rate limiting per channel, and maintaining delivery guarantees without overwhelming downstream providers.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 100000,
      storageGB: 2000,
      latencyMs: 500,
      users: "500M DAU",
    },
    constraints: [
      "Support push (iOS/Android/Web), email, and SMS delivery channels with pluggable providers",
      "Priority queue system — critical alerts (security, payments) jump ahead of marketing notifications",
      "Template engine with variable substitution and localization (100+ languages)",
      "At-least-once delivery with deduplication to prevent duplicate notifications to users",
      "Per-user notification preferences and opt-out management across all channels",
      "Delivery tracking with read receipts, bounce handling, and delivery status webhooks",
      "Rate limiting per provider to avoid being throttled by APNS, FCM, email gateways, or SMS providers",
    ],
    hints: [
      {
        title: "Event-driven architecture",
        content:
          "Use a message queue to decouple notification producers from the delivery pipeline. Events trigger notification creation.",
      },
      {
        title: "Priority queues",
        content:
          "Use separate message queues or priority lanes for critical vs marketing notifications to prevent backlog delays.",
      },
      {
        title: "Template and preferences",
        content:
          "Store templates and user preferences in a cache layer for fast lookup during high-volume sends.",
      },
      {
        title: "Advanced: Fan-out workers",
        content:
          "Use a worker pool pattern: a dispatcher reads from the priority queue, resolves user preferences, renders templates, then fans out to channel-specific workers (push worker, email worker, SMS worker). Each worker handles retries and provider-specific rate limits independently.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 500, y: 200 },
        { componentId: "message-queue", x: 500, y: 380 },
        { componentId: "cache", x: 500, y: 60 },
        { componentId: "nosql-db", x: 700, y: 200 },
        { componentId: "sql-db", x: 700, y: 380 },
        { componentId: "monitoring", x: 850, y: 200 },
        { componentId: "rate-limiter", x: 350, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "monitoring" },
        { source: "api-gateway", target: "rate-limiter" },
      ],
    },
    tags: ["Push", "Queue", "Fanout"],
  },
  {
    id: "typeahead-autocomplete",
    title: "Typeahead / Autocomplete",
    difficulty: "Medium",
    description:
      "Design a search autocomplete system like Google's search suggestions or Algolia's instant search. As users type each character, the system returns the top 5-10 matching suggestions ranked by popularity, personalization, and recency within 100ms. Google processes over 8.5 billion searches per day with autocomplete triggering on every keystroke — the core challenges are building an efficient prefix-matching data structure (trie) and keeping suggestions fresh as search trends change in real-time.",
    requirements: {
      readsPerSec: 200000,
      writesPerSec: 5000,
      storageGB: 100,
      latencyMs: 50,
      users: "1B queries/day",
    },
    constraints: [
      "Response time under 50ms at p99 — suggestions must appear as the user types each character",
      "Top-K results ranked by query frequency, recency, and optional personalization signals",
      "Support prefix matching and fuzzy matching (handle typos with edit distance ≤ 2)",
      "Real-time trend updates — breaking news or viral topics should appear within minutes",
      "Multi-language support with proper Unicode handling and transliteration",
      "Filter offensive or inappropriate suggestions before returning results",
      "Personalized suggestions based on user search history when available",
    ],
    hints: [
      {
        title: "Trie data structure",
        content:
          "Use a trie (prefix tree) to efficiently store and query prefix matches. Each node stores the top-K suggestions for that prefix.",
      },
      {
        title: "Caching is critical",
        content:
          "Cache the most popular prefixes (1-3 characters) aggressively — they account for the majority of queries.",
      },
      {
        title: "Offline aggregation",
        content:
          "Use a message queue to collect search logs, then batch-process to update suggestion rankings periodically.",
      },
      {
        title: "Advanced: Two-tier approach",
        content:
          "Serve from an in-memory trie on the app servers for ultra-low latency, backed by a distributed cache (Redis) for longer prefixes. Use a background pipeline that aggregates search logs, computes new rankings, and rebuilds the trie every 15 minutes.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 100 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "app-server", x: 400, y: 250 },
        { componentId: "cache", x: 400, y: 100 },
        { componentId: "message-queue", x: 400, y: 400 },
        { componentId: "nosql-db", x: 600, y: 250 },
        { componentId: "search", x: 600, y: 100 },
        { componentId: "monitoring", x: 800, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Trie", "Search", "Caching"],
  },
  {
    id: "web-crawler",
    title: "Web Crawler",
    difficulty: "Medium",
    description:
      "Design a distributed web crawler like Googlebot that can crawl billions of web pages efficiently. The crawler must manage a URL frontier, respect robots.txt politeness policies, deduplicate content, and handle the enormous variety of web page structures. Google's crawler discovers and indexes over 100 billion pages — the key design decisions involve URL prioritization, politeness (not overwhelming any single domain), and distributed coordination to avoid redundant crawls.",
    requirements: {
      readsPerSec: 10000,
      writesPerSec: 50000,
      storageGB: 50000,
      latencyMs: 1000,
      users: "N/A (internal system)",
    },
    constraints: [
      "Crawl rate of 1000+ pages per second across the entire cluster",
      "Respect robots.txt and per-domain crawl delays — never overwhelm a single website",
      "URL deduplication using content hashing (SimHash/MinHash) to detect near-duplicate pages",
      "URL frontier with priority queue — prioritize important/fresh pages over deep/stale ones",
      "Handle DNS resolution caching to avoid repeated lookups for the same domain",
      "Graceful handling of spider traps (infinite URL generation, redirect loops, soft 404s)",
      "Incremental re-crawling based on page change frequency (adaptive crawl scheduling)",
    ],
    hints: [
      {
        title: "URL frontier design",
        content:
          "Use a message queue as your URL frontier with priority levels. Separate front queues (priority) from back queues (politeness/per-host).",
      },
      {
        title: "Deduplication",
        content:
          "Use a Bloom filter or content hash stored in a NoSQL database to quickly check if a URL or page content has been seen before.",
      },
      {
        title: "Distributed workers",
        content:
          "Multiple crawler workers pull URLs from the frontier, fetch pages, extract links, and push new URLs back. Partition by domain for politeness.",
      },
      {
        title: "Advanced: DNS cache + politeness",
        content:
          "Maintain a local DNS cache (TTL-based) on each crawler worker to reduce DNS overhead. Implement per-domain rate limiters in Redis — each worker checks the domain's last crawl timestamp before fetching. This prevents any single domain from being overwhelmed even with hundreds of workers.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "message-queue", x: 100, y: 250 },
        { componentId: "app-server", x: 300, y: 250 },
        { componentId: "cache", x: 300, y: 100 },
        { componentId: "rate-limiter", x: 300, y: 400 },
        { componentId: "nosql-db", x: 550, y: 250 },
        { componentId: "object-storage", x: 550, y: 100 },
        { componentId: "search", x: 550, y: 400 },
        { componentId: "monitoring", x: 750, y: 250 },
      ],
      edges: [
        { source: "message-queue", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "rate-limiter" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "object-storage" },
        { source: "app-server", target: "message-queue" },
        { source: "nosql-db", target: "search" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Distributed", "Queue", "Storage"],
  },
  {
    id: "distributed-cache",
    title: "Distributed Cache",
    difficulty: "Medium",
    description:
      "Design a distributed in-memory caching system like Redis or Memcached. The system must support key-value storage with sub-millisecond reads, consistent hashing for data distribution, multiple eviction policies, and replication for fault tolerance. Redis serves over 1 million requests per second per node — the key challenges are maintaining cache coherence across nodes, handling hot keys that receive disproportionate traffic, and designing a partition strategy that minimizes data movement during scaling events.",
    requirements: {
      readsPerSec: 500000,
      writesPerSec: 100000,
      storageGB: 500,
      latencyMs: 2,
      users: "N/A (infrastructure)",
    },
    constraints: [
      "Sub-millisecond read latency at p99 with support for 1M+ ops/sec per node",
      "Consistent hashing with virtual nodes for even data distribution and minimal remapping on scale events",
      "Multiple eviction policies: LRU, LFU, TTL-based, and random eviction",
      "Primary-replica replication with configurable consistency (async for speed, sync for safety)",
      "Hot key detection and mitigation — replicate hot keys across multiple nodes",
      "Support for data structures beyond key-value: lists, sets, sorted sets, hash maps",
      "Cluster health monitoring with automatic failover when a primary node goes down",
    ],
    hints: [
      {
        title: "Consistent hashing",
        content:
          "Use consistent hashing with virtual nodes to map keys to cache servers. This minimizes key redistribution when adding/removing nodes.",
      },
      {
        title: "Replication",
        content:
          "Each primary node replicates to 1-2 replicas. On primary failure, promote a replica using leader election.",
      },
      {
        title: "Eviction policies",
        content:
          "Implement LRU using a doubly-linked list + hash map for O(1) eviction. Support configurable policies per cache namespace.",
      },
      {
        title: "Advanced: Hot key handling",
        content:
          "Detect hot keys by sampling access patterns. When a key exceeds a threshold (e.g., 1000 QPS), automatically replicate it to all nodes and route reads using client-side random selection. This distributes the load of celebrity-profile-style hot keys.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "app-server", x: 400, y: 250 },
        { componentId: "cache", x: 600, y: 150 },
        { componentId: "nosql-db", x: 600, y: 350 },
        { componentId: "monitoring", x: 800, y: 250 },
        { componentId: "service-mesh", x: 400, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "app-server" },
        { source: "app-server", target: "service-mesh" },
        { source: "service-mesh", target: "cache" },
        { source: "cache", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Hashing", "Replication", "Memory"],
  },
  {
    id: "payment-system",
    title: "Payment System",
    difficulty: "Hard",
    description:
      "Design a payment processing platform like Stripe or PayPal. The system handles payment authorization, capture, settlement, refunds, and ledger management with strict financial consistency guarantees. Stripe processes hundreds of billions of dollars annually — the core challenges are ensuring exactly-once payment execution through idempotency keys, maintaining a double-entry accounting ledger, and handling the complex state machine of payment lifecycles across multiple payment processors and methods.",
    requirements: {
      readsPerSec: 30000,
      writesPerSec: 10000,
      storageGB: 5000,
      latencyMs: 200,
      users: "10M merchants",
    },
    constraints: [
      "Exactly-once payment execution using idempotency keys — no double-charges under any failure scenario",
      "Double-entry accounting ledger — every transaction creates balanced debit and credit entries",
      "Support multiple payment methods: credit cards, bank transfers, digital wallets, crypto",
      "PCI DSS compliance — card numbers must be tokenized and never stored in plaintext",
      "Reconciliation system that matches internal records with bank settlement files daily",
      "Dispute/chargeback handling workflow with evidence submission and deadline tracking",
      "Multi-currency support with real-time exchange rates and proper rounding (banker's rounding)",
    ],
    hints: [
      {
        title: "Idempotency is everything",
        content:
          "Every payment API call must include an idempotency key. Store the key and result so retries return the same response without re-executing.",
      },
      {
        title: "Payment state machine",
        content:
          "Model payments as a state machine: created → authorized → captured → settled (or refunded). Store every state transition.",
      },
      {
        title: "Ledger design",
        content:
          "Use a SQL database with ACID transactions for the ledger. Every operation creates two rows: a debit and a credit that sum to zero.",
      },
      {
        title: "Advanced: Saga pattern",
        content:
          "Use the saga pattern for multi-step payments (authorize → fraud check → capture → settle). Each step has a compensating action (e.g., void authorization). A message queue coordinates steps, and failed steps trigger compensating transactions in reverse order.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 100 },
        { componentId: "rate-limiter", x: 350, y: 420 },
        { componentId: "app-server", x: 500, y: 250 },
        { componentId: "cache", x: 500, y: 100 },
        { componentId: "distributed-lock", x: 500, y: 420 },
        { componentId: "message-queue", x: 650, y: 420 },
        { componentId: "sql-db", x: 700, y: 200 },
        { componentId: "nosql-db", x: 700, y: 100 },
        { componentId: "monitoring", x: 850, y: 250 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "rate-limiter" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "distributed-lock" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["ACID", "Idempotent", "Ledger"],
  },
  {
    id: "ticket-booking",
    title: "Ticket Booking (Ticketmaster)",
    difficulty: "Hard",
    description:
      "Design a ticket booking platform like Ticketmaster or BookMyShow for concerts, sports events, and shows. The system must handle massive traffic spikes when popular events go on sale (Taylor Swift's Eras Tour saw 14 million users hit the site simultaneously), manage seat inventory with optimistic locking to prevent double-booking, and implement a virtual waiting room queue. The central challenges are handling extreme concurrency on hot inventory, seat hold/release lifecycle management, and preventing bots from buying tickets.",
    requirements: {
      readsPerSec: 200000,
      writesPerSec: 50000,
      storageGB: 1000,
      latencyMs: 200,
      users: "100M DAU",
    },
    constraints: [
      "No double-booking — optimistic locking or distributed locks must prevent two users from booking the same seat",
      "Virtual waiting room queue that activates when traffic exceeds system capacity (fairness guarantee)",
      "Seat hold with TTL — selected seats are reserved for 10 minutes during checkout, then auto-released",
      "Bot detection and mitigation using CAPTCHA, device fingerprinting, and behavioral analysis",
      "Support interactive seat maps with real-time availability updates via WebSocket/SSE",
      "Payment timeout handling — if payment fails after seat selection, seats must be released back to inventory",
      "Surge pricing and dynamic pricing tiers based on demand signals and remaining inventory",
    ],
    hints: [
      {
        title: "Virtual queue",
        content:
          "When traffic spikes, put users in a Redis-backed FIFO queue. Release them in batches to the booking flow at a controlled rate.",
      },
      {
        title: "Inventory locking",
        content:
          "Use Redis distributed locks (SETNX with TTL) for seat holds. This prevents double-booking while allowing auto-release on timeout.",
      },
      {
        title: "Event-driven updates",
        content:
          "Use a message queue to broadcast seat availability changes to all connected clients in real-time.",
      },
      {
        title: "Advanced: Two-phase booking",
        content:
          "Phase 1: Optimistically reserve the seat in Redis (SETNX with 10-min TTL). Phase 2: On payment success, persist to SQL database and remove the Redis hold. On payment failure or timeout, the Redis key auto-expires and the seat becomes available. This gives you both speed and durability.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "rate-limiter", x: 350, y: 100 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "websocket-server", x: 530, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 100 },
        { componentId: "distributed-lock", x: 720, y: 100 },
        { componentId: "message-queue", x: 720, y: 420 },
        { componentId: "sql-db", x: 720, y: 250 },
        { componentId: "nosql-db", x: 880, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "websocket-server" },
        { source: "websocket-server", target: "app-server" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "distributed-lock" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Concurrency", "Inventory", "Booking"],
  },
  {
    id: "collaborative-editor",
    title: "Google Docs / Collaborative Editor",
    difficulty: "Hard",
    description:
      "Design a real-time collaborative document editor like Google Docs or Notion where multiple users can simultaneously edit the same document with changes appearing instantly for all participants. Google Docs supports up to 100 concurrent editors on a single document — the core challenges are conflict resolution when two users edit the same paragraph simultaneously (using Operational Transformation or CRDTs), maintaining cursor positions and selections across participants, and ensuring document state eventually converges to the same result regardless of network delays.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 30000,
      storageGB: 5000,
      latencyMs: 100,
      users: "100M DAU",
    },
    constraints: [
      "Real-time collaboration with changes visible to all editors within 200ms",
      "Conflict resolution using OT (Operational Transformation) or CRDTs for concurrent edits",
      "Cursor presence — show each collaborator's cursor position and selection in real-time",
      "Full version history with point-in-time restore and diff between any two versions",
      "Offline editing support with automatic merge when reconnecting",
      "Rich text formatting, tables, images, and embedded content",
      "Document-level and block-level permissions (view, comment, edit) with sharing controls",
    ],
    hints: [
      {
        title: "WebSocket for real-time",
        content:
          "Use persistent WebSocket connections for bidirectional real-time updates between clients and the collaboration server.",
      },
      {
        title: "OT vs CRDT",
        content:
          "OT transforms operations against concurrent edits (used by Google Docs). Figma uses a custom server-authoritative approach inspired by CRDTs. OT is simpler; CRDTs are more robust offline.",
      },
      {
        title: "Version history",
        content:
          "Store document snapshots periodically and individual operations between snapshots. Reconstruct any version by applying ops to the nearest snapshot.",
      },
      {
        title: "Advanced: Collaboration server",
        content:
          "Run a dedicated collaboration server per document that receives all client operations, transforms them against concurrent ops (OT), applies them to the authoritative document state, and broadcasts the transformed ops to all other clients. Use Redis Pub/Sub to coordinate when a document's collaboration server moves between instances.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "websocket-server", x: 530, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "message-queue", x: 720, y: 420 },
        { componentId: "sql-db", x: 720, y: 200 },
        { componentId: "nosql-db", x: 720, y: 80 },
        { componentId: "object-storage", x: 880, y: 200 },
        { componentId: "monitoring", x: 880, y: 370 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "websocket-server" },
        { source: "websocket-server", target: "app-server" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "nosql-db" },
        { source: "cdn", target: "object-storage" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["CRDT", "WebSocket", "Collaboration"],
  },
  {
    id: "file-storage",
    title: "Dropbox / File Storage",
    difficulty: "Hard",
    description:
      "Design a cloud file storage and synchronization service like Dropbox or Google Drive. Users upload files that sync across all their devices, with support for file versioning, sharing, and conflict resolution. Dropbox syncs over 1.2 billion files daily — the key engineering challenges are efficient delta sync (only uploading changed blocks instead of entire files), deduplication across users to save storage, and handling conflicts when the same file is edited on multiple devices while offline.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 20000,
      storageGB: 1000000,
      latencyMs: 500,
      users: "500M DAU",
    },
    constraints: [
      "Block-level chunking (4MB blocks) with content-addressable storage for deduplication",
      "Delta sync — only upload changed blocks, not the entire file, reducing bandwidth by 80%+",
      "File versioning with configurable retention (default 30 days) and point-in-time restore",
      "Conflict resolution for simultaneous edits — create conflict copies with user resolution UI",
      "Real-time sync notifications to all devices when a file changes on any device",
      "Sharing with granular permissions (view, edit, comment) and shareable links with expiration",
      "Resumable uploads for large files — handle network interruptions without restarting",
    ],
    hints: [
      {
        title: "Block-level storage",
        content:
          "Split files into fixed-size blocks, hash each block, and store blocks in object storage. The metadata DB maps files to ordered lists of block hashes.",
      },
      {
        title: "Deduplication",
        content:
          "Use content-addressable storage — if a block hash already exists, don't store it again. This saves massive storage when users share similar files.",
      },
      {
        title: "Sync protocol",
        content:
          "When a file changes, compute the new block list, diff against the stored block list, and only upload new/changed blocks. Notify other devices via a message queue.",
      },
      {
        title: "Advanced: Delta sync with rolling hash",
        content:
          "Use rolling hash (Rabin fingerprint) to detect block boundaries in modified files. This enables variable-size chunking that minimizes the number of changed blocks even when content is inserted in the middle of a file. Combine with a message queue for real-time sync notifications to all connected devices.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 100 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 100 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "object-storage", x: 720, y: 100 },
        { componentId: "sql-db", x: 720, y: 250 },
        { componentId: "nosql-db", x: 720, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "object-storage" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Chunking", "Sync", "Dedup"],
  },
  {
    id: "parking-lot",
    title: "Parking Lot System",
    difficulty: "Easy",
    description:
      "Design a smart parking lot management system that tracks vehicle entry/exit, manages spot availability in real-time, handles reservations, and processes payments. Modern smart parking systems like ParkMobile and SpotHero serve millions of daily transactions — the key challenges are maintaining accurate real-time availability across multiple lots, handling concurrent reservation requests for the same spot, and integrating with IoT sensors for automatic occupancy detection.",
    requirements: {
      readsPerSec: 5000,
      writesPerSec: 2000,
      storageGB: 100,
      latencyMs: 200,
      users: "10M DAU",
    },
    constraints: [
      "Real-time spot availability updated within 2 seconds of vehicle entry/exit via IoT sensors",
      "Reservation system with time slots — prevent double-booking of the same spot at the same time",
      "Dynamic pricing based on demand, time of day, event proximity, and lot occupancy percentage",
      "Support multiple vehicle types: compact, regular, handicapped, EV charging, motorcycle",
      "Automatic license plate recognition (LPR) for ticketless entry and exit",
      "Payment processing with support for hourly, daily, and monthly passes",
      "Multi-lot management dashboard with analytics (peak hours, revenue, utilization trends)",
    ],
    hints: [
      {
        title: "Data model",
        content:
          "Model parking lots with floors, zones, and individual spots. Each spot has a type, status, and optional reservation.",
      },
      {
        title: "Real-time availability",
        content:
          "Use Redis to cache current availability counts per lot/floor/type. Update on every entry/exit event for instant queries.",
      },
      {
        title: "Reservation locking",
        content:
          "Use optimistic locking in the database for reservations — check availability at commit time, not at selection time.",
      },
      {
        title: "Advanced: Event-driven updates",
        content:
          "IoT sensors publish entry/exit events to a message queue. A processor updates the cache (Redis) and database, and broadcasts availability changes to the mobile app via WebSocket for real-time map updates.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 500, y: 250 },
        { componentId: "cache", x: 500, y: 100 },
        { componentId: "message-queue", x: 500, y: 400 },
        { componentId: "sql-db", x: 700, y: 250 },
        { componentId: "monitoring", x: 700, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "sql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["IoT", "Real-time", "Booking"],
  },
  {
    id: "instagram",
    title: "Instagram / Photo Sharing",
    difficulty: "Medium",
    description:
      "Design a photo and short-video sharing platform like Instagram. Users upload photos that are processed (resized, filtered, compressed), stored across a CDN, and displayed in a personalized feed. Instagram serves over 2 billion monthly active users and processes 100+ million photo uploads daily — the key challenges are building an efficient media processing pipeline, generating a ranked feed from thousands of candidate posts, and serving media globally with minimal latency using edge caching.",
    requirements: {
      readsPerSec: 150000,
      writesPerSec: 20000,
      storageGB: 500000,
      latencyMs: 200,
      users: "500M DAU",
    },
    constraints: [
      "Photo upload processing pipeline: resize to multiple resolutions, apply optional filters, strip EXIF data",
      "Stories (24h ephemeral content) and Reels (short video) alongside permanent posts",
      "Ranked feed using signals: relationship strength, post engagement, recency, content type preferences",
      "Image/video CDN with edge caching — serve media from the nearest POP to the user",
      "Social graph storage for followers/following with efficient fan-out for feed generation",
      "Real-time engagement (likes, comments, shares) with optimistic UI updates",
      "Content moderation pipeline — automated detection of policy-violating content before publication",
    ],
    hints: [
      {
        title: "Media pipeline",
        content:
          "Upload original to object storage, push a processing job to a message queue, workers generate thumbnails and resized versions, then update CDN.",
      },
      {
        title: "Feed generation",
        content:
          "Pre-compute feeds for most users (fan-out-on-write). For high-follower accounts, merge their posts at read time (fan-out-on-read).",
      },
      {
        title: "CDN strategy",
        content:
          "Serve all media through a CDN with aggressive caching. Use image-specific CDNs (like Cloudinary or Imgix) for on-the-fly resizing.",
      },
      {
        title: "Advanced: Two-tier storage",
        content:
          "Recent photos (< 30 days) stay on fast SSD-backed object storage with CDN caching. Older photos migrate to cheaper archival storage (S3 Infrequent Access). When an old photo is accessed, the CDN fetches from archival storage and caches it at the edge, hiding the higher latency from users.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "app-server", x: 530, y: 200 },
        { componentId: "cache", x: 530, y: 60 },
        { componentId: "message-queue", x: 530, y: 380 },
        { componentId: "object-storage", x: 720, y: 80 },
        { componentId: "nosql-db", x: 720, y: 250 },
        { componentId: "search", x: 720, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "object-storage" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["CDN", "Media", "Feed"],
  },
  {
    id: "music-streaming",
    title: "Spotify / Music Streaming",
    difficulty: "Medium",
    description:
      "Design a music streaming platform like Spotify that serves audio content to millions of concurrent listeners, manages a catalog of 100M+ tracks, generates personalized playlists, and supports offline downloads. Spotify streams over 4 billion minutes of audio daily — the key challenges are optimizing audio delivery with adaptive bitrate streaming, building a recommendation engine from listening history, and managing music licensing and royalty tracking for artists.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 10000,
      storageGB: 500000,
      latencyMs: 200,
      users: "200M DAU",
    },
    constraints: [
      "Adaptive bitrate audio streaming (96kbps, 160kbps, 320kbps) based on network conditions",
      "Gapless playback with audio pre-buffering — next track starts loading before current track ends",
      "Personalized recommendations: Discover Weekly, Release Radar, daily mixes using collaborative filtering",
      "Offline mode with encrypted local storage — downloaded tracks work without internet",
      "Social features: collaborative playlists, friend activity, sharing to external platforms",
      "Real-time play count tracking and royalty calculation per stream for rights holders",
      "Search across 100M+ tracks by title, artist, album, lyrics with fuzzy matching",
    ],
    hints: [
      {
        title: "Audio delivery",
        content:
          "Store audio files in object storage at multiple bitrates. Use a CDN with edge caching for popular tracks — top 1% of tracks account for 80% of streams.",
      },
      {
        title: "Recommendation engine",
        content:
          "Combine collaborative filtering (users who liked X also liked Y) with content-based features (audio analysis, genre, mood). Process listening events through a message queue.",
      },
      {
        title: "Catalog and search",
        content:
          "Store the music catalog in a NoSQL database. Use Elasticsearch for full-text search across titles, artists, and lyrics.",
      },
      {
        title: "Advanced: Pre-fetch pipeline",
        content:
          "When a user is 30 seconds from the end of a track, predict the next track (based on queue, playlist, or auto-play) and start streaming it to the client. Cache frequently co-listened tracks on the same CDN edge node to reduce origin fetches.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "object-storage", x: 720, y: 80 },
        { componentId: "nosql-db", x: 720, y: 250 },
        { componentId: "search", x: 720, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Streaming", "CDN", "Recommendations"],
  },
  {
    id: "ecommerce",
    title: "Amazon / E-Commerce",
    difficulty: "Hard",
    description:
      "Design a large-scale e-commerce platform like Amazon. The system handles product catalog management with millions of SKUs, shopping cart persistence, inventory tracking across warehouses, order processing, and personalized recommendations. Amazon processes over 300 million active customer accounts and handles 66,000 orders per hour during peak events like Prime Day — the central challenges are maintaining inventory consistency across concurrent purchases, building a low-latency product search, and orchestrating the complex order fulfillment pipeline.",
    requirements: {
      readsPerSec: 200000,
      writesPerSec: 50000,
      storageGB: 20000,
      latencyMs: 200,
      users: "300M DAU",
    },
    constraints: [
      "Product catalog with 100M+ SKUs, each with variants (size, color), pricing tiers, and seller information",
      "Real-time inventory tracking across multiple warehouses — prevent overselling on concurrent purchases",
      "Shopping cart persistence — carts survive browser closure, device switching, and user sign-in/out",
      "Order processing pipeline: payment → inventory reservation → warehouse assignment → shipping → delivery tracking",
      "Product search with filters (category, price, rating, availability) and typo tolerance",
      "Personalized recommendations on homepage, product pages, and cart (frequently bought together)",
      "Flash sale / Prime Day handling — 100× normal traffic spikes with fair inventory allocation",
    ],
    hints: [
      {
        title: "Microservice split",
        content:
          "Separate services for catalog, cart, inventory, orders, payments, and search. Each scales independently based on its traffic pattern.",
      },
      {
        title: "Inventory management",
        content:
          "Use optimistic locking with version numbers for inventory updates. Reserve stock at checkout, deduct on payment confirmation, release on timeout.",
      },
      {
        title: "Cart design",
        content:
          "Store carts in a NoSQL database (DynamoDB) with the user ID as the key. Merge anonymous carts with user carts on sign-in.",
      },
      {
        title: "Advanced: Event sourcing for orders",
        content:
          "Model orders as a stream of events (created → paid → picked → packed → shipped → delivered). Each event is appended to a message queue. Consumers update projections (order status, inventory, analytics) independently. This gives you full auditability, replay capability, and decoupled services.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 100 },
        { componentId: "rate-limiter", x: 350, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 100 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "sql-db", x: 720, y: 200 },
        { componentId: "nosql-db", x: 720, y: 350 },
        { componentId: "search", x: 880, y: 200 },
        { componentId: "object-storage", x: 880, y: 350 },
        { componentId: "monitoring", x: 880, y: 80 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "rate-limiter" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Catalog", "Cart", "Inventory"],
  },
  {
    id: "team-messaging",
    title: "Slack / Team Messaging",
    difficulty: "Hard",
    description:
      "Design a workspace-based team messaging platform like Slack or Microsoft Teams. The system supports organized channels, threaded conversations, direct messages, file sharing, search across message history, and integrations with third-party services. Slack handles over 65 million daily active users across millions of workspaces — the key challenges are maintaining message ordering and delivery guarantees across channels, building a fast full-text search index over billions of messages, and managing the complex permission model of workspaces, channels, and threads.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 30000,
      storageGB: 10000,
      latencyMs: 100,
      users: "100M DAU",
    },
    constraints: [
      "Workspace isolation — data from one workspace must never leak to another (multi-tenant security)",
      "Channel types: public (discoverable), private (invite-only), DMs (1:1 and group)",
      "Threaded conversations with reply counts, last-reply timestamps, and thread-follow notifications",
      "Real-time message delivery via WebSocket with offline message queuing for disconnected clients",
      "Full-text search across all messages in a workspace with filters (channel, user, date range, has:file)",
      "File sharing with preview generation (images, PDFs, code snippets) and per-file access control",
      "Integration framework for bots and external services (webhooks, slash commands, OAuth apps)",
    ],
    hints: [
      {
        title: "Message storage",
        content:
          "Store messages in a NoSQL database partitioned by workspace + channel. Use channel-level sequence numbers for ordering.",
      },
      {
        title: "Real-time delivery",
        content:
          "Maintain WebSocket connections per user. Use Redis Pub/Sub to route messages — subscribe each connection to the user's active channels.",
      },
      {
        title: "Search architecture",
        content:
          "Index messages in Elasticsearch partitioned by workspace. Update the index asynchronously via a message queue to avoid slowing down message sends.",
      },
      {
        title: "Advanced: Connection gateway",
        content:
          "Deploy a dedicated WebSocket gateway layer that maintains persistent connections. App servers send messages to the gateway via an internal message bus. The gateway maps user IDs to connections. This separates the stateful connection layer from the stateless business logic, letting each scale independently.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "websocket-server", x: 530, y: 380 },
        { componentId: "app-server", x: 530, y: 200 },
        { componentId: "cache", x: 530, y: 60 },
        { componentId: "message-queue", x: 720, y: 380 },
        { componentId: "nosql-db", x: 720, y: 200 },
        { componentId: "object-storage", x: 720, y: 60 },
        { componentId: "search", x: 880, y: 380 },
        { componentId: "monitoring", x: 880, y: 200 },
        { componentId: "rate-limiter", x: 200, y: 420 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "websocket-server" },
        { source: "websocket-server", target: "app-server" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "nosql-db" },
        { source: "message-queue", target: "search" },
        { source: "message-queue", target: "object-storage" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["WebSocket", "Search", "Workspace"],
  },
  {
    id: "metrics-monitoring",
    title: "Metrics / Monitoring System",
    difficulty: "Hard",
    description:
      "Design a metrics collection and monitoring system like Datadog, Prometheus, or New Relic. The system ingests millions of time-series data points per second from thousands of servers, stores them efficiently with configurable retention, supports real-time dashboarding, and triggers alerts based on complex threshold and anomaly detection rules. Datadog ingests trillions of data points daily — the core challenges are designing a storage engine optimized for time-series write patterns, supporting flexible aggregation queries at sub-second speed, and building a reliable alerting pipeline with low false-positive rates.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 500000,
      storageGB: 50000,
      latencyMs: 100,
      users: "N/A (infrastructure)",
    },
    constraints: [
      "Ingest 1M+ metrics data points per second with sub-second write latency",
      "Time-series storage with automatic downsampling: raw (7 days), 1-min avg (30 days), 1-hour avg (1 year)",
      "Flexible query language for aggregation: avg, sum, percentiles, rate, group-by across arbitrary tag dimensions",
      "Real-time dashboard rendering with auto-refresh and support for custom visualization widgets",
      "Alerting engine with threshold, anomaly detection, and composite alert conditions",
      "Alert routing with escalation policies, on-call schedules, and multi-channel delivery (PagerDuty, Slack, email)",
      "Tag-based metric organization with high-cardinality tag support (up to 10K unique values per tag)",
    ],
    hints: [
      {
        title: "Write-optimized ingestion",
        content:
          "Use a message queue to buffer incoming metrics. Batch writes to the time-series database for higher throughput.",
      },
      {
        title: "Time-series storage",
        content:
          "Use a specialized time-series database (or NoSQL with time-based partitioning). Compress adjacent data points using delta-of-delta encoding.",
      },
      {
        title: "Alerting pipeline",
        content:
          "Separate the alerting evaluation from ingestion. A dedicated service continuously evaluates alert rules against recent data and fires notifications.",
      },
      {
        title: "Advanced: Downsampling pipeline",
        content:
          "Run a background job that reads raw metrics older than 7 days, computes 1-minute aggregates (avg, min, max, count), writes them to a separate table, and deletes the raw data. Repeat at 30 days for 1-hour aggregates. This reduces storage by 100x while keeping historical queries fast.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "load-balancer", x: 100, y: 250 },
        { componentId: "api-gateway", x: 250, y: 250 },
        { componentId: "app-server", x: 420, y: 200 },
        { componentId: "message-queue", x: 420, y: 380 },
        { componentId: "cache", x: 420, y: 60 },
        { componentId: "timeseries-db", x: 620, y: 200 },
        { componentId: "sql-db", x: 620, y: 380 },
        { componentId: "search", x: 620, y: 60 },
        { componentId: "monitoring", x: 820, y: 200 },
        { componentId: "auth-service", x: 250, y: 100 },
      ],
      edges: [
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "timeseries-db" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["TimeSeries", "Alerting", "Aggregation"],
  },
];

export function getProblemById(id: string): Problem | undefined {
  return PROBLEMS.find((p) => p.id === id);
}
