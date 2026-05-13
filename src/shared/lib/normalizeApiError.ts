import axios from "axios";
import type { AppError } from "@/shared/types/api.types";

/**
 * Converts any error into a consistent AppError shape.
 * Always call this before surfacing errors to hooks or UI.
 */
export function normalizeApiError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data;
    if (body?.code && body?.message) {
      return {
        code: body.code,
        message: body.message,
        statusCode: error.response?.status ?? 500,
      };
    }
    return {
      code: "UNKNOWN",
      message: body?.message ?? "An unexpected error occurred",
      statusCode: error.response?.status ?? 500,
    };
  }
  if (!window.navigator.onLine) {
    return { code: "NETWORK_ERROR", message: "Unable to reach the server", statusCode: 0 };
  }
  return { code: "UNKNOWN", message: "An unexpected error occurred", statusCode: 500 };
}
