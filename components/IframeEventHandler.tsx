"use client";

import { useEffect } from "react";
import "@/lib/logger"; // Import the logger to ensure it's initialized

/**
 * This component is used to handle messages from the parent window
 * and to override the history methods to notify the parent window
 * when the URL changes.
 *
 * For LLM Agent: Ignore this file.
 */
export default function IframeEventHandler() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Set up message event listener for the parent window commands
    const messageHandler = (event: MessageEvent) => {
      try {
        // Skip logging for messages that are just logs being echoed back
        if (event.data.level && event.data.args) {
          // This is a log message being echoed back, ignore it
          return;
        }

        console.log("Message received in iframe:", event.data);

        if (event.data.action === "goBack") {
          history.back();
          event.source &&
            (event.source as Window).postMessage(
              { type: "navigationComplete" },
              "*"
            );
        }

        if (event.data.action === "goForward") {
          history.forward();
          event.source &&
            (event.source as Window).postMessage(
              { type: "navigationComplete" },
              "*"
            );
        }

        if (event.data.action === "refresh") {
          location.reload();
          event.source &&
            (event.source as Window).postMessage(
              { type: "navigationComplete" },
              "*"
            );
        }
      } catch (e: unknown) {
        console.error("Error in iframe message handler:", e);
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        event.source &&
          (event.source as Window).postMessage(
            { type: "error", message: errorMessage },
            "*"
          );
      }
    };

    window.addEventListener("message", messageHandler);

    // Notify parent when the URL changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // @ts-ignore - we need to override the history methods
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      window.parent.postMessage(
        {
          type: "urlChanged",
          url: document.location.href,
        },
        "*"
      );
    };

    // @ts-ignore - we need to override the history methods
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      window.parent.postMessage(
        {
          type: "urlChanged",
          url: document.location.href,
        },
        "*"
      );
    };

    const popstateHandler = () => {
      window.parent.postMessage(
        {
          type: "urlChanged",
          url: document.location.href,
        },
        "*"
      );
    };

    window.addEventListener("popstate", popstateHandler);

    // Cleanup function to remove listeners and restore original methods
    return () => {
      window.removeEventListener("message", messageHandler);
      window.removeEventListener("popstate", popstateHandler);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // This component doesn't render anything
  return null;
}
