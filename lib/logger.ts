type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

function formatLog(entry: LogEntry): string {
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(entry);
  }
  const { level, message, timestamp, ...rest } = entry;
  const extra = Object.keys(rest).length > 0 ? ` ${JSON.stringify(rest)}` : "";
  return `[${timestamp}] ${level.toUpperCase()} ${message}${extra}`;
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    const entry: LogEntry = {
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    };
    console.log(formatLog(entry));
  },

  warn(message: string, meta?: Record<string, unknown>) {
    const entry: LogEntry = {
      level: "warn",
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    };
    console.warn(formatLog(entry));
  },

  error(message: string, meta?: Record<string, unknown>) {
    const entry: LogEntry = {
      level: "error",
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    };
    console.error(formatLog(entry));
  },

  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV === "production") return;
    const entry: LogEntry = {
      level: "debug",
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    };
    console.debug(formatLog(entry));
  },
};
