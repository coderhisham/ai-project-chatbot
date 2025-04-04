"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [loadingStage, setLoadingStage] = useState(1);

  // Array of loading messages
  const loadingMessages = [
    "Connecting to server...",
    "Initializing services...",
    "Loading resources...",
    "Almost ready...",
  ];

  // Cycle through the different loading stages
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStage((prevStage) =>
        prevStage >= loadingMessages.length ? 1 : prevStage + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Loading screen */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-6"></div>

        {/* Loading message */}
        <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          {loadingMessages[loadingStage - 1]}
        </div>

        {/* Progress dots */}
        <div className="flex space-x-2 mt-4">
          {[1, 2, 3, 4].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full ${
                dot <= loadingStage
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
