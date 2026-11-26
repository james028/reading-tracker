import { render } from "@testing-library/svelte";
import { QueryClient } from "@tanstack/svelte-query";
import type { Component } from "svelte";
import TestQueryWrapper from "./TestQueryWrapper.svelte";

export function renderWithQueryClient(
  component: Component<any>,
  props: Record<string, unknown> = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(TestQueryWrapper, {
    props: {
      client: queryClient,
      component,
      componentProps: props,
    },
  });
}