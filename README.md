# SystemSim - System Design Interview Simulator

An interactive platform for practicing system design interviews. Drag-and-drop architecture components, wire them together, simulate real-world load, and get scored on your design.

## Features

### Design Canvas
- Drag-and-drop **15 system components** onto an interactive canvas
- Components include: DNS, CDN, Load Balancer, API Gateway, Rate Limiter, App Server, Auth Service, SQL/NoSQL Databases, Cache/Redis, Object Storage, Search Engine, Message Queue, Service Mesh, and Monitoring
- Connect components with animated edges to build your architecture
- Configure replicas and view component specs

### Load Simulator
- Simulate traffic flowing through your architecture using BFS propagation
- Configurable load: 1K to 500K requests/sec with preset options (Light, Medium, Heavy, Stress)
- Real-time visualization: nodes turn green/yellow/red based on utilization
- Bottleneck detection with pulsing red indicators
- Per-node metrics: QPS, utilization %, latency

### Scoring Engine
- **5 scoring categories** (0-20 points each, 100 total):
  - **Scalability** - Load balancing, horizontal scaling, caching, async processing
  - **Availability** - Redundancy, no single points of failure, monitoring
  - **Latency** - CDN usage, caching strategy, hop count optimization
  - **Cost Efficiency** - Right-sizing, appropriate storage choices
  - **Trade-offs** - Read/write separation, consistency choices, defense in depth
- Animated SVG circular progress score display
- Detailed feedback with educational explanations
- Verdict system: Needs Work / Decent / Good / Excellent / Architect Level

### Problem Library
5 design challenges with increasing difficulty:

| Problem | Difficulty | Key Concepts |
|---------|-----------|-------------|
| URL Shortener | Easy | Caching, Hashing, Read-heavy |
| Twitter / News Feed | Hard | Fan-out, Timeline, Media |
| Chat System | Hard | WebSocket, Messaging, Real-time |
| Uber / Ride Sharing | Hard | Geo-spatial, Matching, Streaming |
| YouTube / Video Streaming | Hard | CDN, Transcoding, Storage tiers |

Each problem includes requirements, constraints, progressive hints, and a reference solution you can load onto the canvas.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **@xyflow/react** (ReactFlow v12) for the interactive canvas
- **Zustand** for state management
- **Tailwind CSS v4** + **shadcn/ui** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **TypeScript** throughout

## Getting Started

```bash
# Clone the repo
git clone https://github.com/vijaygupta18/system-design-simulator.git
cd system-design-simulator

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Select a problem** from the dropdown in the top bar
2. **Drag components** from the left sidebar onto the canvas
3. **Connect components** by dragging from one node's handle to another
4. **Configure replicas** by clicking a node and adjusting the slider in the right panel
5. **Simulate load** - go to the Simulate tab, set QPS, and click "Run Simulation"
6. **Score your design** - click "Score" to get a detailed report card
7. **Load reference** - click "Reference" to see the expert solution

## Design Theme

"Obsidian Terminal" - deep matte blacks with crystalline teal/cyan accents, glassmorphism panels, and ambient depth effects. Designed to feel like a premium developer tool.

## License

MIT
