import { apiRequest } from "./http";

export function login(password: string): Promise<{ sessionToken: string }> {
  return apiRequest<{ sessionToken: string }>(`/admin/login`, {
    method: "POST",
    body: JSON.stringify({
      password,
    }),
  });
}

export function logout(): Promise<void> {
  return apiRequest<void>(`/admin/logout`, {
    method: "POST",
  });
}
