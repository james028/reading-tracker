const isDevelopment = process.env.NODE_ENV === "development";

const API_URL = !isDevelopment
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
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new ApiError(
      body?.message ?? `Request failed with status ${response.status}`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
