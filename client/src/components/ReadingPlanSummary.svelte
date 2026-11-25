<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { getReadingPlan } from "#lib";
  import { getBooks } from "#lib";
  import BookCard from "./BookCard.svelte";

  const readingPlanQuery = createQuery(() => ({
    queryKey: ["reading-plan"],
    queryFn: getReadingPlan,
  }));

  const booksQuery = createQuery(() => ({
    queryKey: ["books"],
    queryFn: getBooks,
  }));

  const countBooks = $derived(
    booksQuery?.data?.items?.reduce(
      (count, book) => count + (book.pagesLeft !== 0 ? 1 : 0),
      0,
    ) ?? 0,
  );

  const progressPercent = $derived.by(() => {
    const plan = readingPlanQuery.data;

    if (!plan || plan.totalPages === 0) {
      return 0;
    }

    return Number(((plan.pagesRead / plan.totalPages) * 100).toFixed(2));
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
  {:else if Object.keys(readingPlanQuery.data).length === 0}
    <p>No reading plan data available.</p>
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
          {readingPlanQuery.data.pagesLeft} <span>in {countBooks} book(s)</span>
        </strong>
      </div>

      <div class="summary-card">
        <span>Read today</span>
        <strong>
          {readingPlanQuery.data.pagesReadToday}
          <span>pages</span>
        </strong>
      </div>

      <div class="summary-card">
        <span>Read per day</span>
        <strong>
          {readingPlanQuery.data.recommendedPagesPerDay}
          <span>pages</span>
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
  }

  .summary-card span {
    font-size: 0.82rem;
    color: #6b7280;
  }

  .summary-card strong {
    font-size: 1.5rem;
  }

  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .section-margin {
    margin-top: 1rem;
  }
</style>
