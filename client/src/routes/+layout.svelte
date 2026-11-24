<script lang="ts">
  import favicon from "#lib/assets/favicon.svg";

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

  import "../app.css";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: typeof window !== "undefined",
      },
    },
  });
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
  <main>
    {@render children()}
  </main>
</QueryClientProvider>
