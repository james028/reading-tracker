<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { getReadingPlan } from "../lib/api/reading-plan.api.js";
  import BookCard from "./BookCard.svelte";
  import { getBooks } from "../lib/api/books.api.js";

  const readingPlanQuery = createQuery(() => ({
    queryKey: ["reading-plan"],
    queryFn: getReadingPlan
  }));

  const booksQuery = createQuery(() => ({
    queryKey: ["books"],
    queryFn: getBooks
  }));

  const countBooks = $derived(
    booksQuery?.data?.items?.reduce(
      (count, book) => count + (book.pagesLeft !== 0 ? 1 : 0),
      0
    ) ?? 0
  );

  const progressPercent = $derived.by(() => {
    const plan = readingPlanQuery.data;

    if (!plan || plan.totalPages === 0) {
      return 0;
    }

    return Number(((plan.pagesRead / plan.totalPages) * 100).toFixed(2));
  });

  const summaryCards: { key: string; label: string; value: number | string; extra?: string }[] = $derived([
    {
      key: "days-left",
      label: "Days left",
      value: readingPlanQuery.data?.daysLeft ?? 0
    },
    {
      key: "total-pages",
      label: "Total pages",
      value: readingPlanQuery.data?.totalPages ?? 0
    },
    {
      key: "pages-left",
      label: "Pages left",
      value: readingPlanQuery.data?.pagesLeft ?? 0,
      extra: `in ${countBooks} book(s)`
    },
    {
      key: "read-today",
      label: "Read today",
      value: readingPlanQuery.data?.pagesReadToday ?? 0,
      extra: "pages"
    },
    {
      key: "read-per-day",
      label: "Read per day",
      value: readingPlanQuery.data?.recommendedPagesPerDay ?? 0,
      extra: "pages"
    },
    {
      key: "progress",
      label: "Progress",
      value: `${progressPercent}%`
    }
  ]);
</script>

<section class="summary">
  <h2>Yearly reading plan</h2>

  {#if readingPlanQuery.isPending}
    <p>Loading reading plan...</p>
  {:else if readingPlanQuery.isError}
    <p role="alert">
      {readingPlanQuery.error.message}
    </p>
  {:else if Object.keys(readingPlanQuery.data).length === 0}
    <p>No reading plan data available.</p>
  {:else if readingPlanQuery.data}
    <div class="summary-grid">
      {#each summaryCards as card (card.key)}
        <div class="summary-card">
          <span class="summary-card__label">{card.label}</span>
          <strong class="summary-card__value">
            {card.value}
            {#if card.extra}
              <span class="summary-card__extra">{card.extra}</span>
            {/if}
          </strong>
        </div>
      {/each}
    </div>

    <progress
      value={readingPlanQuery.data.pagesRead}
      max={readingPlanQuery.data.totalPages}
    ></progress>

    <p>
      <span>
        To finish all books ({countBooks}) by
        {readingPlanQuery.data.yearEndDate}, read on average
        {readingPlanQuery.data.requiredPagesPerDay}
        pages per day.
      </span>
    </p>

    {#if readingPlanQuery.data.pagesLeft === 0}
      <p role="status">All books have been completed.</p>
    {:else if !readingPlanQuery.data.isAchievable}
      <p role="alert">There is no time left to finish all books this year.</p>
    {/if}
  {/if}
</section>

<section class="summary section-margin">
  <h2>Your books</h2>

  {#if booksQuery.isPending}
    <p class="muted">Loading...</p>
  {:else if booksQuery.isError}
    <p class="error" role="alert">
      {booksQuery.error.message}
    </p>
  {:else if booksQuery.isSuccess}
    <ul class="books-list">
      {#if booksQuery?.data?.items.length > 0}
        {#each booksQuery?.data?.items as book, i (book.id)}
          <BookCard {book} index={i} />
        {/each}
      {:else}
        <div>Brak książek do wyświetlenia.</div>
      {/if}
    </ul>
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
        min-width: 0;
    }

    .summary-card__label {
        font-size: 0.82rem;
        color: #6b7280;
    }

    .summary-card__value {
        font-size: 1.5rem;
        font-weight: 700;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .summary-card__extra {
        font-size: 0.85rem;
        font-weight: 400;
        color: #6b7280;
        margin-left: 0.15rem;
    }

    ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .section-margin {
        margin-top: 1rem;
    }
</style>
