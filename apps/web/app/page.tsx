import React from "react";

export default function HomePage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className="w-full">
        <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
      </div>
    </React.Suspense>
  );
}
