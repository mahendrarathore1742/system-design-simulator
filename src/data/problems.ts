import type { Problem } from "@/types/problem";

export const PROBLEMS: Problem[] = [
  {
    id: "url-shortener",
    title: "URL Shortener",
    difficulty: "Easy",
    description:
      "Design a URL shortening service like Bitly or TinyURL. Users submit long URLs and receive short, unique aliases that redirect to the original destination. The system is heavily read-biased — for every URL created, expect 100x more redirect lookups. Real-world services like Bitly handle billions of redirects per month with sub-100ms latency, making caching strategy the key design decision.",
    requirements: {
      readsPerSec: 10000,
      writesPerSec: 1000,
      storageGB: 500,
      latencyMs: 100,
      users: "100M DAU",
    },
    constraints: [
      "Short URLs should be unique and non-predictable (base62 or base58 encoding)",
      "Redirect latency < 100ms at p99 — users should not notice any delay",
      "System should handle 10:1 read/write ratio with potential 100:1 spikes",
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
      writesPerSec: 10000,
      storageGB: 5000,
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
      writesPerSec: 20000,
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
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 100 },
        { componentId: "app-server", x: 500, y: 180 },
        { componentId: "cache", x: 500, y: 50 },
        { componentId: "message-queue", x: 500, y: 350 },
        { componentId: "nosql-db", x: 700, y: 250 },
        { componentId: "monitoring", x: 700, y: 50 },
        { componentId: "rate-limiter", x: 200, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "rate-limiter" },
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
      writesPerSec: 30000,
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
        { componentId: "nosql-db", x: 700, y: 250 },
        { componentId: "sql-db", x: 700, y: 400 },
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
        { source: "message-queue", target: "nosql-db" },
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
      storageGB: 50000,
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
];

export function getProblemById(id: string): Problem | undefined {
  return PROBLEMS.find((p) => p.id === id);
}
