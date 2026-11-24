const isDevelopment = process.env.NODE_ENV === "development";

// export const API_URL = !isDevelopment
//   ? "https://reading-tracker-api-9qyf.onrender.com/api"
//   : "http://127.0.0.1:3000/api";

export const API_URL = !isDevelopment
  ? "https://reading-tracker-api-9qyf.onrender.com/api"
  : "http://127.0.0.1:3000/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new ApiError(
      body?.message ??
        body?.error ??
        `Request failed with status ${response.status}`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
