"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentPalette } from "./ComponentPalette";
import { ProblemSelector } from "./ProblemSelector";

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  if (!open) return null;

  return (
    <aside className="glass-panel flex w-[280px] shrink-0 flex-col border-r border-zinc-800/80 transition-all duration-200">
      <Tabs defaultValue="components" className="flex flex-1 flex-col">
        <TabsList className="mx-2 mt-2 h-9 w-auto shrink-0 bg-zinc-800/50">
          <TabsTrigger
            value="components"
            className="h-8 px-4 text-sm data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
          >
            Components
          </TabsTrigger>
          <TabsTrigger
            value="problems"
            className="h-8 px-4 text-sm data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
          >
            Problems
          </TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="mt-0 flex-1 overflow-hidden">
          <ComponentPalette />
        </TabsContent>

        <TabsContent value="problems" className="mt-0 flex-1 overflow-hidden">
          <ProblemSelector />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
