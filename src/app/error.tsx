"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <h2 className="text-xl font-bold text-white mb-4">Something went wrong!</h2>
      <p className="text-gray mb-6 text-sm">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-gold text-dark font-bold rounded-lg hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
