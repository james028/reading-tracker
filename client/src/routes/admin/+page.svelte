<script lang="ts">
  import { goto } from "$app/navigation";
  import { createMutation } from "@tanstack/svelte-query";
  import { login, logout } from "#lib/api/login.api.ts";
  import { ApiError } from "#lib/api/http.ts";

  let password = $state("");
  let errorMessage = $state<string | null>(null);

  const loginMutation = createMutation(() => ({
    mutationFn: login,
    onSuccess: async () => {
      await goto("/");
    },
    onError: (error: Error) => {
      errorMessage =
        error instanceof ApiError
          ? error.message
          : "Nie udało się połączyć z serwerem. Spróbuj ponownie.";
    },
  }));

  const logoutMutation = createMutation(() => ({
    mutationFn: logout,
    onSuccess: async () => {
      await goto("/");
    },
    onError: (error: Error) => {
      errorMessage =
        error instanceof ApiError
          ? error.message
          : "Nie udało się połączyć z serwerem. Spróbuj ponownie.";
    },
  }));

  const handleLogin = () => {
    errorMessage = "";

    loginMutation.mutate(password);
  };

  const handleLogout = () => {
    error = "";
    logoutMutation.mutate();
  };
</script>

<main>
  <h1>Admin</h1>

  <form onsubmit={handleLogin}>
    <label for="password">Hasło</label>

    <input id="password" type="password" bind:value={password} required />

    <button type="submit" disabled={loginMutation.isPending}>
      {loginMutation.isPending ? "Logowanie..." : "Zaloguj"}
    </button>

    {#if errorMessage}
      <p>{errorMessage}</p>
    {/if}
  </form>

  <button onclick={handleLogout}>Wyloguj</button>
</main>
