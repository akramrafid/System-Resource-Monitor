import React, { useState, useEffect } from "react";
import { Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface UsageChartProps {
  data?: Array<{
    timestamp: string;
    cpu: number;
    memory: number;
  }>;
  title?: string;
  description?: string;
}

const UsageChart = ({
  data = generateMockData(),
  title = "System Resource Usage",
  description = "Historical CPU and memory usage over time",
}: UsageChartProps) => {
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h">("1h");
  const [chartData, setChartData] = useState(data);

  // Update chart data when props data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    }
  }, [data]);

  // Filter data based on selected time range
  useEffect(() => {
    if (data && data.length > 0) {
      const now = new Date();
      let filterTime: Date;

      switch (timeRange) {
        case "1h":
          filterTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case "6h":
          filterTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
          break;
        case "24h":
          filterTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        default:
          filterTime = new Date(now.getTime() - 60 * 60 * 1000);
      }

      const filtered = data.filter(
        (item) => new Date(item.timestamp) >= filterTime,
      );
      setChartData(filtered);
    }
  }, [timeRange, data]);

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Tabs defaultValue="1h" className="w-[180px]">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="1h" onClick={() => setTimeRange("1h")}>
              1h
            </TabsTrigger>
            <TabsTrigger value="6h" onClick={() => setTimeRange("6h")}>
              6h
            </TabsTrigger>
            <TabsTrigger value="24h" onClick={() => setTimeRange("24h")}>
              24h
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, ""]}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cpu"
                name="CPU Usage"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="memory"
                name="Memory Usage"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Generate mock data for preview purposes
function generateMockData() {
  const data = [];
  const now = new Date();

  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(
      now.getTime() - (24 - i) * 15 * 60 * 1000,
    ).toISOString();
    data.push({
      timestamp,
      cpu: Math.floor(Math.random() * 40) + 20, // Random value between 20-60%
      memory: Math.floor(Math.random() * 30) + 40, // Random value between 40-70%
    });
  }

  return data;
}

export default UsageChart;
