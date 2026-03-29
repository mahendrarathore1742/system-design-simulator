<div align="center">

<!-- Animated SVG Banner with live traffic dots and gradient pulse -->
<a href="https://github.com/vijaygupta18/system-design-simulator">
  <img src="public/banner.svg" alt="SystemSim — System Design Interview Simulator" width="900"/>
</a>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![ReactFlow](https://img.shields.io/badge/ReactFlow_v12-FF0072?style=flat-square)](https://reactflow.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Build real system architectures. Simulate production traffic. Get scored like an interview.**

[Live Demo](#) · [Report Bug](https://github.com/vijaygupta18/system-design-simulator/issues) · [Request Feature](https://github.com/vijaygupta18/system-design-simulator/issues)

</div>

---

## What is SystemSim?

SystemSim is an **interactive system design interview preparation tool** where you drag-and-drop real infrastructure components, wire them together, simulate traffic flowing through your architecture, and get scored across 5 engineering dimensions.

It's like a flight simulator — but for system design interviews.

<!-- Animated Architecture Flow -->
```
┌─────────┐    ┌──────────���───┐    ┌─────────────┐    ┌───────────┐
│  Client  │───▶│ Load Balancer │───▶│  App Server  │───▶│  Cache    │
└─────────┘    └──────────────┘    └─────────────┘    └─────┬─────┘
                                          │                  │ miss
                                          ▼                  ▼
                                   ┌─────────────┐    ┌───────────┐
                                   │ Message Queue│    │  Database  │
                                   └──────┬──────┘    └───────────┘
                                          ▼
                                   ┌─────────────┐
                                   │   Workers    │
                                   └─────────────┘
```

---

## Features

### 25 Infrastructure Components

Drag-and-drop real system building blocks onto an interactive canvas.

| Category | Components |
|----------|-----------|
| **Networking** | DNS, CDN, Load Balancer, API Gateway, Rate Limiter, Reverse Proxy |
| **Compute** | App Server, Auth Service, WebSocket Server, Task Scheduler, Stream Processor, Notification Service |
| **Storage** | SQL Database, NoSQL Database, Cache/Redis, Object Storage, Search/ES, Graph Database, Time-Series DB, Data Warehouse |
| **Messaging** | Message Queue (Kafka/SQS/RabbitMQ) |
| **Infrastructure** | Service Mesh, Monitoring, Service Discovery, Distributed Lock |

Each component has **realistic specs**: maxQPS, latency, stateful/stateless, scalability — all verified against real-world benchmarks (Redis 100K ops/s, S3 75ms first-byte, LB 1M QPS).

### 20 Design Problems

From Easy to Hard, covering the most common interview questions:

| # | Problem | Difficulty | Key Concepts |
|---|---------|-----------|-------------|
| 1 | URL Shortener | Easy | Hashing, caching, 100:1 read/write |
| 2 | Rate Limiter | Easy | Token bucket, sliding window, Redis |
| 3 | Parking Lot | Easy | IoT events, availability tracking |
| 4 | Twitter / News Feed | Hard | Fan-out, timeline, hybrid approach |
| 5 | Chat System | Hard | WebSocket, presence, message ordering |
| 6 | Uber / Ride Sharing | Hard | Geohash, location streaming, matching |
| 7 | YouTube / Video Streaming | Hard | CDN, transcoding, tiered storage |
| 8 | Notification System | Medium | Priority queues, multi-channel delivery |
| 9 | Typeahead / Autocomplete | Medium | Trie, prefix search, offline aggregation |
| 10 | Web Crawler | Medium | URL frontier, politeness, dedup |
| 11 | Distributed Cache | Medium | Consistent hashing, eviction, hot keys |
| 12 | Payment System | Hard | Idempotency, saga pattern, double-entry ledger |
| 13 | Ticket Booking | Hard | Virtual queue, seat locking, flash sales |
| 14 | Google Docs / Collaborative Editor | Hard | OT/CRDT, WebSocket, version history |
| 15 | Dropbox / File Storage | Hard | Block chunking, delta sync, dedup |
| 16 | Instagram / Photo Sharing | Medium | Media pipeline, feed gen, CDN strategy |
| 17 | Spotify / Music Streaming | Medium | Adaptive bitrate, pre-fetch, collab filtering |
| 18 | Amazon / E-Commerce | Hard | Microservices, inventory, event sourcing |
| 19 | Slack / Team Messaging | Hard | Channel model, search, connection gateway |
| 20 | Metrics / Monitoring | Hard | Time-series ingestion, downsampling, alerting |

Each problem includes **requirements** (QPS, storage, latency targets), **constraints**, **progressive hints**, and a **reference architecture** you can load onto the canvas.

### Traffic Simulation Engine

Simulate real load flowing through your architecture with animated traffic visualization:

<div align="center">
  <img src="public/traffic-sim.svg" alt="Traffic simulation with animated dots flowing through components" width="800"/>
</div>

**Engine features:**
- **Kahn's topological sort** for correct fan-in QPS accumulation (not BFS)
- **Smart traffic splitting**: Load balancers split evenly; other components fan-out 100% to each child
- **Cycle detection** with warnings
- **Configurable load**: 1K – 500K requests/sec
- **Per-node metrics**: QPS, utilization %, latency, status (healthy/warning/critical)
- **Bottleneck detection** with cascading failure visualization

### 5-Category Scoring Engine

Get scored across the dimensions interviewers actually evaluate:

<div align="center">
  <img src="public/scoring.svg" alt="Animated scoring — circular score + 5 category bars" width="800"/>
</div>

**Scoring checks:**
- Load balancing, horizontal scaling, caching, async processing
- No single points of failure, replica redundancy, monitoring
- CDN usage, cache-before-DB patterns, minimal hop count
- Right-sized components, polyglot persistence
- Read/write separation, defense in depth, architecture depth

### Save, Load & Export

- **Save designs** to localStorage with custom names (Ctrl+S)
- **Load saved designs** from your library (Ctrl+O)
- **Export as PNG** — high-res 2x screenshot of your architecture (Ctrl+E)
- **Export as SVG** — vector format for presentations
- **Export as JSON** — raw data for sharing or version control
- **Import designs** from JSON files

### Text Annotations

Add notes directly on the canvas:
- Double-click to edit
- Multi-line support
- Place explanations next to components
- Saved with your design

### Capacity Calculator

Built-in back-of-envelope estimation:
- Input: QPS, data size, write ratio
- Output: daily requests, bandwidth, storage per day/month/year
- Proper write-only storage calculation (reads don't create data)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js 16 App                       │
├────────────┬──────────────────────────┬─────────────────────┤
│  Sidebar   │     ReactFlow Canvas     │    Right Panel      │
│            │                          │                     │
│ • Problems │  • Component Nodes       │ • Properties        │
│ • Component│  • Text Annotation Nodes │ • Simulation Ctrl   │
│   Palette  │  • Animated Edges        │ • Metrics Display   │
│ • Search   │  • MiniMap + Controls    │ • Score Report      │
│            │                          │ • Capacity Calc     │
├────────────┴──────────────────────────┴─────────────────────┤
│                     Zustand Stores                          │
│  canvasStore │ simulationStore │ appStore │ savedDesignsStore│
├─────────────────────────────────────────────────────────────┤
│                      Core Engines                           │
│         simulator.ts (Kahn's)  │  scorer.ts (5 categories) │
├─────────────────────────────────────────────────────────────┤
│                        Data Layer                           │
│    25 Components  │  20 Problems  │  localStorage (saves)   │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

```bash
git clone https://github.com/vijaygupta18/system-design-simulator.git
cd system-design-simulator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. **Pick a problem** — select from the dropdown (e.g., "Design Twitter")
2. **Read requirements** — check QPS, storage, latency targets in the right panel
3. **Build your design** — drag components from the sidebar, connect them with edges
4. **Add replicas** — select a node, adjust the replica slider
5. **Add notes** — click "Add Note" to place text annotations
6. **Simulate traffic** — set QPS in the Simulate tab, click Run
7. **Review metrics** — check per-node utilization, find bottlenecks
8. **Score your design** — click Score for a detailed 5-category report
9. **Compare with reference** — load the expert solution to see what you missed
10. **Save & export** — Ctrl+S to save, Ctrl+E to export as image

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Run simulation |
| `Ctrl+Shift+S` | Score design |
| `Ctrl+S` | Save design |
| `Ctrl+O` | Load design |
| `Ctrl+E` | Export as PNG |
| `Delete` / `Backspace` | Delete selected node |
| `Escape` | Deselect |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript |
| Canvas | @xyflow/react (ReactFlow v12) |
| State | Zustand v5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Export | html-to-image |
| Persistence | localStorage |

## Project Structure

```
src/
├── app/                    # Next.js app router
├── components/
│   ├── canvas/             # ReactFlow canvas, nodes, edges
│   ├── dialogs/            # Save/Load dialogs
│   ├── layout/             # AppShell, TopBar
│   ├── panel/              # Right panel (properties, simulation, scoring)
│   ├── sidebar/            # Left sidebar (problems, components)
│   └── ui/                 # shadcn/ui primitives
├── data/
│   ├── components.ts       # 25 system components with specs
│   └── problems.ts         # 20 design problems with references
├── engine/
│   ├── simulator.ts        # Traffic simulation (topological sort)
│   └── constants.ts        # Thresholds
├── lib/
│   ├── exportCanvas.ts     # PNG/SVG/JSON export
│   └── utils.ts            # Helpers
├── scoring/
│   ├── scorer.ts           # Main scoring orchestrator
│   └── rules/              # 5 scoring rule modules
├── store/
│   ├── appStore.ts         # UI state
│   ├── canvasStore.ts      # Nodes & edges
│   ├── simulationStore.ts  # Simulation state
│   └── savedDesignsStore.ts# Persistent saves
└── types/                  # TypeScript interfaces
```

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

```bash
# Development
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Run ESLint
```

## License

[MIT](LICENSE)

---

<div align="center">

Built by [@vijaygupta18](https://github.com/vijaygupta18)

**If this helps your interview prep, give it a star.**

</div>
