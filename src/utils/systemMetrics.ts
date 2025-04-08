/**
 * Utility functions for collecting system metrics
 */

// Mock system data for development purposes
export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
  };
  memory: {
    used: number; // GB
    total: number; // GB
    usage: number; // Percentage
  };
  system: {
    uptime: number; // seconds
    processes: number;
  };
  disk: {
    used: number; // GB
    total: number; // GB
    usage: number; // Percentage
  };
  processes: Array<{
    pid: number;
    name: string;
    cpu: number;
    memory: number;
  }>;
}

/**
 * Collect system metrics
 * In a real implementation, this would use system APIs or execute commands
 * For now, we'll generate mock data
 */
export async function collectSystemMetrics(): Promise<SystemMetrics> {
  // In a real implementation, this would use node-os-utils, systeminformation,
  // or execute commands like 'htop' and parse the output

  // For now, generate mock data
  const cpuUsage = Math.floor(Math.random() * 30) + 30; // Random between 30-60%
  const memoryUsage = Math.floor(Math.random() * 20) + 40; // Random between 40-60%
  const diskUsage = Math.floor(Math.random() * 30) + 50; // Random between 50-80%

  // Generate random process data
  const processes = [
    {
      pid: 1234,
      name: "chrome",
      cpu: Math.floor(Math.random() * 15) + 5,
      memory: parseFloat((Math.random() * 1.5).toFixed(1)),
    },
    {
      pid: 5678,
      name: "node",
      cpu: Math.floor(Math.random() * 10) + 3,
      memory: parseFloat((Math.random() * 1.2).toFixed(1)),
    },
    {
      pid: 9012,
      name: "vscode",
      cpu: Math.floor(Math.random() * 8) + 2,
      memory: parseFloat((Math.random() * 0.8).toFixed(1)),
    },
    {
      pid: 3456,
      name: "spotify",
      cpu: Math.floor(Math.random() * 5) + 1,
      memory: parseFloat((Math.random() * 0.5).toFixed(1)),
    },
    {
      pid: 7890,
      name: "discord",
      cpu: Math.floor(Math.random() * 4) + 1,
      memory: parseFloat((Math.random() * 0.4).toFixed(1)),
    },
  ];

  return {
    cpu: {
      usage: cpuUsage,
      cores: 8,
      temperature: Math.floor(Math.random() * 10) + 40, // Random between 40-50°C
    },
    memory: {
      used: parseFloat(((16 * memoryUsage) / 100).toFixed(1)),
      total: 16,
      usage: memoryUsage,
    },
    system: {
      uptime: Math.floor(Math.random() * 86400) + 86400, // Random between 1-2 days in seconds
      processes: Math.floor(Math.random() * 50) + 100, // Random between 100-150 processes
    },
    disk: {
      used: Math.floor((512 * diskUsage) / 100),
      total: 512,
      usage: diskUsage,
    },
    processes: processes,
  };
}

/**
 * Save system metrics to a JSON file
 */
export async function saveMetricsToFile(
  metrics: SystemMetrics,
): Promise<string> {
  // In a real implementation, this would write to a file
  // For now, just return a success message
  console.log("Metrics would be saved to file:", metrics);
  return "metrics.json";
}

/**
 * Read system metrics from a JSON file
 */
export async function readMetricsFromFile(): Promise<SystemMetrics | null> {
  // In a real implementation, this would read from a file
  // For now, just return null to indicate no cached data
  return null;
}
