import pino from "pino";
import path from "path";
import fs from "fs";

// More comprehensive ANSI code stripping function
function stripAnsiCodes(input: any): any {
  if (typeof input === "string") {
    // This pattern captures ALL ANSI escape sequences more comprehensively
    return input.replace(/\u001b\[\d+(?:;\d+)*m|\u001b\[\d*[a-zA-Z]/g, "");
  } else if (typeof input === "object" && input !== null) {
    if (Array.isArray(input)) {
      return input.map(stripAnsiCodes);
    }
    const result: Record<string, any> = {};
    for (const key in input) {
      result[key] = stripAnsiCodes(input[key]);
    }
    return result;
  }
  return input;
}

export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return; // Skip for Edge runtime

  const logPath = path.join(process.cwd(), "sandbox-server.log");

  // Clear log file on app restart
  try {
    // Check if file exists and truncate it to 0 bytes
    fs.existsSync(logPath) && fs.truncateSync(logPath, 0);
    console.log(`[instrumentation] Cleared log file: ${logPath}`);
  } catch (err) {
    console.error(`[instrumentation] Failed to clear log file: ${err}`);
  }

  const logLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

  // Use serializers for more reliable ANSI stripping
  const logger = pino(
    {
      level: logLevel,
      serializers: {
        // Apply to all string fields
        msg: (msg) => (typeof msg === "string" ? stripAnsiCodes(msg) : msg),
        err: pino.stdSerializers.err,
      },
    },
    pino.destination({
      dest: logPath,
      sync: false, // async for better performance
    })
  );

  patchConsole(logger);
  console.log("[instrumentation] Logging to", logPath);
}

function patchConsole(logger: pino.Logger) {
  // Map console methods to logger methods
  const methods = ["info", "warn", "error", "debug"] as const;

  // Special handling for console.log -> logger.info
  const origLog = console.log;
  console.log = (...args: any[]) => {
    // Format multiple arguments similar to console.log behavior
    if (args.length === 1) {
      logger.info(stripAnsiCodes(args[0]));
    } else if (args.length > 1) {
      // Join arguments into a single message like console.log would
      const formattedMsg = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg) : String(arg)
        )
        .join(" ");
      logger.info(stripAnsiCodes(formattedMsg));
    }
    origLog(...args);
  };

  // Handle other console methods
  methods.forEach((level) => {
    const orig = console[level];
    console[level] = (...args: any[]) => {
      // Format multiple arguments similar to console behavior
      if (args.length === 1) {
        logger[level](stripAnsiCodes(args[0]));
      } else if (args.length > 1) {
        // Join arguments into a single message like console.log would
        const formattedMsg = args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : String(arg)
          )
          .join(" ");
        logger[level](stripAnsiCodes(formattedMsg));
      }
      orig(...args);
    };
  });

  // Handle unhandled errors
  process.on("unhandledRejection", (err) =>
    logger.fatal({ err: stripAnsiCodes(err) }, "Unhandled Rejection")
  );
  process.on("uncaughtException", (err) =>
    logger.fatal({ err: stripAnsiCodes(err) }, "Uncaught Exception")
  );
}
