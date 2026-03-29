"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentPalette } from "./ComponentPalette";
import { ProblemSelector } from "./ProblemSelector";

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  return (
    <aside
      className={`glass-panel flex shrink-0 flex-col border-r border-zinc-800/80 overflow-hidden transition-all duration-300 ease-in-out ${
        open ? "w-[280px] opacity-100" : "w-0 opacity-0 border-r-0"
      }`}
      aria-hidden={!open || undefined}
      inert={!open || undefined}
    >
      <div className="flex w-[280px] flex-1 flex-col">
        <Tabs defaultValue="components" className="flex flex-1 flex-col">
          <TabsList className="mx-2 mt-2 h-9 w-auto shrink-0 bg-zinc-700/40">
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
      </div>
    </aside>
  );
}
