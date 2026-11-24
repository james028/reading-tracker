<script lang="ts">
  import type { Book } from "#lib/types/book.ts";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { createReadingSessions } from "#lib/api/reading-sessions.api.ts";
  import { ApiError } from "#lib/api/http.ts";

  interface BookCard {
    book: Book;
    index: number;
  }

  let { book, index }: BookCard = $props();
  let pagesByBookId = $state<Record<string, number | undefined>>({});
  let isStatsUpdated = $state(false);

  function highlightStats() {
    isStatsUpdated = true;

    setTimeout(() => {
      isStatsUpdated = false;
    }, 800);
  }

  const setPages = (bookId: string, value: number | undefined) => {
    pagesByBookId[bookId] = value;
  };
  const handleChange = (event: Event, bookId: string) => {
    const target = event.currentTarget as HTMLInputElement;
    setPages(bookId, target.value === "" ? undefined : Number(target.value));
  };

  const queryClient = useQueryClient();

  let readingDate = $state(new Date().toISOString().slice(0, 10));
  let errorMessage = $state<string | null>(null);
  let successMessage = $state<string | null>(null);

  const createSessionMutation = createMutation(() => ({
    mutationFn: createReadingSessions,
    onSuccess: async () => {
      errorMessage = "";
      successMessage = "Reading session added.";
      highlightStats();

      await queryClient.invalidateQueries({
        queryKey: ["books"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["reading-plan"],
      });

      pagesByBookId = {};
    },
    onError: (error: Error) => {
      successMessage = "";

      console.log(error);
      errorMessage =
        error instanceof ApiError
          ? error.message
          : "Nie udało się połączyć z serwerem. Spróbuj ponownie.";
    },
  }));

  const handleCreateSession = (bookId: string) => {
    errorMessage = "";
    successMessage = "";

    createSessionMutation.mutate({
      bookId,
      pagesRead: Number(pagesByBookId[bookId]),
      readingDate,
    });
  };
</script>

<li>
  <article class="book-card">
    <div class="book-header">
      <div class="book-info">
        <h3>{index + 1}. {book.title}</h3>
        <p class="muted">{book.author}</p>
      </div>
      <span class="badge stat-value" class:stat-value--updated={isStatsUpdated}>
        {book.progressPercent ?? 0}%
      </span>
    </div>
    <progress class="progress" value={book.pagesRead} max={book.totalPages}
    ></progress>
    <div class="book-stats">
      <span class="stat-value" class:stat-value--updated={isStatsUpdated}>
        Pages read: {book.pagesRead ?? 0}
        of {book.totalPages ?? 0}
      </span><br />
      <span class="muted stat-value" class:stat-value--updated={isStatsUpdated}>
        Pages left: {book.pagesLeft ?? 0}
      </span>
    </div>
  </article>
  <div class="session-form">
    <input
      class="session-input"
      type="number"
      min="1"
      placeholder="Pages read"
      value={pagesByBookId[book.id] ?? ""}
      oninput={(event) => handleChange(event, book.id)}
    />

    <button
      class="session-button"
      disabled={!pagesByBookId[book.id]}
      onclick={() => handleCreateSession(book.id)}
    >
      Add page(s)
    </button>

    {#if errorMessage}
      <p class="session-message session-message--error" role="alert">
        {errorMessage}
      </p>
    {/if}

    {#if successMessage}
      <p class="session-message session-message--success" role="status">
        {successMessage}
      </p>
    {/if}
  </div>
</li>

<style>
  .session-form {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin-top: 0.75rem;
  }

  .session-input {
    width: 7rem;
    padding: 0.45rem 0.6rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #111827;
    background-color: #ffffff;
  }

  .session-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }

  .session-button {
    padding: 0.45rem 0.75rem;
    border: none;
    border-radius: 0.375rem;
    background-color: #2563eb;
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
  }

  .session-button:hover:not(:disabled) {
    background-color: #1d4ed8;
  }

  .session-button:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  .session-message {
    width: 100%;
    margin: 0;
    font-size: 0.8125rem;
  }

  .session-message--error {
    color: #dc2626;
  }

  .session-message--success {
    color: #16a34a;
  }

  .stat-value {
    font-variant-numeric: tabular-nums;
    transition: color 200ms ease;
  }

  .stat-value--updated {
    color: #16a34a;
  }
</style>
