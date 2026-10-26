import { NextResponse } from "next/server";

export class AppError extends Error {
  statusCode: number;
  message: string;
  error?: string;

  constructor(statusCode: number, message: string, error?: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}

export type ResponseSuccess<T = unknown> = {
  statusCode: number;
  data: T;
  meta?: Record<string, unknown>;
};

export type ResponseFailure = {
  statusCode: number;
  error?: string;
  message: string;
};

export type HandlerResponse<T = unknown> = ResponseSuccess<T> | ResponseFailure;

export function ok<T>(
  data: T,
  statusCode: number = 200,
  meta?: Record<string, unknown>
): ResponseSuccess<T> {
  return { statusCode, data, ...(meta ? { meta } : {}) };
}

export function badRequest(message: string, error?: string): ResponseFailure {
  return { statusCode: 400, message, error };
}

export function notFound(message: string = "Not found", error?: string): ResponseFailure {
  return { statusCode: 404, message, error };
}

export function unauthorized(message: string = "Unauthorized", error?: string): ResponseFailure {
  return { statusCode: 401, message, error };
}

export function internal(message: string = "Internal server error", error?: string): ResponseFailure {
  return { statusCode: 500, message, error };
}

export function toNextResponse(res: HandlerResponse): NextResponse {
  if ("data" in res) {
    const { statusCode, ...body } = res;
    return NextResponse.json(body, { status: statusCode });
  }
  const { statusCode, ...body } = res;
  return NextResponse.json(body, { status: statusCode });
}

export async function withHandler<T>(
  handler: () => Promise<HandlerResponse<T>>
): Promise<HandlerResponse<T>> {
  try {
    return await handler();
  } catch (err) {
    if (err instanceof AppError) {
      return { statusCode: err.statusCode, message: err.message, error: err.error };
    }
    return { statusCode: 500, message: "Internal server error", error: String(err) };
  }
}
