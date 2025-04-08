import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import MetricsPanel from "./dashboard/MetricsPanel";
import UsageChart from "./dashboard/UsageChart";
import ProcessTable from "./dashboard/ProcessTable";
import ThemeToggle from "./dashboard/ThemeToggle";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { getMetrics } from "../api/metrics";
import { SystemMetrics } from "../utils/systemMetrics";

const Home = () => {
  // State for metrics data
  const [metricsData, setMetricsData] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State for historical data
  const [historicalData, setHistoricalData] = useState<
    Array<{
      timestamp: string;
      cpu: number;
      memory: number;
    }>
  >([]);

  // Function to fetch metrics data from API
  const fetchMetricsData = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      const metrics = await getMetrics(forceRefresh);
      setMetricsData(metrics);

      // Add new point to historical data
      const now = new Date();
      setHistoricalData((prev) => [
        ...prev.slice(-23), // Keep only the last 23 items (24 total with new one)
        {
          timestamp: now.toISOString(),
          cpu: metrics.cpu.usage,
          memory: metrics.memory.usage,
        },
      ]);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMetricsData();
  }, []);

  // Use the auto-refresh hook
  const { autoRefresh, toggleAutoRefresh, manualRefresh } = useAutoRefresh({
    initialState: true,
    refreshInterval: 5000,
    onRefresh: () => fetchMetricsData(true),
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Resource Monitor</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Auto-refresh</span>
            <Switch checked={autoRefresh} onCheckedChange={toggleAutoRefresh} />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="space-y-6">
        <div className="flex justify-end">
          <Button
            onClick={manualRefresh}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Collecting..." : "Collect Now"}
          </Button>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle>Current System Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {metricsData ? (
              <MetricsPanel
                cpuUsage={metricsData.cpu.usage}
                memoryUsage={metricsData.memory.usage}
                totalMemory={metricsData.memory.total}
                uptime={metricsData.system.uptime}
                diskUsage={metricsData.disk.usage}
              />
            ) : (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle>Resource Usage History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <UsageChart data={historicalData} />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle>Top Processes</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {metricsData ? (
              <ProcessTable
                processes={metricsData.processes}
                isLoading={isLoading}
              />
            ) : (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
        <p>System Resource Monitor Dashboard © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Home;
