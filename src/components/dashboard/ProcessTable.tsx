import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
}

interface ProcessTableProps {
  processes?: Process[];
  isLoading?: boolean;
}

const ProcessTable = ({
  processes = mockProcesses,
  isLoading = false,
}: ProcessTableProps) => {
  const [sortColumn, setSortColumn] = React.useState<keyof Process>("cpu");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "desc",
  );

  const handleSort = (column: keyof Process) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedProcesses = React.useMemo(() => {
    if (!processes) return [];

    return [...processes].sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    });
  }, [processes, sortColumn, sortDirection]);

  return (
    <div className="w-full bg-background rounded-lg border shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Top Processes</h2>
        <Badge variant="outline">{sortedProcesses.length} processes</Badge>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("name")}
              >
                Process Name
                {sortColumn === "name" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("pid")}
              >
                PID
                {sortColumn === "pid" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 text-right"
                onClick={() => handleSort("cpu")}
              >
                CPU %
                {sortColumn === "cpu" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 text-right"
                onClick={() => handleSort("memory")}
              >
                Memory %
                {sortColumn === "memory" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProcesses.map((process) => (
              <TableRow key={process.pid}>
                <TableCell className="font-medium">{process.name}</TableCell>
                <TableCell>{process.pid}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <div className="w-16 bg-muted rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(process.cpu, 100)}%` }}
                      />
                    </div>
                    {process.cpu.toFixed(1)}%
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <div className="w-16 bg-muted rounded-full h-2 mr-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min(process.memory, 100)}%` }}
                      />
                    </div>
                    {typeof process.memory === "number"
                      ? process.memory.toFixed(1)
                      : process.memory}
                    %
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

// Mock data for development and default state
const mockProcesses: Process[] = [
  { pid: 1234, name: "chrome", cpu: 12.5, memory: 8.3 },
  { pid: 5678, name: "node", cpu: 8.2, memory: 5.7 },
  { pid: 9101, name: "vscode", cpu: 6.7, memory: 7.2 },
  { pid: 1121, name: "spotify", cpu: 3.4, memory: 4.1 },
  { pid: 3141, name: "terminal", cpu: 1.2, memory: 1.8 },
];

export default ProcessTable;
