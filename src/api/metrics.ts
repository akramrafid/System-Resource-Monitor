/**
 * API endpoint for system metrics
 */
import {
  collectSystemMetrics,
  saveMetricsToFile,
  readMetricsFromFile,
  SystemMetrics,
} from "../utils/systemMetrics";

// In-memory cache for the latest metrics
let cachedMetrics: SystemMetrics | null = null;
let lastCollectionTime = 0;

/**
 * Get the latest system metrics
 * If forceRefresh is true, collect new metrics
 * Otherwise, return cached metrics if they're less than 10 seconds old
 */
export async function getMetrics(forceRefresh = false): Promise<SystemMetrics> {
  const now = Date.now();
  const cacheAge = now - lastCollectionTime;

  // If we have cached metrics and they're less than 10 seconds old and we're not forcing a refresh
  if (cachedMetrics && cacheAge < 10000 && !forceRefresh) {
    return cachedMetrics;
  }

  // Try to read from file first
  const fileMetrics = await readMetricsFromFile();

  // If we have metrics from file and we're not forcing a refresh, use those
  if (fileMetrics && !forceRefresh) {
    cachedMetrics = fileMetrics;
    return cachedMetrics;
  }

  // Otherwise, collect new metrics
  const newMetrics = await collectSystemMetrics();

  // Save to file
  await saveMetricsToFile(newMetrics);

  // Update cache
  cachedMetrics = newMetrics;
  lastCollectionTime = now;

  return newMetrics;
}

/**
 * Start periodic collection of metrics
 * @param intervalMs Interval in milliseconds
 * @returns A function to stop the collection
 */
export function startPeriodicCollection(intervalMs = 5000): () => void {
  const intervalId = setInterval(async () => {
    try {
      const metrics = await collectSystemMetrics();
      await saveMetricsToFile(metrics);
      cachedMetrics = metrics;
      lastCollectionTime = Date.now();
      console.log("Collected metrics at", new Date().toISOString());
    } catch (error) {
      console.error("Error collecting metrics:", error);
    }
  }, intervalMs);

  // Return a function to stop the collection
  return () => clearInterval(intervalId);
}
