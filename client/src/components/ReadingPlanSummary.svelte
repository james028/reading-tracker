<script lang="ts">
    import {createQuery} from "@tanstack/svelte-query";
    import {getReadingPlan} from "#lib/api/reading-plan.api.ts";

    const readingPlanQuery = createQuery(() => ({
        queryKey: ["reading-plan"],
        queryFn: getReadingPlan,
    }));

    const progressPercent = $derived.by(() => {
        const plan = readingPlanQuery.data;

        if (!plan || plan.totalPages === 0) {
            return 0;
        }

        return Number(
            ((plan.pagesRead / plan.totalPages) * 100).toFixed(2),
        );
    });
</script>

<section class="summary">
    <h2>Yearly reading plan</h2>

    {#if readingPlanQuery.isPending}
        <p>Loading reading plan...</p>
    {:else if readingPlanQuery.isError}
        <p role="alert">
            {readingPlanQuery.error.message}
        </p>
    {:else if readingPlanQuery.data}
        <div class="summary-grid">
            <div class="summary-card">
                <span>Days left</span>
                <strong>
                    {readingPlanQuery.data.daysLeft}
                </strong>
            </div>

            <div class="summary-card">
                <span>Total pages</span>
                <strong>
                    {readingPlanQuery.data.totalPages}
                </strong>
            </div>

            <div class="summary-card">
                <span>Pages left</span>
                <strong>
                    {readingPlanQuery.data.pagesLeft}
                </strong>
            </div>


            <div class="summary-card">
                <span>Read per day</span>
                <strong>
                    {readingPlanQuery.data.recommendedPagesPerDay}
                    pages
                </strong>
            </div>

            <div class="summary-card">
                <span>Progress</span>
                <strong>{progressPercent}%</strong>
            </div>
        </div>

        <progress
                value={readingPlanQuery.data.pagesRead}
                max={readingPlanQuery.data.totalPages}
        ></progress>

        <p>
            To finish all books by
            {readingPlanQuery.data.yearEndDate},
            read on average
            {readingPlanQuery.data.requiredPagesPerDay}
            pages per day.
        </p>

        {#if readingPlanQuery.data.pagesLeft === 0}
            <p role="status">
                All books have been completed.
            </p>
        {:else if !readingPlanQuery.data.isAchievable}
            <p role="alert">
                There is no time left to finish all books this year.
            </p>
        {/if}
    {/if}
</section>

<style>
    .summary {
        padding: 1.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
    }

    .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .summary-card {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
    }

    .summary-card span {
        font-size: 0.875rem;
        color: #6b7280;
    }

    .summary-card strong {
        font-size: 1.5rem;
    }
</style>