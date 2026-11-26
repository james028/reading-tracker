<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import type { Component } from "svelte";

  let {
    client,
    component,
    componentProps = {},
  }: {
    client: QueryClient;
    component: Component<any>;
    componentProps?: Record<string, any>;
  } = $props();

  const Comp = component;
</script>

<QueryClientProvider {client}>
  <Comp {...componentProps} />
</QueryClientProvider>