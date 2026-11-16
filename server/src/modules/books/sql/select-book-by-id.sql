SELECT
    id,
    title,
    author,
    total_pages,
    created_at,
    updated_at
FROM books
WHERE id = $1;