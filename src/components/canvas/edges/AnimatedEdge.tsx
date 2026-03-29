"use client";

import { memo } from "react";
import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { useSimulationStore } from "@/store/simulationStore";

function AnimatedEdgeInner({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}: EdgeProps) {
  const isRunning = useSimulationStore((s) => s.isRunning);

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g>
      {/* Glow layer */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(34, 211, 238, 0.08)"
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Main edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: "rgba(34, 211, 238, 0.25)",
          strokeWidth: 1.5,
        }}
      />
      {/* Animated dots — only render when simulation is running */}
      {isRunning && (
        <>
          <circle r="2.5" fill="rgb(34, 211, 238)" opacity="0.9">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>
          <circle r="2" fill="rgb(34, 211, 238)" opacity="0.5">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={edgePath}
              begin="0.7s"
            />
          </circle>
          <circle r="1.5" fill="rgb(34, 211, 238)" opacity="0.3">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={edgePath}
              begin="1.4s"
            />
          </circle>
        </>
      )}
    </g>
  );
}

export const AnimatedEdge = memo(AnimatedEdgeInner);
