<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	import '../app.css';
	import ReadingPlanSummary from "../components/ReadingPlanSummary.svelte";

	const queryClient = new QueryClient();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<main>
		<section class="section">
			<ReadingPlanSummary />
		</section>
	</main>
</QueryClientProvider>