"use client";

// This file should be ignored by LLM Agent

import pino from "pino";

// Create logger instance
const logger = pino({
  level: "debug",
  browser: { asObject: true },
});

// Self-invoking function to set up console interception immediately on import
(function setupConsoleInterception() {
  // Only run on client side
  if (typeof window === "undefined") return;

  // Map console methods to Pino methods
  const levelMapping = {
    log: "info",
    info: "info",
    warn: "warn",
    error: "error",
    debug: "debug",
  } as const;

  // Store original console methods
  const originalMethods: Record<keyof typeof levelMapping, Function> =
    {} as Record<keyof typeof levelMapping, Function>;

  // Override each console method
  (["log", "info", "warn", "error", "debug"] as const).forEach((level) => {
    // Store original method
    originalMethods[level] = console[level];

    // Override console method
    console[level] = (...args: any[]) => {
      // Use Pino for structured logging
      logger[levelMapping[level]](args.length === 1 ? args[0] : args);

      // Send to parent window if in iframe
      try {
        window.parent?.postMessage({ level, args, time: Date.now() }, "*");
      } catch (e) {
        // Silently fail if postMessage fails
      }

      // Call original method
      originalMethods[level](...args);
    };
  });

  window.addEventListener("error", (e) => console.error(e.error));
  window.addEventListener("unhandledrejection", (e) => console.error(e.reason));
})();
