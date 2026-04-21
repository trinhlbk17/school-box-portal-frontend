import React from "react";

export function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-card p-8 rounded-xl shadow-lg border border-border text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-primary-600 mb-4 tracking-tight">
          School Box Portal
        </h1>
        <p className="text-muted-foreground mb-6">
          Vite + React + Tailwind v4 + shadcn/ui Foundation is ready.
        </p>
        <div className="skeleton h-4 w-3/4 mx-auto rounded"></div>
      </div>
    </div>
  );
}
