import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, Clock, Server } from "lucide-react";

interface MetricsPanelProps {
  cpuUsage?: number;
  memoryUsage?: number;
  uptime?: number;
  totalMemory?: number;
  diskUsage?: number;
}

const MetricsPanel = ({
  cpuUsage = 45,
  memoryUsage = 62,
  uptime = 86400, // 24 hours in seconds
  totalMemory = 16, // GB
  diskUsage = 78,
}: MetricsPanelProps) => {
  // Format uptime to readable format
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="w-full space-y-4 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CPU Usage Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{cpuUsage}%</span>
                <span className="text-xs text-muted-foreground">of 100%</span>
              </div>
              <Progress value={cpuUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Memory Usage Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{memoryUsage}%</span>
                <span className="text-xs text-muted-foreground">
                  {((totalMemory * memoryUsage) / 100).toFixed(1)} GB of{" "}
                  {totalMemory} GB
                </span>
              </div>
              <Progress value={memoryUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Uptime Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(uptime)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Since last reboot
            </p>
          </CardContent>
        </Card>

        {/* Total Memory Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Memory</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMemory} GB</div>
            <p className="text-xs text-muted-foreground mt-1">Physical RAM</p>
          </CardContent>
        </Card>

        {/* Disk Usage Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{diskUsage}%</span>
              </div>
              <Progress value={diskUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricsPanel;
