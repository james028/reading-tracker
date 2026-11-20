<script lang="ts">
    //import type { Book } from '#lib/types/book';

    import {apiRequest} from "#lib/api/http.ts";
    import {createMutation, useQueryClient} from "@tanstack/svelte-query";




    let pagesByBookId = $state<Record<string, number | undefined>>({});

    let { book, index } = $props();

    const setPages = (bookId: any, value: number | undefined) => {
        pagesByBookId[bookId] = value;
    }
    const handleChange = (event: Event, bookId: string) => {
        const target = event.currentTarget as HTMLInputElement;
        setPages(bookId, target.value === '' ? undefined : Number(target.value));
        console.log(pagesByBookId[bookId], pagesByBookId);
    }

    function createReadingSession(
        input: any,
    ): Promise<unknown> {

        console.log(input, "input");
        return apiRequest<unknown>(
            `/books/${input.bookId}/reading-sessions`,
            {
                method: 'POST',
                body: JSON.stringify({
                    pagesRead: input.pagesRead,
                    readingDate: input.readingDate,
                }),
            },
        );
    }

    const queryClient = useQueryClient();

    let pagesRead = $state('');
    let readingDate = $state(
        new Date().toISOString().slice(0, 10),
    );
    let errorMessage = $state('');
    let successMessage = $state('');

    const createSessionMutation = createMutation(() => ({
        mutationFn: createReadingSession,
        onSuccess: async () => {
            //pagesRead = '';
            errorMessage = '';
            successMessage = 'Reading session added.';

            // await queryClient.invalidateQueries({
            //     queryKey: ['books'],
            // });

            await queryClient.invalidateQueries({
                queryKey: ['reading-sessions'],
            });

            await queryClient.invalidateQueries({
                queryKey: ['reading-plan'],
            });
        },
        onError: (error: Error) => {
            successMessage = '';
            errorMessage = error.message;
        },
    }));

    const handleCreateSession = (bookId: string) => {
        errorMessage = '';
        successMessage = '';

        createSessionMutation.mutate({
            bookId,
            pagesRead: Number(pagesByBookId[bookId]),
            readingDate,
        });
    }
</script>

<li>
    <article class="book-card">
        <div class="book-header">
            <div class="book-info">
                <h3>{index + 1}. {book.title}</h3>
                <p class="muted">{book.author}</p>
            </div>
            <span class="badge">
                                {book.progressPercent}%
                            </span>
        </div>
        <progress
                class="progress"
                value={book.pagesRead}
                max={book.totalPages}
        ></progress>
        <div class="book-stats">
                            <span>
                                Pages read: {book.pagesRead}
                                of {book.totalPages}
                            </span><br/>
            <span class="muted">
                                Pages left: {book.pagesLeft}
                            </span>
        </div>
    </article>
    <div>
        <input
                type="number"
                min="1"
                placeholder="Pages read"
                value={pagesByBookId[book.id] ?? ""}
                oninput={(event) => handleChange(event, book.id)}
        />
        <button onclick={() => handleCreateSession(book.id)}>Dodaj</button>
    </div>
</li>