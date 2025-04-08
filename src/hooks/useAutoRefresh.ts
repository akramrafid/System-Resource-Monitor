import { useState, useEffect } from "react";

interface UseAutoRefreshProps {
  initialState?: boolean;
  refreshInterval?: number;
  onRefresh: () => void;
}

export function useAutoRefresh({
  initialState = true,
  refreshInterval = 5000,
  onRefresh,
}: UseAutoRefreshProps) {
  const [autoRefresh, setAutoRefresh] = useState(initialState);

  // Toggle auto-refresh function
  const toggleAutoRefresh = () => {
    setAutoRefresh((prev) => !prev);
  };

  // Manual refresh function
  const manualRefresh = () => {
    onRefresh();
  };

  // Effect for auto-refresh
  useEffect(() => {
    let intervalId: number | undefined;

    if (autoRefresh) {
      intervalId = window.setInterval(() => {
        onRefresh();
      }, refreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, refreshInterval, onRefresh]);

  return {
    autoRefresh,
    toggleAutoRefresh,
    manualRefresh,
  };
}
